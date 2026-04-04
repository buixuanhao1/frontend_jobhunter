import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Input, Form, Tag, Avatar } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { fetchAllUserAPI, deleteUserAPI } from "../../services/api.service";
import ModalUser from "../../components/admin/user/modal.user";
import ViewDetailUser from "../../components/admin/user/view.detail.user";
import dayjs from 'dayjs';
import '../../components/admin/admin.page.css';

const ROLE_COLOR = { SUPER_ADMIN: 'purple', USER: 'blue', HR: 'green' };

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ name: '', email: '' });
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [userSelected, setUserSelected] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => { FetchAllUsers(1, 10, { name: '', email: '' }); }, []);

    const buildQuery = (page, pageSize, f) => {
        let q = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;
        const parts = [];
        if (f.name)  parts.push(`name ~ '${f.name}'`);
        if (f.email) parts.push(`email ~ '${f.email}'`);
        if (parts.length) q = `filter=${parts.join(' and ')}&${q}`;
        return q;
    };

    const FetchAllUsers = async (page = 1, pageSize = 10, f = filters) => {
        setIsFetching(true);
        try {
            const res = await fetchAllUserAPI(buildQuery(page, pageSize, f));
            if (res.data) {
                setUsers(res.data.result);
                setMeta({ page: res.data.meta.page, pageSize: res.data.meta.pageSize || 10, total: res.data.meta.total || 0 });
            }
        } catch { message.error("Lỗi khi tải danh sách người dùng"); }
        setIsFetching(false);
    };

    const handleSearch = (values) => { setFilters(values); FetchAllUsers(1, meta.pageSize, values); };
    const handleReset = () => { form.resetFields(); const f = { name: '', email: '' }; setFilters(f); FetchAllUsers(1, meta.pageSize, f); };

    const handleDelete = async (id) => {
        const res = await deleteUserAPI(id);
        if (res.statusCode === 200) { message.success("Đã xóa người dùng"); FetchAllUsers(meta.page, meta.pageSize); }
        else message.error("Có lỗi xảy ra");
    };

    const columns = [
        {
            title: "#", key: "index", width: 52, align: "center",
            render: (_, __, i) => <span style={{ color: "#9ca3af", fontSize: 13 }}>{(meta.page - 1) * meta.pageSize + i + 1}</span>
        },
        {
            title: "Người dùng", key: "user",
            render: (_, r) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar
                        size={36}
                        src={r.avatar ? `${import.meta.env.VITE_BACKEND_URL}/storage/user/${r.avatar}` : undefined}
                        style={{ background: "linear-gradient(135deg,#1677ff,#0958d9)", flexShrink: 0 }}
                    >
                        {!r.avatar && r.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.email}</div>
                    </div>
                </div>
            )
        },
        {
            title: "Vai trò", dataIndex: "role",
            render: role => <Tag color={ROLE_COLOR[role?.name] || 'default'} style={{ borderRadius: 6 }}>{role?.name || 'N/A'}</Tag>
        },
        {
            title: "Ngày tạo", dataIndex: "createdAt", width: 140,
            render: d => <span style={{ fontSize: 13, color: "#6b7280" }}>{d ? dayjs(d).format('DD/MM/YYYY') : ''}</span>
        },
        {
            title: "Thao tác", key: "actions", width: 100, align: "center",
            render: (_, r) => (
                <Space>
                    <EyeOutlined className="admin-action-icon" style={{ color: "#1677ff" }} onClick={() => { setUserSelected(r); setOpenViewDetail(true); }} />
                    <EditOutlined className="admin-action-icon" style={{ color: "#faad14" }} onClick={() => { setDataInit({ ...r, _id: r.id }); setOpenModal(true); }} />
                    <Popconfirm title="Xóa người dùng này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
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
                    <div className="admin-page-title">Quản lý người dùng</div>
                    <div className="admin-page-sub">Tổng {meta.total} tài khoản</div>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setDataInit(null); setOpenModal(true); }}>
                    Thêm người dùng
                </Button>
            </div>

            <div className="admin-table-card">
                <div className="admin-filter-bar">
                    <Form form={form} layout="inline" onFinish={handleSearch}>
                        <Form.Item name="name">
                            <Input prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} placeholder="Tìm theo tên" allowClear style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item name="email">
                            <Input prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} placeholder="Tìm theo email" allowClear style={{ width: 220 }} />
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
                    dataSource={users}
                    loading={isFetching}
                    pagination={{
                        current: meta.page, pageSize: meta.pageSize, total: meta.total,
                        showSizeChanger: true, showTotal: t => `Tổng ${t} người dùng`,
                        onChange: (p, s) => FetchAllUsers(p, s)
                    }}
                />
            </div>

            <ModalUser openModal={openModal} setOpenModal={setOpenModal} dataInit={dataInit} setDataInit={setDataInit} reloadTable={() => FetchAllUsers(meta.page, meta.pageSize)} />
            <ViewDetailUser open={openViewDetail} onClose={setOpenViewDetail} dataInit={userSelected} setDataInit={setUserSelected} />
        </div>
    );
};

export default UserTable;
