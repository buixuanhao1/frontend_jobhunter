import { useContext, useEffect, useState } from "react";
import { Card, Col, Empty, Row, Spin, Typography, message } from "antd";
import { EnvironmentOutlined, HeartFilled, ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchSavedJobsAPI, unsaveJobAPI } from "../services/api.service";
import { AuthContext } from "../components/context/auth.context";

const { Title } = Typography;

const SavedJobsPage = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.id) return;
        setIsLoading(true);
        fetchSavedJobsAPI()
            .then(res => { if (res?.data) setSavedJobs(res.data); })
            .finally(() => setIsLoading(false));
    }, [user?.id]);

    const handleUnsave = async (e, savedJobId, jobId) => {
        e.stopPropagation();
        await unsaveJobAPI(jobId);
        setSavedJobs(prev => prev.filter(s => s.id !== savedJobId));
        message.success("Đã bỏ lưu việc làm");
    };

    return (
        <div style={{ maxWidth: 1000, margin: "30px auto", padding: "0 20px" }}>
            <Title level={3}>Việc làm đã lưu</Title>
            <Spin spinning={isLoading}>
                {savedJobs.length === 0 && !isLoading ? (
                    <Empty description="Bạn chưa lưu việc làm nào" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {savedJobs.map(s => (
                            <Col span={24} md={12} key={s.id}>
                                <Card
                                    hoverable
                                    onClick={() => navigate(`/job/${s.job.id}`)}
                                    extra={
                                        <HeartFilled
                                            style={{ color: "#ff4d4f", fontSize: 18 }}
                                            onClick={e => handleUnsave(e, s.id, s.job.id)}
                                        />
                                    }
                                    title={s.job.name}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <img
                                            alt="logo"
                                            width={40}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${s.job?.company?.logo}`}
                                        />
                                        <div>
                                            <div>{s.job?.company?.name}</div>
                                            <div>
                                                <EnvironmentOutlined style={{ color: "#58aaab" }} />&nbsp;{s.job.location}
                                            </div>
                                            <div>
                                                <ThunderboltOutlined style={{ color: "orange" }} />&nbsp;
                                                {(s.job.salary + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Spin>
        </div>
    );
};

export default SavedJobsPage;
