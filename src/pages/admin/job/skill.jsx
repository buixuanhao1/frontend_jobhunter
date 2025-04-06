import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button, Input, Form } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAllSkillAPI, callDeleteSkill } from "../../../services/api.service";
import ModalSkill from "../../../components/admin/skill/modal.skill";
import dayjs from 'dayjs';

const SkillPage = () => {
    const [skills, setSkills] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ name: '' });

    // State để mở Modal
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        FetchAllSkills(1, meta.pageSize, { name: '' });
    }, []); // Chỉ gọi một lần khi component mount

    const buildQuery = (page, pageSize, searchFilters) => {
        let query = `page=${page}&size=${pageSize}&sort=updatedAt,desc`;

        // Thêm filter nếu có
        let filterStr = '';
        if (searchFilters.name) {
            filterStr = `name ~ '${searchFilters.name}'`;
        }

        if (filterStr) {
            query = `filter=${filterStr}&${query}`;
        }

        return query;
    };

    const FetchAllSkills = async (page = 1, pageSize = 10, searchFilters = filters) => {
        setIsFetching(true);
        try {
            const query = buildQuery(page, pageSize, searchFilters);
            console.log('Query params:', query);
            const res = await fetchAllSkillAPI(query);
            console.log('API Response:', res);
            if (res && res.data) {
                const result = Array.isArray(res.data.result.content) ? res.data.result.content : [];
                setSkills(result);
                setMeta({
                    page: res.data.meta.page,
                    pageSize: res.data.meta.pageSize || 10,
                    total: res.data.meta.total || 0,
                });
            } else {
                setSkills([]);
                message.error("Lỗi khi tải danh sách skill");
            }
        } catch (error) {
            console.error("Error:", error);
            setSkills([]);
            message.error("Lỗi khi tải danh sách skill");
        } finally {
            setIsFetching(false);
        }
    };

    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        FetchAllSkills(current, pageSize);
    };

    const handleSearch = (values) => {
        // Gọi API trực tiếp với giá trị mới
        FetchAllSkills(1, meta.pageSize, values);
        // Cập nhật state filters sau
        setFilters(values);
    };

    const handleReset = () => {
        form.resetFields();
        const emptyFilters = { name: '' };
        setFilters(emptyFilters);
        FetchAllSkills(1, meta.pageSize, emptyFilters);
    };

    const handleDeleteSkill = async (id) => {
        if (id) {
            const res = await callDeleteSkill(id);
            if (res && +res.data.statusCode === 202) {
                message.success("Xóa Skill thành công");
                FetchAllSkills(meta.page, meta.pageSize);
            } else {
                message.error("Có lỗi xảy ra khi xóa Skill");
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
            title: "Tên Skill",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
        },
        {
            title: "Updated By",
            dataIndex: "updatedBy",
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            width: 200,
            sorter: true,
            render: (text, record) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            width: 200,
            sorter: true,
            render: (text, record) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
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
                        title="Xác nhận xóa skill"
                        onConfirm={() => handleDeleteSkill(record.id)}
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
                <Form.Item name="name" label="Name">
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
                Thêm Skill
            </Button>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={skills}
                loading={isFetching}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} skill`
                }}
                onChange={handleTableChange}
            />

            <ModalSkill
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={() => FetchAllSkills(meta.page, meta.pageSize)}
            />
        </div>
    );
};

export default SkillPage;
