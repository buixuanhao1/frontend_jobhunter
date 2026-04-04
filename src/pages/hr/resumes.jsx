import { useContext, useEffect, useState } from "react";
import { Table, Tag, Select, Space, message, Drawer, Descriptions, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { AuthContext } from "../../components/context/auth.context";
import { fetchAllResumeAPI, callUpdateResumeStatus } from "../../services/api.service";
import dayjs from "dayjs";

const { Option } = Select;

const STATUS_COLOR  = { PENDING: "orange", REVIEWING: "blue", APPROVED: "green", REJECTED: "red" };
const STATUS_LABEL  = { PENDING: "Chờ xem xét", REVIEWING: "Đang xem xét", APPROVED: "Đã duyệt", REJECTED: "Từ chối" };
const ALL_STATUSES  = ["PENDING", "REVIEWING", "APPROVED", "REJECTED"];

const HRResumes = () => {
    const { user } = useContext(AuthContext);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [statusFilter, setStatusFilter] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchResumes(1);
    }, [statusFilter]);

    const fetchResumes = async (page = 1) => {
        setLoading(true);
        try {
            let q = `page=${page}&size=${meta.pageSize}&sort=createdAt,desc`;
            if (statusFilter) q = `filter=status ~ '${statusFilter}'&${q}`;
            const res = await fetchAllResumeAPI(q);
            if (res?.data) {
                setResumes(res.data.result ?? []);
                setMeta(m => ({ ...m, page, total: res.data.meta.total }));
            }
        } catch { }
        setLoading(false);
    };

    const handleStatusChange = async (resumeId, newStatus) => {
        try {
            await callUpdateResumeStatus(resumeId, newStatus);
            message.success("Cập nhật trạng thái thành công");
            fetchResumes(meta.page);
            if (selected?.id === resumeId) setSelected(s => ({ ...s, status: newStatus }));
        } catch {
            message.error("Không thể cập nhật trạng thái");
        }
    };

    const columns = [
        {
            title: "Ứng viên",
            dataIndex: ["user", "name"],
            render: (v, r) => (
                <div>
                    <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{v || "—"}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{r.user?.email}</div>
                </div>
            )
        },
        { title: "Vị trí ứng tuyển", dataIndex: ["job", "name"], render: v => v || "—" },
        { title: "Công ty", dataIndex: "companyName" },
        {
            title: "Trạng thái", dataIndex: "status", width: 180,
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 160 }}
                    size="small"
                    onChange={val => handleStatusChange(record.id, val)}
                    onClick={e => e.stopPropagation()}
                >
                    {ALL_STATUSES.map(s => (
                        <Option key={s} value={s}>
                            <Tag color={STATUS_COLOR[s]} style={{ margin: 0 }}>{STATUS_LABEL[s]}</Tag>
                        </Option>
                    ))}
                </Select>
            )
        },
        {
            title: "Ngày nộp", dataIndex: "createdAt",
            render: t => dayjs(t).format("DD/MM/YYYY HH:mm")
        },
        {
            title: "CV", dataIndex: "url",
            render: url => url ? (
                <a href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${url}`} target="_blank" rel="noreferrer">
                    Xem CV
                </a>
            ) : "—"
        },
        {
            title: "", key: "view",
            render: (_, r) => (
                <EyeOutlined
                    style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                    onClick={() => { setSelected(r); setDrawerOpen(true); }}
                />
            )
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e" }}>Đơn ứng tuyển</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Quản lý và xét duyệt CV ứng viên</div>
                </div>
                <Select
                    allowClear
                    placeholder="Lọc theo trạng thái"
                    style={{ width: 200 }}
                    onChange={v => setStatusFilter(v ?? "")}
                >
                    {ALL_STATUSES.map(s => (
                        <Option key={s} value={s}>{STATUS_LABEL[s]}</Option>
                    ))}
                </Select>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={resumes}
                loading={loading}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: t => `Tổng ${t} đơn`,
                    onChange: fetchResumes,
                }}
                style={{ background: "#fff", borderRadius: 12 }}
            />

            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Chi tiết đơn ứng tuyển"
                width={480}
            >
                {selected && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Ứng viên">{selected.user?.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selected.user?.email}</Descriptions.Item>
                        <Descriptions.Item label="Vị trí">{selected.job?.name}</Descriptions.Item>
                        <Descriptions.Item label="Công ty">{selected.companyName}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Select
                                value={selected.status}
                                style={{ width: "100%" }}
                                onChange={val => handleStatusChange(selected.id, val)}
                            >
                                {ALL_STATUSES.map(s => (
                                    <Option key={s} value={s}>
                                        <Tag color={STATUS_COLOR[s]} style={{ margin: 0 }}>{STATUS_LABEL[s]}</Tag>
                                    </Option>
                                ))}
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày nộp">
                            {dayjs(selected.createdAt).format("DD/MM/YYYY HH:mm")}
                        </Descriptions.Item>
                        {selected.url && (
                            <Descriptions.Item label="CV">
                                <a
                                    href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${selected.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Tải xem CV
                                </a>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
};

export default HRResumes;
