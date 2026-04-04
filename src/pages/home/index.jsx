import { Button, Col, Input, Row, Statistic, Typography } from "antd";
import { SearchOutlined, RocketOutlined, TeamOutlined, BankOutlined, TrophyOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyCard from "../../components/client/card/company.card";
import JobCard from "../../components/client/card/job.card";
import styles from '../../styles/client.module.scss';
import "./home.css";

const { Title, Text } = Typography;

const STATS = [
    { icon: <BankOutlined />,  value: 500,  suffix: "+", title: "Công ty" },
    { icon: <RocketOutlined />, value: 2000, suffix: "+", title: "Việc làm" },
    { icon: <TeamOutlined />,  value: 50000, suffix: "+", title: "Ứng viên" },
    { icon: <TrophyOutlined />, value: 98, suffix: "%", title: "Hài lòng" },
];

const HomePage = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (keyword.trim()) navigate(`/job?keyword=${encodeURIComponent(keyword)}`);
        else navigate("/job");
    };

    return (
        <>
            {/* Hero */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">🚀 Nền tảng tuyển dụng #1 Việt Nam</div>
                    <Title level={1} className="hero-title">
                        Tìm việc làm <span className="hero-highlight">phù hợp</span><br />
                        với bạn ngay hôm nay
                    </Title>
                    <Text className="hero-sub">
                        Kết nối hàng nghìn ứng viên với các công ty hàng đầu. <br />
                        Cơ hội nghề nghiệp đang chờ bạn khám phá.
                    </Text>

                    <div className="hero-search">
                        <Input
                            size="large"
                            placeholder="Nhập tên công việc, kỹ năng, công ty..."
                            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            onPressEnter={handleSearch}
                            className="hero-input"
                        />
                        <Button type="primary" size="large" onClick={handleSearch} className="hero-btn">
                            Tìm kiếm
                        </Button>
                    </div>

                    <div className="hero-tags">
                        {["ReactJS", "Java", "Python", "DevOps", "UI/UX", "Marketing"].map(t => (
                            <span key={t} className="hero-tag"
                                onClick={() => navigate(`/job?keyword=${t}`)}>
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-card floating">
                        <div className="hc-dot green" />
                        <div>
                            <div className="hc-title">Senior ReactJS</div>
                            <div className="hc-sub">FPT Software • Hà Nội</div>
                        </div>
                        <div className="hc-salary">30M đ</div>
                    </div>
                    <div className="hero-card floating delay1">
                        <div className="hc-dot blue" />
                        <div>
                            <div className="hc-title">Java Backend Dev</div>
                            <div className="hc-sub">Viettel • TP.HCM</div>
                        </div>
                        <div className="hc-salary">25M đ</div>
                    </div>
                    <div className="hero-card floating delay2">
                        <div className="hc-dot orange" />
                        <div>
                            <div className="hc-title">Product Manager</div>
                            <div className="hc-sub">Google • Remote</div>
                        </div>
                        <div className="hc-salary">50M đ</div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-bar">
                <div className="stats-inner">
                    {STATS.map(s => (
                        <div key={s.title} className="stat-item">
                            <span className="stat-icon">{s.icon}</span>
                            <Statistic value={s.value} suffix={s.suffix}
                                valueStyle={{ fontSize: 28, fontWeight: 800, color: "#1677ff" }} />
                            <span className="stat-label">{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Companies */}
            <div className={`${styles.container} ${styles["home-section"]}`} style={{ marginTop: 56 }}>
                <div className="section-header">
                    <div>
                        <div className="section-tag">🏢 Đối tác</div>
                        <Title level={2} className="section-title-main">Nhà tuyển dụng hàng đầu</Title>
                    </div>
                    <Button type="link" onClick={() => navigate("/company")} className="see-all-btn">
                        Xem tất cả →
                    </Button>
                </div>
                <CompanyCard />
            </div>

            {/* Jobs */}
            <div className="jobs-bg">
                <div className={`${styles.container} ${styles["home-section"]}`} style={{ paddingTop: 48, paddingBottom: 48 }}>
                    <div className="section-header">
                        <div>
                            <div className="section-tag">💼 Cơ hội</div>
                            <Title level={2} className="section-title-main">Việc làm mới nhất</Title>
                        </div>
                        <Button type="link" onClick={() => navigate("/job")} className="see-all-btn">
                            Xem tất cả →
                        </Button>
                    </div>
                    <JobCard />
                </div>
            </div>

            {/* CTA */}
            <div className="cta-section">
                <div className="cta-content">
                    <Title level={2} style={{ color: "#fff", margin: 0 }}>
                        Sẵn sàng tìm công việc mơ ước?
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,.8)", fontSize: 16 }}>
                        Đăng ký miễn phí và nhận ngay thông báo việc làm phù hợp
                    </Text>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button size="large" onClick={() => navigate("/register")}
                            style={{ background: "#fff", color: "#1677ff", border: "none", fontWeight: 600, borderRadius: 8 }}>
                            Tạo hồ sơ ngay
                        </Button>
                        <Button size="large" ghost onClick={() => navigate("/job")}
                            style={{ borderRadius: 8, fontWeight: 600 }}>
                            Khám phá việc làm
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
