import React, { useEffect, useState } from "react";
import { Card, Col, Row, Divider, Pagination, Spin, Empty } from "antd";
import { fetchAllJobAPI } from "../../../services/api.service";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import styles from '../../../styles/client.module.scss';
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";


const JobCard = ({ showPagination = false }) => {
    const [displayJob, setDisplayJob] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, [current, pageSize]);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const res = await fetchAllJobAPI(`page=${current}&size=${pageSize}`);
            if (res && res.data) {
                setDisplayJob(res.data.result);
                setTotal(res.data.meta.total);
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        }
        setIsLoading(false);
    };

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };

    const handleViewDetailJob = (item) => {
        navigate(`/job/${item.id}`);
    };

    return (
        <div className={styles["card-job-section"]}>
            <div className={styles["job-content"]}>
                <Spin spinning={isLoading} tip="Đang tải...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className={isMobile ? "dflex-mobile" : "dflex-pc"}>
                                <span className="title">Việc Làm Mới Nhất</span>
                                {!showPagination && <Link to="/job">Xem tất cả</Link>}
                            </div>
                        </Col>
                        {displayJob.length > 0 ? (
                            displayJob.map((item) => (
                                <Col span={24} md={12} key={item.id}>
                                    <Card size="small" title={null} hoverable
                                        onClick={() => handleViewDetailJob(item)}
                                    >
                                        <div className={styles["card-job-content"]}>
                                            <div className={styles["card-job-left"]}>
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.company?.logo}`}
                                                />
                                            </div>
                                            <div className={styles["card-job-right"]}>
                                                <div className={styles["job-title"]}>{item.name}</div>
                                                <div className={styles["job-location"]}><EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;</div>
                                                <div><ThunderboltOutlined style={{ color: 'orange' }} />&nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                                            </div>
                                        </div>

                                    </Card>
                                </Col>
                            ))
                        ) : (
                            !isLoading && <Empty description="Không có dữ liệu" />
                        )}
                    </Row>

                    {showPagination && (
                        <Row style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={handlePageChange}
                            />
                        </Row>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default JobCard;