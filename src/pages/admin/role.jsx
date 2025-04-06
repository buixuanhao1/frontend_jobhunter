import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Input, Form, Select, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAllRoleAPI, callDeleteRole, fetchAllPermissionAPI } from "../../services/api.service";
import ModalRole from "../../components/admin/role/modal.role";
import dayjs from 'dayjs';

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ name: '' });

    // State để mở Modal
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [form] = Form.useForm();

    // State cho danh sách permission
    const [listPermissions, setListPermissions] = useState([]);

    useEffect(() => {
        FetchAllRoles(1, meta.pageSize, filters);
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const res = await fetchAllPermissionAPI('page=1&size=100');
            if (res && res.data) {
                setListPermissions(res.data.result || []);
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    const buildQuery = (page, pageSize, searchFilters) => {
        let query = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;

        if (searchFilters.name) {
            query = `filter=name ~ '${searchFilters.name}'&${query}`;
        }

        return query;
    };

    const FetchAllRoles = async (page = 1, pageSize = 10, searchFilters = filters) => {
        setIsFetching(true);
        try {
            const query = buildQuery(page, pageSize, searchFilters);
            const res = await fetchAllRoleAPI(query);
            if (res && res.data) {
                setRoles(res.data.result || []);
                setMeta({
                    page: res.data.meta.page,
                    pageSize: res.data.meta.pageSize || 10,
                    total: res.data.meta.total || 0,
                });
            } else {
                setRoles([]);
                message.error("Lỗi khi tải danh sách role");
            }
        } catch (error) {
            console.error("Error:", error);
            setRoles([]);
            message.error("Lỗi khi tải danh sách role");
        } finally {
            setIsFetching(false);
        }
    };

    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        FetchAllRoles(current, pageSize);
    };

    const handleSearch = (values) => {
        FetchAllRoles(1, meta.pageSize, values);
        setFilters(values);
    };

    const handleReset = () => {
        form.resetFields();
        const emptyFilters = { name: '' };
        setFilters(emptyFilters);
        FetchAllRoles(1, meta.pageSize, emptyFilters);
    };

    const handleDeleteRole = async (id) => {
        if (id) {
            const res = await callDeleteRole(id);
            if (res && +res.data.statusCode === 200) {
                message.success("Xóa Role thành công");
                FetchAllRoles(meta.page, meta.pageSize);
            } else {
                message.error("Có lỗi xảy ra khi xóa Role");
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
            title: "Tên Role",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            render: (active) => (
                <Tag color={active ? "green" : "red"}>
                    {active ? "ACTIVE" : "INACTIVE"}
                </Tag>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (text) => text ? dayjs(text).format('DD-MM-YYYY HH:mm:ss') : "",
        },
        {
            title: "Ngày sửa",
            dataIndex: "updatedAt",
            render: (text) => text ? dayjs(text).format('DD-MM-YYYY HH:mm:ss') : "",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <EditOutlined
                        style={{ fontSize: 20, color: "#ffa500", cursor: "pointer" }}
                        onClick={() => {
                            setDataInit(record);
                            setOpenModal(true);
                        }}
                    />
                    <Popconfirm
                        title="Xác nhận xóa role"
                        onConfirm={() => handleDeleteRole(record.id)}
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
                Thêm mới
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={roles}
                loading={isFetching}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} role`
                }}
                onChange={handleTableChange}
            />

            <ModalRole
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={() => FetchAllRoles(meta.page, meta.pageSize)}
                listPermissions={listPermissions}
            />
        </div>
    );
};

export default RolePage;
