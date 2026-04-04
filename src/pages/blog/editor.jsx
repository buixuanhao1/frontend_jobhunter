import { useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Select, Typography } from "antd";
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { createPostAPI, fetchPostByIdAPI, updatePostAPI } from "../../services/api.service";
import "./blog.css";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CATEGORIES = [
    { value: "HOI_DAP", label: "Hỏi đáp" },
    { value: "KINH_NGHIEM", label: "Kinh nghiệm" },
    { value: "TIM_VIEC", label: "Tìm việc" },
    { value: "CHIA_SE", label: "Chia sẻ" },
];

// Minimal rich-text toolbar (bold, italic, link) using execCommand
const Toolbar = ({ editorRef }) => {
    const exec = (cmd, val = null) => { editorRef.current?.focus(); document.execCommand(cmd, false, val); };
    return (
        <div className="blog-editor-toolbar">
            <button onClick={() => exec("bold")} title="Bold"><b>B</b></button>
            <button onClick={() => exec("italic")} title="Italic"><i>I</i></button>
            <button onClick={() => exec("underline")} title="Underline"><u>U</u></button>
            <button onClick={() => exec("insertUnorderedList")} title="Danh sách">• List</button>
            <button onClick={() => exec("insertOrderedList")} title="Đánh số">1. List</button>
            <button onClick={() => {
                const url = prompt("Nhập URL:");
                if (url) exec("createLink", url);
            }} title="Link">🔗 Link</button>
            <button onClick={() => exec("removeFormat")} title="Xóa định dạng">T</button>
        </div>
    );
};

const BlogEditorPage = () => {
    const { id } = useParams(); // nếu có id → chế độ edit
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState("");
    const editorRef = useState(null);
    const navigate = useNavigate();
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            fetchPostByIdAPI(id).then(res => {
                if (res?.data) {
                    form.setFieldsValue({ title: res.data.title, category: res.data.category });
                    setContent(res.data.content || "");
                    if (editorRef[0]) editorRef[0].innerHTML = res.data.content || "";
                }
            });
        }
    }, [id]);

    const handleSubmit = async (values) => {
        const rawContent = editorRef[0]?.innerHTML || content;
        if (!rawContent.trim() || rawContent === "<br>") {
            message.error("Vui lòng nhập nội dung bài viết");
            return;
        }
        setSubmitting(true);
        try {
            const payload = { ...values, content: rawContent };
            if (isEdit) {
                await updatePostAPI(id, payload);
                message.success("Đã cập nhật bài viết");
                navigate(`/blog/${id}`);
            } else {
                const res = await createPostAPI(payload);
                message.success("Đã đăng bài viết");
                navigate(`/blog/${res.data.id}`);
            }
        } catch {
            message.error("Có lỗi xảy ra, vui lòng thử lại");
        } finally { setSubmitting(false); }
    };

    return (
        <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 16px 60px" }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/blog")} style={{ marginBottom: 20 }}>
                Quay lại diễn đàn
            </Button>

            <Card>
                <Title level={4}>{isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}</Title>

                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="category" label="Chủ đề"
                        rules={[{ required: true, message: "Vui lòng chọn chủ đề" }]}
                        initialValue="HOI_DAP">
                        <Select style={{ width: 200 }}>
                            {CATEGORIES.map(c => <Option key={c.value} value={c.value}>{c.label}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="title" label="Tiêu đề"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" },
                                { min: 5, message: "Tiêu đề quá ngắn" }]}>
                        <Input placeholder="Nhập tiêu đề bài viết..." size="large" />
                    </Form.Item>

                    <Form.Item label="Nội dung" required>
                        <Toolbar editorRef={{ current: editorRef[0] }} />
                        <div
                            ref={el => editorRef[1](el)}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={e => setContent(e.currentTarget.innerHTML)}
                            style={{
                                minHeight: 300,
                                padding: "12px 14px",
                                border: "1px solid #d9d9d9",
                                borderRadius: "0 0 8px 8px",
                                outline: "none",
                                fontSize: 15,
                                lineHeight: 1.8,
                            }}
                            dangerouslySetInnerHTML={isEdit ? undefined : { __html: "" }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}
                            icon={<SendOutlined />} size="large">
                            {isEdit ? "Lưu thay đổi" : "Đăng bài"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default BlogEditorPage;
