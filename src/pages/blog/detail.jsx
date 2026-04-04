import { useContext, useEffect, useRef, useState } from "react";
import {
    Avatar, Button, Card, Divider, Input, List, message, Space, Spin, Tag, Typography, Popconfirm
} from "antd";
import {
    ArrowLeftOutlined, CommentOutlined, DeleteOutlined, EditOutlined,
    EyeOutlined, LikeFilled, LikeOutlined, UserOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import parse from "html-react-parser";
import {
    fetchPostByIdAPI, fetchCommentsAPI, addCommentAPI,
    deleteCommentAPI, toggleLikeAPI, checkLikeAPI, deletePostAPI
} from "../../services/api.service";
import { AuthContext } from "../../components/context/auth.context";
import "./blog.css";

dayjs.extend(relativeTime);
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CATEGORY_COLOR = { TIM_VIEC: "blue", KINH_NGHIEM: "green", HOI_DAP: "orange", CHIA_SE: "purple" };
const CATEGORY_LABEL = { TIM_VIEC: "Tìm việc", KINH_NGHIEM: "Kinh nghiệm", HOI_DAP: "Hỏi đáp", CHIA_SE: "Chia sẻ" };

const BlogDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        setLoading(true);
        try {
            const [postRes, commentsRes] = await Promise.all([
                fetchPostByIdAPI(id),
                fetchCommentsAPI(id),
            ]);
            if (postRes?.data) setPost(postRes.data);
            if (commentsRes?.data) setComments(commentsRes.data);
            if (user?.id) {
                const likeRes = await checkLikeAPI(id);
                if (likeRes?.data) setLiked(likeRes.data.liked);
            }
        } finally { setLoading(false); }
    };

    const handleLike = async () => {
        if (!user?.id) { message.warning("Vui lòng đăng nhập để thích bài viết"); return; }
        const res = await toggleLikeAPI(id);
        if (res?.data) {
            setLiked(res.data.liked);
            setPost(prev => ({ ...prev, likesCount: res.data.likesCount }));
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        if (!user?.id) { message.warning("Vui lòng đăng nhập để bình luận"); return; }
        setSubmitting(true);
        try {
            const res = await addCommentAPI(id, commentText.trim());
            if (res?.data) {
                setComments(prev => [...prev, res.data]);
                setCommentText("");
                setPost(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
            }
        } finally { setSubmitting(false); }
    };

    const handleDeleteComment = async (commentId) => {
        await deleteCommentAPI(commentId);
        setComments(prev => prev.filter(c => c.id !== commentId));
        setPost(prev => ({ ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }));
    };

    const handleDeletePost = async () => {
        await deletePostAPI(id);
        message.success("Đã xóa bài viết");
        navigate("/blog");
    };

    if (loading) return <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>;
    if (!post) return null;

    const isAuthor = user?.id && post.author?.id === user.id;
    const isAdmin = user?.role?.name === "SUPER_ADMIN" || user?.role?.name === "ADMIN";

    return (
        <div className="blog-detail-container">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/blog")}
                style={{ marginBottom: 20 }}>Quay lại diễn đàn</Button>

            <Card>
                {/* Post header */}
                <Space style={{ marginBottom: 10 }}>
                    {post.category && (
                        <Tag color={CATEGORY_COLOR[post.category]}>{CATEGORY_LABEL[post.category]}</Tag>
                    )}
                    {post.pinned && <Tag color="red">📌 Ghim</Tag>}
                </Space>

                <Title level={3} style={{ marginBottom: 8 }}>{post.title}</Title>

                <Space size={16} style={{ marginBottom: 20 }}>
                    <Avatar size={32} icon={<UserOutlined />} />
                    <Text strong>{post.author?.name}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>{dayjs(post.createdAt).fromNow()}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}><EyeOutlined /> {post.views} lượt xem</Text>
                </Space>

                {(isAuthor || isAdmin) && (
                    <Space style={{ float: "right" }}>
                        <Button size="small" icon={<EditOutlined />}
                            onClick={() => navigate(`/blog/edit/${post.id}`)}>Sửa</Button>
                        <Popconfirm title="Xóa bài viết này?" onConfirm={handleDeletePost} okText="Xóa" cancelText="Hủy">
                            <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                        </Popconfirm>
                    </Space>
                )}

                <Divider />

                {/* Post content */}
                <div className="blog-content">
                    {post.content ? parse(post.content) : null}
                </div>

                <Divider />

                {/* Like button */}
                <Space>
                    <Button
                        icon={liked ? <LikeFilled style={{ color: "#1677ff" }} /> : <LikeOutlined />}
                        onClick={handleLike}
                        type={liked ? "primary" : "default"}
                        ghost={liked}
                    >
                        {liked ? "Đã thích" : "Thích"} · {post.likesCount}
                    </Button>
                    <Text type="secondary"><CommentOutlined /> {post.commentsCount} bình luận</Text>
                </Space>
            </Card>

            {/* Comments */}
            <Card style={{ marginTop: 16 }} title={`Bình luận (${comments.length})`}>
                {/* Add comment */}
                {user?.id ? (
                    <div style={{ marginBottom: 20 }}>
                        <TextArea
                            rows={3}
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Viết bình luận của bạn..."
                            style={{ marginBottom: 8 }}
                        />
                        <Button type="primary" loading={submitting} onClick={handleComment}>
                            Gửi bình luận
                        </Button>
                    </div>
                ) : (
                    <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                        <a onClick={() => navigate("/login")}>Đăng nhập</a> để bình luận
                    </Text>
                )}

                <List
                    dataSource={comments}
                    locale={{ emptyText: "Chưa có bình luận nào" }}
                    renderItem={item => (
                        <div className="comment-item">
                            <Space align="start" style={{ width: "100%" }}>
                                <Avatar size={32} icon={<UserOutlined />} />
                                <div style={{ flex: 1 }}>
                                    <Space>
                                        <Text strong style={{ fontSize: 13 }}>{item.author?.name}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {dayjs(item.createdAt).fromNow()}
                                        </Text>
                                    </Space>
                                    <Paragraph style={{ margin: "4px 0 0", fontSize: 14 }}>
                                        {item.content}
                                    </Paragraph>
                                </div>
                                {(user?.id === item.author?.id || isAdmin) && (
                                    <Popconfirm title="Xóa bình luận?" onConfirm={() => handleDeleteComment(item.id)}
                                        okText="Xóa" cancelText="Hủy">
                                        <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                )}
                            </Space>
                        </div>
                    )}
                />
            </Card>
        </div>
    );
};

export default BlogDetailPage;
