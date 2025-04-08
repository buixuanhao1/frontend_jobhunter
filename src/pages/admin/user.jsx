import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Input, Form, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchAllUserAPI, deleteUserAPI } from "../../services/api.service";
import ModalUser from "../../components/admin/user/modal.user";
import ViewDetailUser from "../../components/admin/user/view.detail.user";
import dayjs from 'dayjs';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ name: '', email: '' });

    // State để mở Modal
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [form] = Form.useForm();

    // State để mở ViewDetail
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [userSelected, setUserSelected] = useState(null);

    const roleColors = {
        ADMIN: 'red',
        USER: 'blue',
        HR: 'green'
    };

    useEffect(() => {
        FetchAllUsers(1, meta.pageSize, { name: '', email: '' });
    }, []); // Chỉ gọi một lần khi component mount

    const buildQuery = (page, pageSize, searchFilters) => {
        let query = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;

        // Thêm filter nếu có
        let filterStr = '';
        if (searchFilters.name) {
            filterStr = `name ~ '${searchFilters.name}'`;
        }
        if (searchFilters.email) {
            filterStr += searchFilters.name ?
                ` and email ~ '${searchFilters.email}'` :
                `email ~ '${searchFilters.email}'`;
        }

        if (filterStr) {
            query = `filter=${filterStr}&${query}`;
        }

        return query;
    };

    const FetchAllUsers = async (page = 1, pageSize = 10, searchFilters = filters) => {
        setIsFetching(true);
        try {
            const query = buildQuery(page, pageSize, searchFilters);
            console.log('Query params:', query);
            const res = await fetchAllUserAPI(query);
            if (res.data) {
                setUsers(res.data.result);
                setMeta({
                    page: res.data.meta.page,
                    pageSize: res.data.meta.pageSize || 10,
                    total: res.data.meta.total || 0,
                });
            } else {
                message.error("Lỗi khi tải danh sách người dùng");
            }
        } catch (error) {
            console.error("Error:", error);
            message.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setIsFetching(false);
        }
    };

    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        FetchAllUsers(current, pageSize);
    };

    const handleSearch = (values) => {
        // Gọi API trực tiếp với giá trị mới
        FetchAllUsers(1, meta.pageSize, values);
        // Cập nhật state filters sau
        setFilters(values);
    };

    const handleReset = () => {
        form.resetFields();
        const emptyFilters = { name: '', email: '' };
        setFilters(emptyFilters);
        FetchAllUsers(1, meta.pageSize, emptyFilters);
    };

    const handleDeleteUser = async (id) => {
        if (id) {
            const res = await deleteUserAPI(id);
            if (res && +res.data.statusCode === 202) {
                message.success("Xóa người dùng thành công");
                FetchAllUsers(meta.page, meta.pageSize);
            } else {
                message.error("Có lỗi xảy ra khi xóa người dùng");
            }
        }
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => (
                <>{(index + 1) + (meta.page - 1) * meta.pageSize}</>
            ),
        },
        {
            title: "Tên hiển thị",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Role",
            dataIndex: "role",
            render: (role) => (
                <Tag color={roleColors[role?.name] || 'default'}>
                    {role?.name || 'N/A'}
                </Tag>
            ),
            filters: [
                { text: 'Admin', value: 'ADMIN' },
                { text: 'User', value: 'USER' },
                { text: 'HR', value: 'HR' }
            ],
            onFilter: (value, record) => record.role?.name === value
        },
        {
            title: "Avatar",
            dataIndex: "avatar",
            render: (avatar) => (
                avatar && <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/user/${avatar}`}
                    alt="avatar"
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                />
            )
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (date) => date && dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
            sorter: true,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <EyeOutlined
                        style={{ fontSize: 20, color: "#1890ff", cursor: "pointer" }}
                        onClick={() => {
                            setUserSelected(record);
                            setOpenViewDetail(true);
                        }}
                    />
                    <EditOutlined
                        style={{ fontSize: 20, color: "#ffa500", cursor: "pointer" }}
                        onClick={() => {
                            setDataInit({
                                ...record,
                                _id: record.id // Ensure we have _id for update
                            });
                            setOpenModal(true);
                        }}
                    />
                    <Popconfirm
                        title="Xác nhận xóa người dùng"
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined
                            style={{ fontSize: 20, color: "#ff4d4f", cursor: "pointer" }}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
                style={{ marginBottom: 16 }}
            >
                <Form.Item name="name" label="Tên">
                    <Input placeholder="Tìm theo tên" allowClear />
                </Form.Item>
                <Form.Item name="email" label="Email">
                    <Input placeholder="Tìm theo email" allowClear />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Tìm kiếm
                        </Button>
                        <Button onClick={handleReset}>Làm lại</Button>
                    </Space>
                </Form.Item>
            </Form>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                    setDataInit(null);
                    setOpenModal(true);
                }}
                style={{ marginBottom: 16 }}
            >
                Thêm người dùng
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={users}
                loading={isFetching}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} người dùng`
                }}
                onChange={handleTableChange}
            />

            <ModalUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={() => FetchAllUsers(meta.page, meta.pageSize)}
            />

            <ViewDetailUser
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={userSelected}
                setDataInit={setUserSelected}
            />
        </div>
    );
};

export default UserTable;
