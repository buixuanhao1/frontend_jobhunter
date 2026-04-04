import { Button, Form, Input, message, notification } from "antd";
import { LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { loginUserAPI } from '../services/api.service';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
import './auth.css';

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const onFinish = async (values) => {
        const res = await loginUserAPI(values.username, values.password);
        if (res.data) {
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            notification.success({ message: "Đăng nhập thành công!", duration: 2 });
            navigate("/");
        } else {
            notification.error({
                message: "Đăng nhập thất bại",
                description: "Email hoặc mật khẩu không đúng"
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
                        Chào mừng trở lại!
                    </div>
                    <div className="auth-banner-sub">
                        Hàng nghìn cơ hội việc làm đang chờ bạn khám phá.
                        Đăng nhập để tiếp tục hành trình nghề nghiệp của bạn.
                    </div>
                    <div className="auth-stats">
                        {[
                            { value: "500+", label: "Công ty" },
                            { value: "2000+", label: "Việc làm" },
                            { value: "50K+", label: "Ứng viên" },
                        ].map(s => (
                            <div key={s.label} className="auth-stat">
                                <div className="auth-stat-value">{s.value}</div>
                                <div className="auth-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="auth-form-side">
                <div className="auth-form-box">
                    <div className="auth-form-header">
                        <div className="auth-form-title">Đăng nhập</div>
                        <div className="auth-form-sub">
                            Chưa có tài khoản?{" "}
                            <Link to="/register" className="auth-link">Đăng ký ngay</Link>
                        </div>
                    </div>

                    <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                        <Form.Item
                            name="username"
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
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="auth-input-icon" />}
                                placeholder="Nhập mật khẩu"
                                className="auth-input"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 12 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="auth-submit-btn"
                                block
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="auth-divider">
                        <span>hoặc</span>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <Link to="/">
                            <Button className="auth-back-btn" block>Về trang chủ</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
