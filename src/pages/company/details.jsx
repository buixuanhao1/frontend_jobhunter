import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Divider, Row, Skeleton, Card, Spin, Empty } from "antd";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import { callFetchCompanyById, fetchJobsByCompanyAPI } from "../../services/api.service";
import "../../styles/ClientCompanyDetail.css";
import { useNavigate } from "react-router-dom";

const ClientCompanyDetailPage = () => {
    const [companyDetail, setCompanyDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        const fetchCompanyDetail = async () => {
            if (id) {
                setIsLoading(true);
                try {
                    const res = await callFetchCompanyById(id);
                    if (res?.data) {
                        setCompanyDetail(res.data);
                    }
                } catch (error) {
                    console.error("Lỗi khi fetch dữ liệu công ty:", error);
                }
                setIsLoading(false);
            }
        };
        fetchCompanyDetail();
    }, [id]);

    useEffect(() => {
        const fetchCompanyJobs = async () => {
            if (id) {
                setIsLoadingJobs(true);
                try {
                    const res = await fetchJobsByCompanyAPI(id);
                    if (res?.data) {
                        setCompanyJobs(res.data);
                    } else {
                        setCompanyJobs([]);
                    }
                } catch (error) {
                    console.error("Lỗi khi fetch danh sách công việc:", error);
                    setCompanyJobs([]);
                }
                setIsLoadingJobs(false);
            }
        };
        fetchCompanyJobs();
    }, [id]);

    const handleViewDetailJob = (job) => {
        navigate(`/job/${job.id}`);
    };

    return (
        <div className="container detail-job-section">
            {isLoading ? (
                <Skeleton />
            ) : (
                <>
                    <Row gutter={[20, 20]}>
                        {companyDetail && companyDetail.id && (
                            <>
                                <Col span={24} md={16}>
                                    <div className="header">{companyDetail.name}</div>
                                    <div className="location">
                                        <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;
                                        {companyDetail?.address}
                                    </div>
                                    <Divider />
                                    {parse(companyDetail?.description ?? "")}
                                </Col>
                                <Col span={24} md={8}>
                                    <div className="company">
                                        <div>
                                            <img
                                                width={200}
                                                alt="Company Logo"
                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${companyDetail?.logo}`}
                                            />
                                        </div>
                                        <div>{companyDetail?.name}</div>
                                    </div>
                                </Col>
                            </>
                        )}
                    </Row>

                    <Divider />

                    <div className="company-jobs-section">
                        <h2>Các vị trí đang tuyển dụng</h2>
                        <Spin spinning={isLoadingJobs}>
                            <Row gutter={[20, 20]}>
                                {!isLoadingJobs && companyJobs && companyJobs.length > 0 ? (
                                    companyJobs.map((job) => (
                                        <Col span={24} md={8} key={job.id}>
                                            <Card
                                                size="small"
                                                title={null}
                                                hoverable
                                                onClick={() => handleViewDetailJob(job)}
                                            >
                                                <div className="card-job-content">
                                                    <div className="card-job-left">
                                                        <img
                                                            alt="company logo"
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job?.company?.logo}`}
                                                        />
                                                    </div>
                                                    <div className="card-job-right">
                                                        <div className="job-title">{job.name}</div>
                                                        <div className="job-location">
                                                            <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;
                                                            {job.location}
                                                        </div>
                                                        <div>
                                                            <ThunderboltOutlined style={{ color: 'orange' }} />&nbsp;
                                                            {(job.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    !isLoadingJobs && <Empty description="Không có công việc nào" />
                                )}
                            </Row>
                        </Spin>
                    </div>
                </>
            )}
        </div>
    );
};

export default ClientCompanyDetailPage;
