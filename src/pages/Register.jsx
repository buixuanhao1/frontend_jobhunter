import { notification, Button } from "antd";
import '@ant-design/v5-patch-for-react-19';
import "antd/dist/reset.css"; // Quan trọng: Import CSS của Ant Design
const Register = () => {
    const handleNotify = () => {
        notification.error({
            message: "Login success!",
            description: "Đăng nhập thành công!"
        });
    };

    return (
        <div>
            <Button onClick={handleNotify}>Hiển thị thông báo</Button>
        </div>
    );
};

export default Register;