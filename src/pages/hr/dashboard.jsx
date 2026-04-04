import { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, Tag, Empty } from "antd";
import {
    FileTextOutlined, SolutionOutlined, CheckCircleOutlined, ClockCircleOutlined
} from "@ant-design/icons";
import { AuthContext } from "../../components/context/auth.context";
import { fetchJobsByCompanyAPI, fetchAllResumeAPI } from "../../services/api.service";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const STATUS_COLOR = {
    PENDING: "orange", REVIEWING: "blue", APPROVED: "green", REJECTED: "red"
};

const HRDashboard = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.company?.id) return;
        Promise.all([
            fetchJobsByCompanyAPI(user.company.id),
            fetchAllResumeAPI("page=1&size=5&sort=createdAt,desc")
        ]).then(([jobsRes, resumesRes]) => {
            setJobs(jobsRes?.data ?? []);
            setResumes(resumesRes?.data?.result ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [user?.company?.id]);

    const pending   = resumes.filter(r => r.status === "PENDING").length;
    const reviewing = resumes.filter(r => r.status === "REVIEWING").length;
    const approved  = resumes.filter(r => r.status === "APPROVED").length;

    const recentColumns = [
        { title: "Ứng viên", dataIndex: ["user", "name"], render: v => v || "—" },
        { title: "Vị trí", dataIndex: ["job", "name"], render: v => v || "—" },
        {
            title: "Trạng thái", dataIndex: "status",
            render: s => <Tag color={STATUS_COLOR[s] || "default"}>{s}</Tag>
        },
        {
            title: "Ngày nộp", dataIndex: "createdAt",
            render: t => dayjs(t).format("DD/MM/YYYY")
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>
                    Chào mừng, {user?.name} 👋
                </div>
                <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                    {user?.company?.name || "HR Portal"} — Tổng quan hoạt động
                </div>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {[
                    { title: "Tin tuyển dụng", value: jobs.length, icon: <FileTextOutlined />, color: "#1677ff", path: "/hr/jobs" },
                    { title: "Chờ xem xét",    value: pending,     icon: <ClockCircleOutlined />, color: "#faad14", path: "/hr/resumes" },
                    { title: "Đang xem xét",   value: reviewing,   icon: <SolutionOutlined />,   color: "#1677ff", path: "/hr/resumes" },
                    { title: "Đã duyệt",        value: approved,    icon: <CheckCircleOutlined />, color: "#52c41a", path: "/hr/resumes" },
                ].map(item => (
                    <Col xs={24} sm={12} lg={6} key={item.title}>
                        <Card
                            hoverable
                            onClick={() => navigate(item.path)}
                            style={{ borderRadius: 12, cursor: "pointer" }}
                        >
                            <Statistic
                                title={item.title}
                                value={item.value}
                                prefix={<span style={{ color: item.color }}>{item.icon}</span>}
                                valueStyle={{ color: item.color, fontSize: 28, fontWeight: 700 }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card title="Đơn ứng tuyển gần đây" style={{ borderRadius: 12 }}>
                {resumes.length > 0 ? (
                    <Table
                        rowKey="id"
                        columns={recentColumns}
                        dataSource={resumes}
                        pagination={false}
                        size="small"
                    />
                ) : (
                    <Empty description="Chưa có đơn ứng tuyển nào" />
                )}
            </Card>
        </div>
    );
};

export default HRDashboard;
