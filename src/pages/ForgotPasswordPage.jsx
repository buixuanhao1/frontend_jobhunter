import { Button, Form, Input, Layout, Typography, Steps, notification } from "antd";
import { MailOutlined, SafetyCertificateOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordAPI, verifyOtpAPI, resetPasswordAPI } from "../services/api.service";
import './auth.css';

const { Title, Text } = Typography;
const { Step } = Steps;

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const onSendOtp = async (values) => {
        setLoading(true);
        try {
            const res = await forgotPasswordAPI(values.email);
            if (res && (res.statusCode === 200 || res.statusCode === 201)) {
                setEmail(values.email);
                notification.success({ message: "Thành công", description: "Đã gửi mã OTP đến email của bạn." });
                setCurrentStep(1);
            } else {
                notification.error({ message: "Lỗi", description: res?.message || "Có lỗi xảy ra khi gửi mã OTP." });
            }
        } catch (error) {
            notification.error({ message: "Gửi mã thất bại", description: error?.response?.data?.message || "Email không tồn tại trong hệ thống." });
        } finally {
            setLoading(false);
        }
    };

    const onVerifyOtp = async (values) => {
        setLoading(true);
        try {
            const res = await verifyOtpAPI(email, values.pin);
            if (res && (res.statusCode === 200 || res.statusCode === 201)) {
                setPin(values.pin);
                setCurrentStep(2);
                notification.success({ message: "Xác thực thành công", description: "Vui lòng nhập mật khẩu mới." });
            } else {
                notification.error({ message: "Lỗi xác thực", description: res?.message || "Mã OTP không chính xác." });
            }
        } catch (error) {
            notification.error({ message: "Lỗi xác thực", description: error?.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn." });
        } finally {
            setLoading(false);
        }
    };

    const onResetPassword = async (values) => {
        setLoading(true);
        try {
            const res = await resetPasswordAPI(email, pin, values.newPassword);
            if (res && res.statusCode === 200) {
                notification.success({ message: "Thành công", description: "Mật khẩu đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ." });
                navigate("/login");
            } else {
                notification.error({ message: "Lỗi", description: res?.message || "Đã xảy ra lỗi không xác định." });
            }
        } catch (error) {
            notification.error({ message: "Đổi mật khẩu thất bại", description: error?.response?.data?.message || "Lỗi không xác định." });
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        if (currentStep === 0) {
            return (
                <Form layout="vertical" onFinish={onSendOtp}>
                    <Form.Item name="email" label="Email" rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}>
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Nhập email của bạn" className="auth-input" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-submit-btn" loading={loading} block>
                            Gửi mã xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            );
        }
        if (currentStep === 1) {
            return (
                <Form layout="vertical" onFinish={onVerifyOtp}>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Text type="secondary">Mã OTP gồm 6 số đã được gửi đến: <b>{email}</b></Text>
                    </div>
                    <Form.Item name="pin" label="Mã OTP 6 số" rules={[
                        { required: true, message: 'Vui lòng nhập mã OTP!' },
                        { len: 6, message: 'Mã OTP phải đủ 6 ký tự!' }
                    ]}>
                        <Input prefix={<SafetyCertificateOutlined className="site-form-item-icon" />} placeholder="Nhập mã 6 số" className="auth-input" style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }} maxLength={6} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-submit-btn" loading={loading} block>
                            Xác thực
                        </Button>
                    </Form.Item>
                </Form>
            );
        }
        if (currentStep === 2) {
            return (
                <Form layout="vertical" onFinish={onResetPassword}>
                    <Form.Item name="newPassword" label="Mật khẩu mới" rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                        { pattern: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Mật khẩu phải có ít nhất 1 chữ hoa và 1 chữ số" }
                    ]}>
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Nhập mật khẩu mới" className="auth-input" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" dependencies={['newPassword']} rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}>
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Xác nhận mật khẩu mới" className="auth-input" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-submit-btn" loading={loading} block>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-banner">
                <div className="auth-banner-content">
                    <Link to="/" className="auth-logo">
                        <span>💼</span>
                        <span className="auth-logo-text">WorkHub</span>
                    </Link>
                    <div className="auth-banner-title">Khôi phục mật khẩu</div>
                    <div className="auth-banner-sub">
                        Đừng lo lắng! Chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản một cách an toàn.
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-box auth-form-box--wide">
                    <div className="auth-form-header">
                        <div className="auth-form-title">Khôi phục mật khẩu</div>
                        <div className="auth-form-sub">
                            Làm theo các bước dưới đây để đặt lại mật khẩu
                        </div>
                    </div>
                    
                    <div className="auth-form-wrapper">
                        <Steps current={currentStep} style={{ marginBottom: 32 }}>
                            <Step title="Email" />
                            <Step title="Xác thực" />
                            <Step title="Mật khẩu" />
                        </Steps>
                        
                        {renderStepContent()}

                        <div className="auth-footer" style={{ marginTop: 24, textAlign: 'center' }}>
                            <Link to="/login" className="auth-link">
                                <ArrowLeftOutlined /> Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
