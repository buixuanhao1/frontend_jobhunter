import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Input, Form, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { fetchAllJobAPI, callDeleteJob } from "../../../services/api.service";
import ModalJob from "../../../components/admin/job/modal.job";
import dayjs from 'dayjs';
import '../../../components/admin/admin.page.css';

const LEVEL_COLOR = { INTERN: 'blue', FRESHER: 'cyan', JUNIOR: 'green', MIDDLE: 'orange', SENIOR: 'red' };

const JobPage = () => {
    const [jobs, setJobs] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ name: '' });
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => { FetchAllJobs(1, 10, { name: '' }); }, []);

    const buildQuery = (page, pageSize, f) => {
        let q = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;
        if (f.name) q = `filter=name ~ '${f.name}'&${q}`;
        return q;
    };

    const FetchAllJobs = async (page = 1, pageSize = 10, f = filters) => {
        setIsFetching(true);
        try {
            const res = await fetchAllJobAPI(buildQuery(page, pageSize, f));
            if (res.data) {
                setJobs(res.data.result || []);
                setMeta({ page: res.data.meta.page, pageSize: res.data.meta.pageSize || 10, total: res.data.meta.total || 0 });
            }
        } catch { message.error("Lỗi khi tải danh sách job"); }
        setIsFetching(false);
    };

    const handleSearch = (values) => { setFilters(values); FetchAllJobs(1, meta.pageSize, values); };
    const handleReset = () => { form.resetFields(); const f = { name: '' }; setFilters(f); FetchAllJobs(1, meta.pageSize, f); };

    const handleDelete = async (id) => {
        const res = await callDeleteJob(id);
        if (+res?.statusCode === 200) { message.success("Đã xóa job"); FetchAllJobs(meta.page, meta.pageSize); }
        else message.error("Có lỗi xảy ra");
    };

    const columns = [
        {
            title: "#", key: "index", width: 52, align: "center",
            render: (_, __, i) => <span style={{ color: "#9ca3af", fontSize: 13 }}>{(meta.page - 1) * meta.pageSize + i + 1}</span>
        },
        {
            title: "Vị trí tuyển dụng", key: "job",
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.company?.name}</div>
                </div>
            )
        },
        {
            title: "Mức lương", dataIndex: "salary", width: 140,
            render: v => <span style={{ fontWeight: 600, color: "#16a34a" }}>{(v + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</span>
        },
        {
            title: "Cấp độ", dataIndex: "level", width: 100,
            render: v => <Tag color={LEVEL_COLOR[v] || 'default'} style={{ borderRadius: 6 }}>{v}</Tag>
        },
        {
            title: "Trạng thái", dataIndex: "active", width: 110,
            render: v => <Tag color={v ? "green" : "default"} style={{ borderRadius: 6 }}>{v ? "Đang tuyển" : "Đóng"}</Tag>
        },
        {
            title: "Ngày tạo", dataIndex: "createdAt", width: 120,
            render: t => <span style={{ fontSize: 13, color: "#6b7280" }}>{t ? dayjs(t).format('DD/MM/YYYY') : ''}</span>
        },
        {
            title: "Thao tác", key: "actions", width: 80, align: "center",
            render: (_, r) => (
                <Space>
                    <EditOutlined className="admin-action-icon" style={{ color: "#faad14" }} onClick={() => { setDataInit(r); setOpenModal(true); }} />
                    <Popconfirm title="Xóa job này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
                        <DeleteOutlined className="admin-action-icon" style={{ color: "#ff4d4f" }} />
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return (
        <div className="admin-table-card" style={{ marginBottom: 0 }}>
            <div className="admin-filter-bar">
                <Form form={form} layout="inline" onFinish={handleSearch}>
                    <Form.Item name="name">
                        <Input prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} placeholder="Tên vị trí" allowClear style={{ width: 220 }} />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm</Button>
                            <Button icon={<ReloadOutlined />} onClick={handleReset}>Reset</Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setDataInit(null); setOpenModal(true); }}>Thêm Job</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={jobs}
                loading={isFetching}
                pagination={{
                    current: meta.page, pageSize: meta.pageSize, total: meta.total,
                    showSizeChanger: true, showTotal: t => `Tổng ${t} job`,
                    onChange: (p, s) => FetchAllJobs(p, s)
                }}
            />

            <ModalJob openModal={openModal} setOpenModal={setOpenModal} dataInit={dataInit} setDataInit={setDataInit} reloadTable={() => FetchAllJobs(meta.page, meta.pageSize)} />
        </div>
    );
};

export default JobPage;
