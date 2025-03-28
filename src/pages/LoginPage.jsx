import { Button, Checkbox, Divider, Form, Input, notification, Select } from "antd";
import { loginUserAPI } from '../services/api.service';
import { useNavigate } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
const LoginPage = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate(); // Hook để điều hướng
    const { setUser } = useContext(AuthContext);

    const onFinish = async (values) => {

        const res = await loginUserAPI(values.username, values.password);
        if (res.data) {
            notification.success({
                message: "Login success!",
                description: "Đăng nhập thành công!"
            })
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            navigate("/"); // Chuyển hướng đến trang Home
        } else {
            notification.error({
                message: "Login failed!",
                description: res.error
            })
        }
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",  // Chiều cao full màn hình
            backgroundColor: "#f1f5f9"
        }}>
            <div style={{
                width: "400px",
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#121212" }}>Đăng Nhập</h2>
                    <Divider />
                </div>
                <Form
                    layout="vertical"
                    form={form}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="User Name"
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' }, // Kiểm tra bắt buộc nhập
                            { type: 'email', message: 'Email không hợp lệ!' } // Kiểm tra đúng định dạng email
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Form.Item label="Password" name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;