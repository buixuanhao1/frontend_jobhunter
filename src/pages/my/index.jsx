import { useContext, useEffect, useState } from "react";
import { Tabs, Tag, Empty, Skeleton, Avatar, Descriptions, Button } from "antd";
import {
    UserOutlined, FileTextOutlined, HeartOutlined,
    EnvironmentOutlined, DollarOutlined, ClockCircleOutlined
} from "@ant-design/icons";
import { AuthContext } from "../../components/context/auth.context";
import { callFetchResumeByUser, fetchSavedJobsAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./my.css";

dayjs.extend(relativeTime);

const STATUS_COLOR = {
    PENDING: "orange", REVIEWING: "blue", APPROVED: "green", REJECTED: "red"
};
const STATUS_LABEL = {
    PENDING: "Chờ xem xét", REVIEWING: "Đang xem xét", APPROVED: "Đã duyệt", REJECTED: "Từ chối"
};

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className="my-card">
            <div className="my-profile-header">
                <Avatar size={80} style={{ background: "linear-gradient(135deg,#1677ff,#0958d9)", fontSize: 32 }} icon={<UserOutlined />} />
                <div>
                    <div className="my-profile-name">{user.name}</div>
                    <div className="my-profile-email">{user.email}</div>
                    {user.role && <Tag color="blue" style={{ marginTop: 6 }}>{user.role.name}</Tag>}
                </div>
            </div>
            <div className="my-profile-info">
                {[
                    { label: "Tuổi", value: user.age || "—" },
                    { label: "Giới tính", value: user.gender || "—" },
                    { label: "Địa chỉ", value: user.address || "—" },
                ].map(r => (
                    <div className="my-info-row" key={r.label}>
                        <span className="my-info-label">{r.label}</span>
                        <span className="my-info-val">{r.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MyResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        callFetchResumeByUser().then(res => {
            setResumes(res?.data ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Skeleton active />;
    if (!resumes.length) return <Empty description="Bạn chưa ứng tuyển công việc nào" />;

    return (
        <div className="my-list">
            {resumes.map(r => (
                <div className="my-resume-item" key={r.id} onClick={() => navigate(`/job/${r.job?.id}`)}>
                    <div className="my-resume-left">
                        <div className="my-resume-job">{r.job?.name || "Công việc"}</div>
                        <div className="my-resume-company">{r.companyName || r.job?.company?.name}</div>
                        <div className="my-resume-date">
                            <ClockCircleOutlined /> Ứng tuyển {dayjs(r.createdAt).fromNow()}
                        </div>
                    </div>
                    <div className="my-resume-right">
                        <Tag color={STATUS_COLOR[r.status] || "default"}>
                            {STATUS_LABEL[r.status] || r.status}
                        </Tag>
                        {r.url && (
                            <a
                                href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${r.url}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="my-cv-link"
                            >
                                Xem CV
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const MySavedJobs = () => {
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSavedJobsAPI().then(res => {
            setSaved(res?.data ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <Skeleton active />;
    if (!saved.length) return <Empty description="Chưa có việc làm nào được lưu" />;

    return (
        <div className="my-list">
            {saved.map(s => (
                <div className="my-job-item" key={s.id} onClick={() => navigate(`/job/${s.job?.id}`)}>
                    <div className="my-job-logo">
                        <img
                            alt={s.job?.company?.name}
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${s.job?.company?.logo}`}
                        />
                    </div>
                    <div className="my-job-info">
                        <div className="my-job-title">{s.job?.name}</div>
                        <div className="my-job-company">{s.job?.company?.name}</div>
                        <div className="my-job-meta">
                            <span><EnvironmentOutlined /> {s.job?.location}</span>
                            <span><DollarOutlined /> {(s.job?.salary + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</span>
                        </div>
                    </div>
                    <Button type="primary" size="small" onClick={e => { e.stopPropagation(); navigate(`/job/${s.job?.id}`); }}>
                        Xem
                    </Button>
                </div>
            ))}
        </div>
    );
};

const MyPortal = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user?.id) {
        navigate("/login");
        return null;
    }

    const tabs = [
        {
            key: "profile",
            label: <span><UserOutlined /> Hồ sơ</span>,
            children: <MyProfile />
        },
        {
            key: "resumes",
            label: <span><FileTextOutlined /> Đơn ứng tuyển</span>,
            children: <MyResumes />
        },
        {
            key: "saved",
            label: <span><HeartOutlined /> Việc đã lưu</span>,
            children: <MySavedJobs />
        },
    ];

    return (
        <div className="my-portal">
            <div className="my-portal-inner">
                <div className="my-portal-header">
                    <div className="my-portal-title">Cổng thông tin ứng viên</div>
                    <div className="my-portal-sub">Quản lý hồ sơ và theo dõi đơn ứng tuyển của bạn</div>
                </div>
                <Tabs items={tabs} size="large" className="my-tabs" />
            </div>
        </div>
    );
};

export default MyPortal;
