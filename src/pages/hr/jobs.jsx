import { useContext, useEffect, useState } from "react";
import { Table, Button, Tag, Space, Popconfirm, message, Modal, Form, Input, Select, InputNumber } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AuthContext } from "../../components/context/auth.context";
import {
    fetchJobsByCompanyAPI, callCreateJob, callUpdateJob, callDeleteJob,
    fetchAllSkillAPI
} from "../../services/api.service";
import dayjs from "dayjs";

const { Option } = Select;
const LEVELS = ["INTERN", "FRESHER", "JUNIOR", "MIDDLE", "SENIOR"];
const LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Remote"];

const HRJobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user?.company?.id) fetchJobs();
        fetchAllSkillAPI("page=1&size=100").then(res => {
            const result = res?.data?.result ?? res?.data ?? [];
            setSkills(Array.isArray(result) ? result : []);
        });
    }, [user?.company?.id]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetchJobsByCompanyAPI(user.company.id);
            setJobs(res?.data ?? []);
        } catch { }
        setLoading(false);
    };

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            skills: record.skills?.map(s => s.id),
            startDate: record.startDate ? dayjs(record.startDate).format("YYYY-MM-DD") : "",
            endDate: record.endDate ? dayjs(record.endDate).format("YYYY-MM-DD") : "",
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                skills: values.skills?.map(id => ({ id })) ?? [],
                company: { id: user.company.id },
            };
            if (editing) {
                await callUpdateJob({ ...payload, id: editing.id });
                message.success("Cập nhật job thành công");
            } else {
                await callCreateJob(payload);
                message.success("Tạo job thành công");
            }
            setModalOpen(false);
            fetchJobs();
        } catch (e) {
            if (e?.errorFields) return; // validation error
            message.error("Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        await callDeleteJob(id);
        message.success("Đã xóa job");
        fetchJobs();
    };

    const columns = [
        { title: "Tên vị trí", dataIndex: "name", key: "name" },
        {
            title: "Cấp độ", dataIndex: "level",
            render: v => <Tag color="blue">{v}</Tag>
        },
        {
            title: "Lương (đ)", dataIndex: "salary",
            render: v => (v + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        { title: "Địa điểm", dataIndex: "location" },
        {
            title: "Trạng thái", dataIndex: "active",
            render: v => <Tag color={v ? "green" : "default"}>{v ? "Đang tuyển" : "Đóng"}</Tag>
        },
        {
            title: "Ngày tạo", dataIndex: "createdAt",
            render: t => dayjs(t).format("DD/MM/YYYY")
        },
        {
            title: "", key: "actions",
            render: (_, r) => (
                <Space>
                    <EditOutlined style={{ color: "#faad14", fontSize: 18, cursor: "pointer" }} onClick={() => openEdit(r)} />
                    <Popconfirm title="Xóa job này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy">
                        <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e" }}>Quản lý Jobs</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{user?.company?.name}</div>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Đăng tin mới</Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={jobs}
                loading={loading}
                pagination={{ pageSize: 10 }}
                style={{ background: "#fff", borderRadius: 12 }}
            />

            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                title={editing ? "Chỉnh sửa Job" : "Đăng tin tuyển dụng"}
                width={640}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="name" label="Tên vị trí" rules={[{ required: true, message: "Nhập tên vị trí" }]}>
                        <Input placeholder="VD: Senior ReactJS Developer" />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả công việc">
                        <Input.TextArea rows={4} placeholder="Mô tả chi tiết..." />
                    </Form.Item>
                    <Form.Item name="salary" label="Mức lương (đ)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={v => v.replace(/,/g, "")} placeholder="VD: 20000000" />
                    </Form.Item>
                    <Form.Item name="quantity" label="Số lượng tuyển">
                        <InputNumber style={{ width: "100%" }} min={1} defaultValue={1} />
                    </Form.Item>
                    <Form.Item name="level" label="Cấp độ" rules={[{ required: true }]}>
                        <Select placeholder="Chọn cấp độ">
                            {LEVELS.map(l => <Option key={l} value={l}>{l}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
                        <Select placeholder="Chọn địa điểm">
                            {LOCATIONS.map(l => <Option key={l} value={l}>{l}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="skills" label="Kỹ năng yêu cầu">
                        <Select mode="multiple" placeholder="Chọn kỹ năng" optionFilterProp="children">
                            {skills.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="active" label="Trạng thái" initialValue={true}>
                        <Select>
                            <Option value={true}>Đang tuyển</Option>
                            <Option value={false}>Đóng</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HRJobs;
