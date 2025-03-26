
import { Col, Row } from "antd";
import CompanyCard from "../../components/client/card/company.card";
import "../../styles/CompanyList.css";

const CompanyPage = () => {

    return (
        <div className="container" style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CompanyCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default CompanyPage;