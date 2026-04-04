import React, { useEffect, useState } from "react";
import { Col, Row, Pagination, Spin, Empty } from "antd";
import { fetchAllCompanyAPI } from "../../../services/api.service";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import "./company.card.css";

const CompanyCard = ({ showPagination = false }) => {
    const [displayCompany, setDisplayCompany] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, [current]);

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const res = await fetchAllCompanyAPI(`page=${current}&size=${pageSize}`);
            if (res?.data) {
                setDisplayCompany(res.data.result);
                setTotal(res.data.meta.total);
            }
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    return (
        <Spin spinning={isLoading} tip="Đang tải...">
            {displayCompany.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {displayCompany.map(item => (
                        <Col xs={12} sm={8} md={6} lg={6} key={item.id}>
                            <div className="company-card" onClick={() => navigate(`/company/${item.id}`)}>
                                <div className="company-logo-wrap">
                                    <img
                                        alt={item.name}
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item.logo}`}
                                    />
                                </div>
                                <div className="company-name">{item.name}</div>
                                <div className="company-view-btn">
                                    Xem chi tiết <RightOutlined />
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                !isLoading && <Empty description="Không có dữ liệu" />
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

export default CompanyCard;
