import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Form, Tag, Select } from "antd";
import { DeleteOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { fetchAllResumeAPI, callDeleteResume } from "../../services/api.service";
import ViewDetailResume from "../../components/admin/resume/view.resume";
import dayjs from 'dayjs';
import '../../components/admin/admin.page.css';

const { Option } = Select;
const STATUS_COLOR = { PENDING: 'orange', REVIEWING: 'blue', APPROVED: 'green', REJECTED: 'red' };
const STATUS_LABEL = { PENDING: 'Chờ xem xét', REVIEWING: 'Đang xem xét', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' };

const ResumePage = () => {
    const [resumes, setResumes] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => { FetchAllResumes(1, 10, ''); }, []);

    const buildQuery = (page, pageSize, status) => {
        let q = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;
        if (status) q = `filter=status ~ '${status}'&${q}`;
        return q;
    };

    const FetchAllResumes = async (page = 1, pageSize = 10, status = statusFilter) => {
        setIsFetching(true);
        try {
            const res = await fetchAllResumeAPI(buildQuery(page, pageSize, status));
            if (res?.data) {
                setResumes(res.data.result || []);
                setMeta({ page: res.data.meta.page, pageSize: res.data.meta.pageSize || 10, total: res.data.meta.total || 0 });
            }
        } catch { message.error("Lỗi khi tải dữ liệu"); }
        setIsFetching(false);
    };

    const handleDelete = async (id) => {
        const res = await callDeleteResume(id);
        if (+res?.data?.statusCode === 202) { message.success("Đã xóa đơn"); FetchAllResumes(meta.page, meta.pageSize); }
        else message.error("Có lỗi xảy ra");
    };

    const columns = [
        {
            title: "#", key: "index", width: 52, align: "center",
            render: (_, __, i) => <span style={{ color: "#9ca3af", fontSize: 13 }}>{(meta.page - 1) * meta.pageSize + i + 1}</span>
        },
        {
            title: "Ứng viên", key: "user",
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{r.user?.name || r.email || "—"}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.user?.email}</div>
                </div>
            )
        },
        { title: "Vị trí", dataIndex: ["job", "name"], render: v => v || "—" },
        { title: "Công ty", dataIndex: "companyName" },
        {
            title: "Trạng thái", dataIndex: "status",
            render: s => <Tag color={STATUS_COLOR[s] || 'default'} style={{ borderRadius: 6 }}>{STATUS_LABEL[s] || s}</Tag>
        },
        {
            title: "CV", dataIndex: "url",
            render: url => url
                ? <a href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${url}`} target="_blank">Xem CV</a>
                : "—"
        },
        {
            title: "Ngày nộp", dataIndex: "createdAt", width: 130,
            render: t => <span style={{ fontSize: 13, color: "#6b7280" }}>{t ? dayjs(t).format('DD/MM/YYYY') : ''}</span>
        },
        {
            title: "Thao tác", key: "actions", width: 90, align: "center",
            render: (_, r) => (
                <Space>
                    <EditOutlined className="admin-action-icon" style={{ color: "#faad14" }} onClick={() => { setDataInit(r); setOpenViewDetail(true); }} />
                    <Popconfirm title="Xóa đơn ứng tuyển này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
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
                    <div className="admin-page-title">Quản lý đơn ứng tuyển</div>
                    <div className="admin-page-sub">Tổng {meta.total} đơn</div>
                </div>
            </div>

            <div className="admin-table-card">
                <div className="admin-filter-bar">
                    <Select
                        allowClear
                        placeholder="Lọc theo trạng thái"
                        style={{ width: 200 }}
                        onChange={v => { const s = v ?? ''; setStatusFilter(s); FetchAllResumes(1, meta.pageSize, s); }}
                    >
                        {Object.entries(STATUS_LABEL).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
                    </Select>
                    <Button icon={<ReloadOutlined />} onClick={() => { setStatusFilter(''); FetchAllResumes(1, meta.pageSize, ''); }}>Reset</Button>
                </div>

                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={resumes}
                    loading={isFetching}
                    pagination={{
                        current: meta.page, pageSize: meta.pageSize, total: meta.total,
                        showSizeChanger: true, showTotal: t => `Tổng ${t} đơn`,
                        onChange: (p, s) => FetchAllResumes(p, s)
                    }}
                />
            </div>

            <ViewDetailResume
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={() => FetchAllResumes(meta.page, meta.pageSize)}
            />
        </div>
    );
};

export default ResumePage;
