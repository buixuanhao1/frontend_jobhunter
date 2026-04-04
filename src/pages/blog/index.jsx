import { useContext, useEffect, useState } from "react";
import {
    Avatar, Button, Card, Col, Input, Row, Select, Space, Spin, Tag, Typography, Empty, Pagination
} from "antd";
import {
    CommentOutlined, EyeOutlined, LikeOutlined, PlusOutlined, SearchOutlined, UserOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchPostsAPI, searchPostsAPI } from "../../services/api.service";
import { AuthContext } from "../../components/context/auth.context";
import "./blog.css";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const CATEGORIES = [
    { value: "", label: "Tất cả" },
    { value: "TIM_VIEC", label: "Tìm việc" },
    { value: "KINH_NGHIEM", label: "Kinh nghiệm" },
    { value: "HOI_DAP", label: "Hỏi đáp" },
    { value: "CHIA_SE", label: "Chia sẻ" },
];

const CATEGORY_COLOR = {
    TIM_VIEC: "blue",
    KINH_NGHIEM: "green",
    HOI_DAP: "orange",
    CHIA_SE: "purple",
};

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        loadPosts();
    }, [page, category]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const res = await fetchPostsAPI(page, 10, category);
            if (res?.data) {
                setPosts(res.data.content);
                setTotal(res.data.totalElements);
            }
        } finally { setLoading(false); }
    };

    const handleSearch = async (val) => {
        if (!val.trim()) { setKeyword(""); loadPosts(); return; }
        setLoading(true);
        try {
            const res = await searchPostsAPI(val);
            if (res?.data) { setPosts(res.data.content); setTotal(res.data.totalElements); }
        } finally { setLoading(false); }
        setKeyword(val);
    };

    return (
        <div className="blog-container">
            {/* Header */}
            <div className="blog-header">
                <Title level={2} style={{ margin: 0, color: "#fff" }}>Diễn đàn ứng viên</Title>
                <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                    Chia sẻ kinh nghiệm, hỏi đáp, kết nối với cộng đồng
                </Text>
            </div>

            <div className="blog-body">
                {/* Toolbar */}
                <Row gutter={12} align="middle" style={{ marginBottom: 20 }}>
                    <Col flex="1">
                        <Search placeholder="Tìm kiếm bài viết..." onSearch={handleSearch}
                            allowClear enterButton={<SearchOutlined />} />
                    </Col>
                    <Col>
                        <Select value={category} onChange={v => { setCategory(v); setPage(0); }}
                            style={{ width: 140 }}>
                            {CATEGORIES.map(c => <Option key={c.value} value={c.value}>{c.label}</Option>)}
                        </Select>
                    </Col>
                    {user?.id && (
                        <Col>
                            <Button type="primary" icon={<PlusOutlined />}
                                onClick={() => navigate("/blog/create")}>
                                Viết bài
                            </Button>
                        </Col>
                    )}
                </Row>

                {/* Post list */}
                <Spin spinning={loading}>
                    {posts.length === 0 && !loading ? (
                        <Empty description="Chưa có bài viết nào" />
                    ) : (
                        <Space direction="vertical" style={{ width: "100%" }} size={12}>
                            {posts.map(post => (
                                <Card
                                    key={post.id}
                                    className={`blog-card ${post.pinned ? "pinned" : ""}`}
                                    onClick={() => navigate(`/blog/${post.id}`)}
                                    hoverable
                                >
                                    <Row justify="space-between" align="top" wrap={false}>
                                        <Col flex="1" style={{ minWidth: 0 }}>
                                            <Space align="center" style={{ marginBottom: 6 }}>
                                                {post.pinned && <Tag color="red">📌 Ghim</Tag>}
                                                {post.category && (
                                                    <Tag color={CATEGORY_COLOR[post.category]}>
                                                        {CATEGORIES.find(c => c.value === post.category)?.label}
                                                    </Tag>
                                                )}
                                            </Space>
                                            <Title level={5} style={{ margin: "0 0 6px", cursor: "pointer" }}
                                                ellipsis={{ rows: 1 }}>
                                                {post.title}
                                            </Title>
                                            <Paragraph type="secondary" ellipsis={{ rows: 2 }}
                                                style={{ margin: "0 0 10px", fontSize: 13 }}>
                                                {post.content?.replace(/<[^>]+>/g, "")}
                                            </Paragraph>
                                            <Space size={16}>
                                                <Avatar size={24} icon={<UserOutlined />} />
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {post.author?.name}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {dayjs(post.createdAt).fromNow()}
                                                </Text>
                                            </Space>
                                        </Col>
                                        <Col style={{ textAlign: "right", paddingLeft: 16, flexShrink: 0 }}>
                                            <Space direction="vertical" size={4} align="end">
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    <EyeOutlined /> {post.views}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    <LikeOutlined /> {post.likesCount}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    <CommentOutlined /> {post.commentsCount}
                                                </Text>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </Space>
                    )}
                </Spin>

                {total > 10 && (
                    <div style={{ textAlign: "center", marginTop: 24 }}>
                        <Pagination
                            current={page + 1}
                            total={total}
                            pageSize={10}
                            onChange={p => setPage(p - 1)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
