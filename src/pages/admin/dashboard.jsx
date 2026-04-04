import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, Tag, Progress, Empty } from "antd";
import {
    UserOutlined, FileTextOutlined, BankOutlined, SolutionOutlined,
    RiseOutlined, ArrowUpOutlined
} from "@ant-design/icons";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
    fetchStatsOverviewAPI,
    fetchResumesByStatusAPI,
    fetchTopCompaniesAPI,
    fetchJobsByLevelAPI
} from "../../services/api.service";
import "./dashboard.css";

const STATUS_COLORS = {
    PENDING: "#faad14", REVIEWING: "#1677ff", APPROVED: "#52c41a", REJECTED: "#ff4d4f"
};
const STATUS_LABEL = {
    PENDING: "Chờ xem xét", REVIEWING: "Đang xem", APPROVED: "Đã duyệt", REJECTED: "Từ chối"
};
const LEVEL_COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff7300", "#a0d911"];

const OVERVIEW_CARDS = (data) => [
    {
        title: "Người dùng",
        value: data.totalUsers ?? 0,
        icon: <UserOutlined />,
        gradient: "linear-gradient(135deg,#667eea,#764ba2)",
        bg: "#f0edff",
        color: "#764ba2",
        suffix: "tài khoản",
    },
    {
        title: "Việc làm",
        value: data.totalJobs ?? 0,
        icon: <FileTextOutlined />,
        gradient: "linear-gradient(135deg,#11998e,#38ef7d)",
        bg: "#ecfdf5",
        color: "#11998e",
        suffix: "tin đăng",
    },
    {
        title: "Công ty",
        value: data.totalCompanies ?? 0,
        icon: <BankOutlined />,
        gradient: "linear-gradient(135deg,#f093fb,#f5576c)",
        bg: "#fff0f6",
        color: "#f5576c",
        suffix: "đối tác",
    },
    {
        title: "Đơn ứng tuyển",
        value: data.totalResumes ?? 0,
        icon: <SolutionOutlined />,
        gradient: "linear-gradient(135deg,#4facfe,#00f2fe)",
        bg: "#e6f7ff",
        color: "#0ea5e9",
        suffix: "hồ sơ",
    },
];

const AdminDashboard = () => {
    const [overview, setOverview] = useState({});
    const [resumeStatus, setResumeStatus] = useState([]);
    const [topCompanies, setTopCompanies] = useState([]);
    const [jobsByLevel, setJobsByLevel] = useState([]);

    useEffect(() => {
        fetchStatsOverviewAPI().then(res => { if (res?.data) setOverview(res.data); });
        fetchResumesByStatusAPI().then(res => { if (res?.data) setResumeStatus(res.data); });
        fetchTopCompaniesAPI().then(res => { if (res?.data) setTopCompanies(res.data.slice(0, 5)); });
        fetchJobsByLevelAPI().then(res => { if (res?.data) setJobsByLevel(res.data); });
    }, []);

    const totalResumes = resumeStatus.reduce((s, r) => s + (r.count || 0), 0);

    return (
        <div className="dash-wrapper">
            {/* Page header */}
            <div className="dash-page-header">
                <div>
                    <div className="dash-page-title">Tổng quan hệ thống</div>
                    <div className="dash-page-sub">Theo dõi các chỉ số hoạt động của nền tảng</div>
                </div>
            </div>

            {/* Overview cards */}
            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                {OVERVIEW_CARDS(overview).map(card => (
                    <Col xs={24} sm={12} xl={6} key={card.title}>
                        <div className="dash-stat-card">
                            <div className="dash-stat-icon" style={{ background: card.bg }}>
                                <span style={{ color: card.color, fontSize: 22 }}>{card.icon}</span>
                            </div>
                            <div className="dash-stat-info">
                                <div className="dash-stat-value">{card.value.toLocaleString()}</div>
                                <div className="dash-stat-title">{card.title}</div>
                                <div className="dash-stat-suffix">{card.suffix}</div>
                            </div>
                            <div className="dash-stat-bar" style={{ background: card.gradient }} />
                        </div>
                    </Col>
                ))}
            </Row>

            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                {/* Resume status breakdown */}
                <Col xs={24} lg={10}>
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <span className="dash-card-title">Trạng thái đơn ứng tuyển</span>
                        </div>
                        <div className="dash-card-body">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={resumeStatus}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="45%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                    >
                                        {resumeStatus.map(entry => (
                                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#8884d8"} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v, n) => [v, STATUS_LABEL[n] || n]} />
                                    <Legend
                                        formatter={v => STATUS_LABEL[v] || v}
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Mini progress bars */}
                            <div className="dash-status-bars">
                                {resumeStatus.map(r => (
                                    <div key={r.status} className="dash-status-row">
                                        <span className="dash-status-label">{STATUS_LABEL[r.status] || r.status}</span>
                                        <Progress
                                            percent={totalResumes ? Math.round(r.count / totalResumes * 100) : 0}
                                            strokeColor={STATUS_COLORS[r.status]}
                                            size="small"
                                            style={{ flex: 1, margin: "0 12px" }}
                                        />
                                        <span className="dash-status-count">{r.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Jobs by level */}
                <Col xs={24} lg={14}>
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <span className="dash-card-title">Việc làm theo cấp độ</span>
                        </div>
                        <div className="dash-card-body">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={jobsByLevel} barSize={36}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#6b7280" }} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,.12)" }}
                                        cursor={{ fill: "#f0f5ff" }}
                                    />
                                    <Bar dataKey="count" name="Số việc làm" radius={[6, 6, 0, 0]}>
                                        {jobsByLevel.map((_, i) => (
                                            <Cell key={i} fill={LEVEL_COLORS[i % LEVEL_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Top companies */}
            <Row gutter={[20, 20]}>
                <Col xs={24}>
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <span className="dash-card-title">Top 5 công ty nhận nhiều đơn nhất</span>
                        </div>
                        <div className="dash-card-body">
                            {topCompanies.length === 0 ? (
                                <Empty description="Chưa có dữ liệu" />
                            ) : (
                                <div className="dash-top-companies">
                                    {topCompanies.map((c, i) => {
                                        const max = topCompanies[0]?.count || 1;
                                        const pct = Math.round(c.count / max * 100);
                                        return (
                                            <div key={i} className="dash-company-row">
                                                <div className="dash-company-rank">{i + 1}</div>
                                                <div className="dash-company-name">{c.company}</div>
                                                <Progress
                                                    percent={pct}
                                                    strokeColor="linear-gradient(90deg,#1677ff,#0958d9)"
                                                    showInfo={false}
                                                    style={{ flex: 1, margin: "0 16px" }}
                                                />
                                                <div className="dash-company-count">{c.count} đơn</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
