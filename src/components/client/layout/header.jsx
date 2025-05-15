import { AliwangwangOutlined, BankOutlined, FileTextOutlined, HomeOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, notification } from "antd";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { logoutUserAPI } from "../../../services/api.service";
import ManageAccount from "../modal/manage.account";

const Header = () => {
    const { user, setUser } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');
    const navigate = useNavigate();
    const [openMangeAccount, setOpenManageAccount] = useState(false);

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        try {
            const res = await logoutUserAPI();
            if (res && res.statusCode === 200) {
                localStorage.removeItem("access_token");
                setUser({
                    email: "",
                    name: "",
                    id: ""
                });
                notification.success({ message: "Đăng xuất thành công!" });
                navigate("/");
            } else {
                notification.error({ message: "Đăng xuất thất bại!" });
            }
        } catch (error) {
            console.error("Error during logout:", error);
            notification.error({ message: "Có lỗi xảy ra khi đăng xuất!" });
        }
    }

    const items = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <NavLink to="/">Home</NavLink>
        },
        {
            key: 'company',
            icon: <BankOutlined />,
            label: <NavLink to="/company">Company</NavLink>
        },
        {
            key: 'job',
            icon: <FileTextOutlined />,
            label: <NavLink to="/job">Jobs</NavLink>
        },
        ...(!user.id ? [{
            label: <Link to={"/login"}>Đăng nhập</Link>,
            key: 'login',
            icon: <LoginOutlined />,
        }] : [{
            label: `Welcome ${user.name}`,
            key: 'setting',
            icon: <AliwangwangOutlined />,
            children: [
                {
                    label: <label
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOpenManageAccount(true)}
                    >Quản lý tài khoản</label>,
                },
                {
                    label: <NavLink to="/admin">Trang quản trị</NavLink>,
                },
                {
                    label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
                    key: 'logout',
                }
            ],
        }]),
    ];

    return (
        <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
}

export default Header;