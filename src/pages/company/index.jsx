
import { Typography } from "antd";
import CompanyCard from "../../components/client/card/company.card";
import styles from "../../styles/client.module.scss";

const { Title } = Typography;

const CompanyPage = () => (
    <div className={styles.container} style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1677ff", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>
                🏢 Đối tác
            </div>
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Nhà tuyển dụng hàng đầu</Title>
        </div>
        <CompanyCard showPagination={true} />
    </div>
);

export default CompanyPage;