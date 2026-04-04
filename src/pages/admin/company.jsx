import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Input, Form } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { fetchAllCompanyAPI, deleteCompanyAPI } from "../../services/api.service";
import ModalCompany from "../../components/admin/company/modal.company";
import '../../components/admin/admin.page.css';

const CompanyTable = () => {
    const [companies, setCompanies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ name: '', address: '' });
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => { FetchAllCompanies(1, 10, { name: '', address: '' }); }, []);

    const buildQuery = (page, pageSize, f) => {
        let q = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;
        const parts = [];
        if (f.name)    parts.push(`name ~ '${f.name}'`);
        if (f.address) parts.push(`address ~ '${f.address}'`);
        if (parts.length) q = `filter=${parts.join(' and ')}&${q}`;
        return q;
    };

    const FetchAllCompanies = async (page = 1, pageSize = 10, f = filters) => {
        setIsFetching(true);
        try {
            const res = await fetchAllCompanyAPI(buildQuery(page, pageSize, f));
            if (res.data) {
                setCompanies(res.data.result);
                setMeta({ page: res.data.meta.page, pageSize: res.data.meta.pageSize || 10, total: res.data.meta.total || 0 });
            }
        } catch { message.error("Lỗi khi tải danh sách công ty"); }
        setIsFetching(false);
    };

    const handleSearch = (values) => { setFilters(values); FetchAllCompanies(1, meta.pageSize, values); };
    const handleReset = () => { form.resetFields(); const f = { name: '', address: '' }; setFilters(f); FetchAllCompanies(1, meta.pageSize, f); };

    const handleDelete = async (id) => {
        const res = await deleteCompanyAPI(id);
        if (res?.statusCode === 202) { message.success("Đã xóa công ty"); FetchAllCompanies(meta.page, meta.pageSize); }
        else message.error("Có lỗi xảy ra");
    };

    const columns = [
        {
            title: "#", key: "index", width: 52, align: "center",
            render: (_, __, i) => <span style={{ color: "#9ca3af", fontSize: 13 }}>{(meta.page - 1) * meta.pageSize + i + 1}</span>
        },
        {
            title: "Công ty", key: "company",
            render: (_, r) => (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, border: "1px solid #f0f0f0", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${r.logo}`} alt="" style={{ width: 38, height: 38, objectFit: "contain" }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.address}</div>
                    </div>
                </div>
            )
        },
        {
            title: "Thao tác", key: "actions", width: 100, align: "center",
            render: (_, r) => (
                <Space>
                    <EditOutlined className="admin-action-icon" style={{ color: "#faad14" }} onClick={() => { setDataInit(r); setOpenModal(true); }} />
                    <Popconfirm title="Xóa công ty này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
                        <DeleteOutlined className="admin-action-icon" style={{ color: "#ff4d4f" }} />
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <div className="admin-page-title">Quản lý công ty</div>
                    <div className="admin-page-sub">Tổng {meta.total} công ty</div>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setDataInit(null); setOpenModal(true); }}>
                    Thêm công ty
                </Button>
            </div>

            <div className="admin-table-card">
                <div className="admin-filter-bar">
                    <Form form={form} layout="inline" onFinish={handleSearch}>
                        <Form.Item name="name">
                            <Input prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} placeholder="Tên công ty" allowClear style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item name="address">
                            <Input prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} placeholder="Địa chỉ" allowClear style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm</Button>
                                <Button icon={<ReloadOutlined />} onClick={handleReset}>Reset</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>

                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={companies}
                    loading={isFetching}
                    pagination={{
                        current: meta.page, pageSize: meta.pageSize, total: meta.total,
                        showSizeChanger: true, showTotal: t => `Tổng ${t} công ty`,
                        onChange: (p, s) => FetchAllCompanies(p, s)
                    }}
                />
            </div>

            <ModalCompany openModal={openModal} setOpenModal={setOpenModal} dataInit={dataInit} setDataInit={setDataInit} reloadTable={() => FetchAllCompanies(meta.page, meta.pageSize)} />
        </div>
    );
};

export default CompanyTable;
