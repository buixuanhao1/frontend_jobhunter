import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import { callFetchCompanyById } from "../../services/api.service";
import "../../styles/ClientCompanyDetail.css";

const ClientCompanyDetailPage = () => {
    const [companyDetail, setCompanyDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();  // ✅ Lấy id từ URL path

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

    return (
        <div className="container detail-job-section">
            {isLoading ? (
                <Skeleton />
            ) : (
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
            )}
        </div>
    );
};

export default ClientCompanyDetailPage;
