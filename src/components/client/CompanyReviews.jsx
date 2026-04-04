import { useContext, useEffect, useState } from "react";
import { Rate, Button, Input, Form, List, Avatar, Typography, Divider, Statistic, Row, Col, message } from "antd";
import { UserOutlined, StarFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchCompanyReviewsAPI, fetchReviewSummaryAPI, createReviewAPI, checkReviewedAPI } from "../../services/api.service";
import { AuthContext } from "../context/auth.context";

dayjs.extend(relativeTime);
const { TextArea } = Input;
const { Text } = Typography;

const CompanyReviews = ({ companyId }) => {
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });
    const [hasReviewed, setHasReviewed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchCompanyReviewsAPI(companyId).then(res => { if (res?.data) setReviews(res.data); });
        fetchReviewSummaryAPI(companyId).then(res => { if (res?.data) setSummary(res.data); });
        if (user?.id) {
            checkReviewedAPI(companyId).then(res => { if (res?.data) setHasReviewed(res.data.reviewed); });
        }
    }, [companyId, user?.id]);

    const handleSubmit = async (values) => {
        if (!user?.id) { message.warning("Vui lòng đăng nhập để đánh giá"); return; }
        setSubmitting(true);
        try {
            const res = await createReviewAPI(companyId, values);
            if (res?.data) {
                setReviews(prev => [res.data, ...prev]);
                setSummary(prev => ({
                    averageRating: ((prev.averageRating * prev.totalReviews) + values.rating) / (prev.totalReviews + 1),
                    totalReviews: prev.totalReviews + 1
                }));
                setHasReviewed(true);
                form.resetFields();
                message.success("Cảm ơn bạn đã đánh giá!");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: 32 }}>
            <Divider>Đánh giá công ty</Divider>

            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col>
                    <Statistic
                        title="Điểm trung bình"
                        value={summary.averageRating}
                        precision={1}
                        prefix={<StarFilled style={{ color: "#faad14" }} />}
                        suffix={`/ 5 (${summary.totalReviews} đánh giá)`}
                    />
                </Col>
            </Row>

            {user?.id && !hasReviewed && (
                <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ maxWidth: 500, marginBottom: 24 }}>
                    <Form.Item name="rating" label="Đánh giá của bạn" rules={[{ required: true, message: "Vui lòng chọn số sao" }]}>
                        <Rate />
                    </Form.Item>
                    <Form.Item name="comment" label="Nhận xét">
                        <TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn..." />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting}>Gửi đánh giá</Button>
                </Form>
            )}
            {hasReviewed && <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>Bạn đã đánh giá công ty này.</Text>}

            <List
                dataSource={reviews}
                locale={{ emptyText: "Chưa có đánh giá nào" }}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={<><strong>{item.user?.name}</strong> &nbsp;<Rate disabled value={item.rating} style={{ fontSize: 13 }} /></>}
                            description={<><div>{item.comment}</div><Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.createdAt).fromNow()}</Text></>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default CompanyReviews;
