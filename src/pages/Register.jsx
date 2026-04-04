import { Button, Form, Input, Select, notification } from "antd";
import {
    UserOutlined, MailOutlined, LockOutlined,
    PhoneOutlined, EnvironmentOutlined,
    EyeInvisibleOutlined, EyeTwoTone
} from "@ant-design/icons";
import { registerUserAPI } from "../services/api.service";
import { useNavigate, Link } from "react-router-dom";
import './auth.css';

const { Option } = Select;

const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        // Gửi role mặc định là USER (id=2)
        const res = await registerUserAPI(
            values.name,
            values.email,
            values.password,
            values.gender,
            values.address,
            values.age
        );
        if (res.data) {
            notification.success({
                message: "Đăng ký thành công!",
                description: "Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục.",
                duration: 3
            });
            navigate("/login");
        } else {
            notification.error({
                message: "Đăng ký thất bại",
                description: typeof res.message === "string" ? res.message : "Email có thể đã được sử dụng"
            });
        }
    };

    return (
        <div className="auth-page">
            {/* Left banner */}
            <div className="auth-banner">
                <div className="auth-banner-content">
                    <Link to="/" className="auth-logo">
                        <span>💼</span>
                        <span className="auth-logo-text">WorkHub</span>
                    </Link>
                    <div className="auth-banner-title">
                        Tạo tài khoản miễn phí
                    </div>
                    <div className="auth-banner-sub">
                        Tham gia cùng hàng nghìn ứng viên đang tìm kiếm cơ hội
                        việc làm tốt nhất tại các công ty hàng đầu Việt Nam.
                    </div>
                    <div className="auth-features">
                        {[
                            "✅ Tìm việc làm phù hợp nhanh chóng",
                            "✅ Tạo CV chuyên nghiệp trực tuyến",
                            "✅ Nhận thông báo việc làm mới nhất",
                            "✅ Kết nối trực tiếp với HR",
                        ].map(f => (
                            <div key={f} className="auth-feature-item">{f}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="auth-form-side">
                <div className="auth-form-box auth-form-box--wide">
                    <div className="auth-form-header">
                        <div className="auth-form-title">Đăng ký tài khoản</div>
                        <div className="auth-form-sub">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="auth-link">Đăng nhập</Link>
                        </div>
                    </div>

                    <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                        <div className="auth-form-grid">
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="auth-input-icon" />}
                                    placeholder="Nguyễn Văn A"
                                    className="auth-input"
                                />
                            </Form.Item>

                            <Form.Item
                                name="age"
                                label="Tuổi"
                                rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}
                            >
                                <Input
                                    type="number"
                                    min={16}
                                    max={100}
                                    placeholder="25"
                                    className="auth-input"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: "email", message: "Email không hợp lệ" }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="auth-input-icon" />}
                                placeholder="email@example.com"
                                className="auth-input"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu" },
                                { min: 6, message: "Mật khẩu ít nhất 6 ký tự" }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="auth-input-icon" />}
                                placeholder="Tối thiểu 6 ký tự"
                                className="auth-input"
                                iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Xác nhận mật khẩu"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) return Promise.resolve();
                                        return Promise.reject("Mật khẩu không khớp!");
                                    }
                                })
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="auth-input-icon" />}
                                placeholder="Nhập lại mật khẩu"
                                className="auth-input"
                                iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <div className="auth-form-grid">
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: "Chọn giới tính" }]}
                            >
                                <Select placeholder="Chọn giới tính" className="auth-input">
                                    <Option value="MALE">Nam</Option>
                                    <Option value="FEMALE">Nữ</Option>
                                    <Option value="OTHER">Khác</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                            >
                                <Input
                                    prefix={<EnvironmentOutlined className="auth-input-icon" />}
                                    placeholder="Hà Nội"
                                    className="auth-input"
                                />
                            </Form.Item>
                        </div>

                        <div className="auth-role-note">
                            🎯 Tài khoản được tạo với vai trò <strong>Ứng viên</strong>
                        </div>

                        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="auth-submit-btn"
                                block
                            >
                                Tạo tài khoản
                            </Button>
                        </Form.Item>

                        <div className="auth-terms">
                            Bằng cách đăng ký, bạn đồng ý với{" "}
                            <a href="#">Điều khoản dịch vụ</a> và{" "}
                            <a href="#">Chính sách bảo mật</a> của chúng tôi.
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
