import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Input, Form, Select, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAllPermissionAPI, callDeletePermission } from "../../services/api.service";
import ModalPermission from "../../components/admin/permission/modal.permission";
import dayjs from 'dayjs';
import { ALL_MODULES } from "../../config/permissions";

const PermissionPage = () => {
    const [permissions, setPermissions] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ name: '', apiPath: '', method: '', module: '' });

    // State để mở Modal
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        FetchAllPermissions(1, meta.pageSize, filters);
    }, []);

    const buildQuery = (page, pageSize, searchFilters) => {
        let query = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;

        // Thêm filter nếu có
        let filterStr = '';
        if (searchFilters.name) {
            filterStr = `name ~ '${searchFilters.name}'`;
        }
        if (searchFilters.apiPath) {
            filterStr += filterStr ? ` and apiPath ~ '${searchFilters.apiPath}'` : `apiPath ~ '${searchFilters.apiPath}'`;
        }
        if (searchFilters.method) {
            filterStr += filterStr ? ` and method ~ '${searchFilters.method}'` : `method ~ '${searchFilters.method}'`;
        }
        if (searchFilters.module) {
            filterStr += filterStr ? ` and module ~ '${searchFilters.module}'` : `module ~ '${searchFilters.module}'`;
        }

        if (filterStr) {
            query = `filter=${filterStr}&${query}`;
        }

        return query;
    };

    const FetchAllPermissions = async (page = 1, pageSize = 10, searchFilters = filters) => {
        setIsFetching(true);
        try {
            const query = buildQuery(page, pageSize, searchFilters);
            console.log('Query params:', query);
            const res = await fetchAllPermissionAPI(query);
            if (res && res.data) {
                setPermissions(res.data.result || []);
                setMeta({
                    page: res.data.meta.page,
                    pageSize: res.data.meta.pageSize || 10,
                    total: res.data.meta.total || 0,
                });
            } else {
                setPermissions([]);
                message.error("Lỗi khi tải danh sách permission");
            }
        } catch (error) {
            console.error("Error:", error);
            setPermissions([]);
            message.error("Lỗi khi tải danh sách permission");
        } finally {
            setIsFetching(false);
        }
    };

    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        FetchAllPermissions(current, pageSize);
    };

    const handleSearch = (values) => {
        FetchAllPermissions(1, meta.pageSize, values);
        setFilters(values);
    };

    const handleReset = () => {
        form.resetFields();
        const emptyFilters = { name: '', apiPath: '', method: '', module: '' };
        setFilters(emptyFilters);
        FetchAllPermissions(1, meta.pageSize, emptyFilters);
    };

    const handleDeletePermission = async (id) => {
        if (id) {
            const res = await callDeletePermission(id);
            if (res && +res.data.statusCode === 202) {
                message.success("Xóa Permission thành công");
                FetchAllPermissions(meta.page, meta.pageSize);
            } else {
                message.error("Có lỗi xảy ra khi xóa Permission");
            }
        }
    };

    const colorMethod = (method) => {
        switch (method) {
            case 'GET':
                return '#52c41a';
            case 'POST':
                return '#1890ff';
            case 'PUT':
                return '#faad14';
            case 'PATCH':
                return '#722ed1';
            case 'DELETE':
                return '#f5222d';
            default:
                return '#000000';
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
            title: "Tên Permission",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "API Path",
            dataIndex: "apiPath",
            sorter: true,
        },
        {
            title: "Method",
            dataIndex: "method",
            sorter: true,
            render: (method) => (
                <Tag color={colorMethod(method)}>{method}</Tag>
            ),
        },
        {
            title: "Module",
            dataIndex: "module",
            sorter: true,
            render: (module) => ALL_MODULES[module] || module,
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
                        title="Xác nhận xóa permission"
                        onConfirm={() => handleDeletePermission(record.id)}
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
                <Form.Item name="apiPath" label="API Path">
                    <Input placeholder="Tìm theo path" allowClear />
                </Form.Item>
                <Form.Item name="method" label="Method">
                    <Select
                        style={{ width: 120 }}
                        placeholder="Chọn method"
                        allowClear
                    >
                        <Select.Option value="GET">GET</Select.Option>
                        <Select.Option value="POST">POST</Select.Option>
                        <Select.Option value="PUT">PUT</Select.Option>
                        <Select.Option value="PATCH">PATCH</Select.Option>
                        <Select.Option value="DELETE">DELETE</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="module" label="Module">
                    <Select
                        style={{ width: 200 }}
                        placeholder="Chọn module"
                        allowClear
                    >
                        {Object.entries(ALL_MODULES).map(([key, value]) => (
                            <Select.Option key={key} value={key}>{value}</Select.Option>
                        ))}
                    </Select>
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
                dataSource={permissions}
                loading={isFetching}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} permission`
                }}
                onChange={handleTableChange}
            />

            <ModalPermission
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={() => FetchAllPermissions(meta.page, meta.pageSize)}
            />
        </div>
    );
};

export default PermissionPage;
