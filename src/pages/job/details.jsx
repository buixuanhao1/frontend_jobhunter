import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Skeleton, Tag, message, Divider } from "antd";
import {
    DollarOutlined, EnvironmentOutlined, ClockCircleOutlined,
    MessageOutlined, SendOutlined, HeartOutlined, HeartFilled,
    BankOutlined, TeamOutlined
} from "@ant-design/icons";
import parse from "html-react-parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ApplyModal from "../../components/client/modal/apply.modal";
import { callFetchJobById, fetchHRByCompanyAPI, saveJobAPI, unsaveJobAPI, fetchSavedJobsAPI } from "../../services/api.service";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/auth.context";
import "./details.css";

dayjs.extend(relativeTime);

const LEVEL_COLOR = {
    INTERN: "blue", FRESHER: "cyan", JUNIOR: "green",
    MIDDLE: "orange", SENIOR: "red",
};

const ClientJobDetailPage = () => {
    const [jobDetail, setJobDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { user, setChatTarget } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetail = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const res = await callFetchJobById(id);
                if (res?.data) setJobDetail(res.data);
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);
        };
        fetchJobDetail();
    }, [id]);

    useEffect(() => {
        if (!user?.id) return;
        fetchSavedJobsAPI().then(res => {
            if (res?.data) setIsSaved(res.data.some(s => s.job?.id === parseInt(id)));
        });
    }, [user?.id, id]);

    const handleContactHR = async () => {
        if (!user?.id) { message.warning("Vui lòng đăng nhập để liên hệ HR"); return; }
        if (!jobDetail?.company?.id) return;
        try {
            const res = await fetchHRByCompanyAPI(jobDetail.company.id);
            if (res?.data?.length > 0) {
                setChatTarget(res.data[0]);
            } else {
                message.info("Công ty này chưa có HR để liên hệ.");
            }
        } catch {
            message.error("Không thể kết nối HR lúc này.");
        }
    };

    const toggleSave = async () => {
        if (!user?.id) { message.warning("Vui lòng đăng nhập để lưu việc làm"); return; }
        if (isSaved) {
            await unsaveJobAPI(parseInt(id));
            setIsSaved(false);
            message.success("Đã bỏ lưu");
        } else {
            await saveJobAPI(parseInt(id));
            setIsSaved(true);
            message.success("Đã lưu việc làm");
        }
    };

    if (isLoading) return (
        <div className="job-detail-page">
            <div className="job-detail-container">
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        </div>
    );

    if (!jobDetail) return null;

    return (
        <div className="job-detail-page">
            <div className="job-detail-container">
                <Row gutter={[24, 24]}>
                    {/* Left */}
                    <Col xs={24} md={16}>
                        {/* Hero card */}
                        <div className="jd-hero-card">
                            <div className="jd-company-logo">
                                <img
                                    alt={jobDetail.company?.name}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`}
                                />
                            </div>
                            <div className="jd-hero-info">
                                <h1 className="jd-title">{jobDetail.name}</h1>
                                <div className="jd-company-name">
                                    <BankOutlined /> {jobDetail.company?.name}
                                </div>
                                <div className="jd-tags">
                                    {jobDetail.level && (
                                        <Tag color={LEVEL_COLOR[jobDetail.level] || "default"} style={{ borderRadius: 6 }}>
                                            {jobDetail.level}
                                        </Tag>
                                    )}
                                    {jobDetail.skills?.map((s, i) => (
                                        <Tag key={i} color="blue" style={{ borderRadius: 6 }}>{s.name}</Tag>
                                    ))}
                                </div>
                                <div className="jd-meta">
                                    <span className="jd-meta-item salary">
                                        <DollarOutlined />
                                        {(jobDetail.salary + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ / tháng
                                    </span>
                                    <span className="jd-meta-item">
                                        <EnvironmentOutlined /> {jobDetail.location}
                                    </span>
                                    <span className="jd-meta-item">
                                        <ClockCircleOutlined />
                                        {dayjs(jobDetail.updatedAt || jobDetail.createdAt).fromNow()}
                                    </span>
                                </div>
                                <div className="jd-actions">
                                    <button className="jd-btn-apply" onClick={() => setIsModalOpen(true)}>
                                        <SendOutlined /> Ứng tuyển ngay
                                    </button>
                                    {user?.role?.name === "USER" && (
                                        <button className="jd-btn-contact" onClick={handleContactHR}>
                                            <MessageOutlined /> Liên hệ HR
                                        </button>
                                    )}
                                    <button className={`jd-btn-save ${isSaved ? "saved" : ""}`} onClick={toggleSave}>
                                        {isSaved ? <HeartFilled /> : <HeartOutlined />}
                                        {isSaved ? "Đã lưu" : "Lưu tin"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="jd-section-card">
                            <h2 className="jd-section-title">Mô tả công việc</h2>
                            <Divider style={{ margin: "12px 0 20px" }} />
                            <div className="jd-description">
                                {parse(jobDetail.description || "")}
                            </div>
                        </div>
                    </Col>

                    {/* Right */}
                    <Col xs={24} md={8}>
                        {/* Company card */}
                        <div className="jd-company-card" onClick={() => navigate(`/company/${jobDetail.company?.id}`)}>
                            <img
                                className="jd-company-card-logo"
                                alt={jobDetail.company?.name}
                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`}
                            />
                            <div className="jd-company-card-name">{jobDetail.company?.name}</div>
                            <div className="jd-company-card-link">Xem trang công ty →</div>
                        </div>

                        {/* Job overview */}
                        <div className="jd-overview-card">
                            <h3 className="jd-overview-title">Thông tin công việc</h3>
                            <div className="jd-overview-row">
                                <span className="jd-ov-label">Mức lương</span>
                                <span className="jd-ov-val salary">
                                    {(jobDetail.salary + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
                                </span>
                            </div>
                            <div className="jd-overview-row">
                                <span className="jd-ov-label">Địa điểm</span>
                                <span className="jd-ov-val">{jobDetail.location}</span>
                            </div>
                            <div className="jd-overview-row">
                                <span className="jd-ov-label">Cấp bậc</span>
                                <span className="jd-ov-val">
                                    {jobDetail.level && (
                                        <Tag color={LEVEL_COLOR[jobDetail.level] || "default"} style={{ borderRadius: 6, margin: 0 }}>
                                            {jobDetail.level}
                                        </Tag>
                                    )}
                                </span>
                            </div>
                            <div className="jd-overview-row">
                                <span className="jd-ov-label">Cập nhật</span>
                                <span className="jd-ov-val">
                                    {dayjs(jobDetail.updatedAt || jobDetail.createdAt).format("DD/MM/YYYY")}
                                </span>
                            </div>
                            <button className="jd-btn-apply full" onClick={() => setIsModalOpen(true)}>
                                <SendOutlined /> Ứng tuyển ngay
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>

            <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={jobDetail} />
        </div>
    );
};

export default ClientJobDetailPage;
