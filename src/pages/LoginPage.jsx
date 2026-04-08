import { Button, Form, Input, message, notification } from "antd";
import { LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { loginUserAPI, callGoogleLogin } from '../services/api.service';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
import { GoogleLogin } from '@react-oauth/google';
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

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        const res = await callGoogleLogin(credentialResponse.credential);
        if (res.data) {
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            notification.success({ message: "Đăng nhập bằng Google thành công!", duration: 2 });
            navigate("/");
        } else {
            notification.error({
                message: "Đăng nhập Google thất bại",
                description: "Có lỗi xảy ra khi xác thực với hệ thống"
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

                        <div className="auth-options" style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Link to="/forgot-password" style={{ color: '#4f46e5', fontSize: '14px', fontWeight: 500 }}>
                                Quên mật khẩu?
                            </Link>
                        </div>

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

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                notification.error({ message: 'Google Login Failed' });
                            }}
                            useOneTap
                            theme="outline"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                            width="320px"
                        />
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
