import { Button, Checkbox, Divider, Form, Input, notification, Select } from "antd";
import { registerUserAPI } from "../services/api.service";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate(); // Hook để điều hướng

    const onFinish = async (values) => {
        const res = await registerUserAPI(values.name, values.email, values.password,
            values.gender, values.address, values.age);
        if (res.data) {
            notification.success({
                message: "Register success!",
                description: "Đăng ký thành công!"
            });
            navigate("/"); // Chuyển hướng đến trang Home
        } else {
            notification.error({
                message: "Register failed!",
                description: JSON.stringify(res.message)
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
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#121212" }}>Đăng Ký Tài Khoản</h2>
                    <Divider />
                </div>
                <Form
                    layout="vertical"
                    form={form}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item label="Full Name" name="name"
                        rules={[{ required: true, message: 'Please input your full name!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Age" name="age"
                        rules={[{ required: true, message: 'Please input your age!' }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="gender" label="Giới tính"
                        rules={[{ required: true, message: 'Giới tính không được để trống!' }]}>
                        <Select allowClear>
                            <Select.Option value="MALE">Nam</Select.Option>
                            <Select.Option value="FEMALE">Nữ</Select.Option>
                            <Select.Option value="OTHER">Khác</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Địa chỉ" name="address"
                        rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={() => { form.submit() }} type="primary" style={{ width: "100%" }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
