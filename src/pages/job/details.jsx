import React, { useEffect, useState } from "react";
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ApplyModal from "../../components/client/modal/apply.modal";
import { callFetchJobById } from "../../services/api.service";
import styles from "../../styles/client.module.scss";
import { useParams } from "react-router-dom";

dayjs.extend(relativeTime);

const ClientJobDetailPage = () => {
    const [jobDetail, setJobDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { id } = useParams();  // ✅ Lấy id từ URL path




    useEffect(() => {
        const fetchJobDetail = async () => {
            if (id) {
                setIsLoading(true);
                try {

                    const res = await callFetchJobById(id);

                    if (res?.data) {
                        setJobDetail(res.data);
                    }
                } catch (error) {
                    console.error("Lỗi khi fetch dữ liệu công việc:", error);
                }
                setIsLoading(false);
            }
        };
        fetchJobDetail();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ? (
                <Skeleton />
            ) : (
                <Row gutter={[20, 20]}>
                    {jobDetail && jobDetail.id && (
                        <>
                            <Col span={24} md={16}>
                                <div className="header">{jobDetail.name}</div>
                                <button onClick={() => setIsModalOpen(true)} className="btn-apply">
                                    Apply Now
                                </button>
                                <Divider />
                                <div className="skills">
                                    {jobDetail.skills?.map((item, index) => (
                                        <Tag key={index} color="gold">{item.name}</Tag>
                                    ))}
                                </div>
                                <div className="salary">
                                    <DollarOutlined />
                                    <span>&nbsp;{(jobDetail.salary + "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                </div>
                                <div className="location">
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{jobDetail.location}
                                </div>
                                <div>
                                    <HistoryOutlined /> {jobDetail.updatedAt ? dayjs(jobDetail.updatedAt).fromNow() : dayjs(jobDetail.createdAt).fromNow()}
                                </div>
                                <Divider />
                                {parse(jobDetail.description)}
                            </Col>

                            <Col span={24} md={8}>
                                <div className="company">
                                    <img width={200} alt="Company Logo" src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`} />
                                    <div>{jobDetail.company?.name}</div>
                                </div>
                            </Col>
                        </>
                    )}
                </Row>
            )}
            <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={jobDetail} />
        </div>
    );
};

export default ClientJobDetailPage;
