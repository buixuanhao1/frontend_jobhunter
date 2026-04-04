import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Pagination, Spin, Empty, message, Tooltip, Tag } from "antd";
import { fetchAllJobAPI, saveJobAPI, unsaveJobAPI, fetchSavedJobsAPI } from "../../../services/api.service";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined, HeartFilled, HeartOutlined, DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./job.card.css";

dayjs.extend(relativeTime);

const LEVEL_COLOR = {
    INTERN: "blue",
    FRESHER: "cyan",
    JUNIOR: "green",
    MIDDLE: "orange",
    SENIOR: "red",
};

const JobCard = ({ showPagination = false, query = "" }) => {
    const [displayJob, setDisplayJob] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [savedIds, setSavedIds] = useState(new Set());
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchJobs();
    }, [current, query]);

    useEffect(() => {
        if (!user?.id) return;
        fetchSavedJobsAPI().then(res => {
            if (res?.data) setSavedIds(new Set(res.data.map(s => s.job.id)));
        });
    }, [user?.id]);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const q = query
                ? `page=${current}&size=${pageSize}&${query}`
                : `page=${current}&size=${pageSize}`;
            const res = await fetchAllJobAPI(q);
            if (res?.data) {
                setDisplayJob(res.data.result);
                setTotal(res.data.meta.total);
            }
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    const toggleSave = async (e, jobId) => {
        e.stopPropagation();
        if (!user?.id) { message.warning("Vui lòng đăng nhập để lưu việc làm"); return; }
        if (savedIds.has(jobId)) {
            await unsaveJobAPI(jobId);
            setSavedIds(prev => { const s = new Set(prev); s.delete(jobId); return s; });
            message.success("Đã bỏ lưu");
        } else {
            await saveJobAPI(jobId);
            setSavedIds(prev => new Set(prev).add(jobId));
            message.success("Đã lưu việc làm");
        }
    };

    return (
        <Spin spinning={isLoading} tip="Đang tải...">
            {displayJob.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {displayJob.map(item => (
                        <Col xs={24} md={12} key={item.id}>
                            <div className="job-card" onClick={() => navigate(`/job/${item.id}`)}>
                                <div className="job-card-logo">
                                    <img
                                        alt={item?.company?.name}
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.company?.logo}`}
                                    />
                                </div>
                                <div className="job-card-body">
                                    <div className="job-card-title">{item.name}</div>
                                    <div className="job-card-company">{item?.company?.name}</div>
                                    <div className="job-card-meta">
                                        <span className="job-meta-item">
                                            <EnvironmentOutlined /> {item.location}
                                        </span>
                                        <span className="job-meta-item">
                                            <DollarOutlined /> {(item.salary + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
                                        </span>
                                    </div>
                                    <div className="job-card-footer">
                                        {item.level && (
                                            <Tag color={LEVEL_COLOR[item.level] || "default"} style={{ borderRadius: 6 }}>
                                                {item.level}
                                            </Tag>
                                        )}
                                        <span className="job-card-time">
                                            <ClockCircleOutlined /> {dayjs(item.updatedAt || item.createdAt).fromNow()}
                                        </span>
                                    </div>
                                </div>
                                <Tooltip title={savedIds.has(item.id) ? "Bỏ lưu" : "Lưu việc làm"}>
                                    <button
                                        className={`job-save-btn ${savedIds.has(item.id) ? "saved" : ""}`}
                                        onClick={e => toggleSave(e, item.id)}
                                    >
                                        {savedIds.has(item.id)
                                            ? <HeartFilled />
                                            : <HeartOutlined />
                                        }
                                    </button>
                                </Tooltip>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                !isLoading && <Empty description="Không có việc làm" />
            )}

            {showPagination && total > pageSize && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                    <Pagination
                        current={current}
                        total={total}
                        pageSize={pageSize}
                        responsive
                        onChange={p => setCurrent(p)}
                    />
                </div>
            )}
        </Spin>
    );
};

export default JobCard;
