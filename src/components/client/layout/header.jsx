import {
    AliwangwangOutlined, BankOutlined, CommentOutlined,
    FileTextOutlined, HeartOutlined, HomeOutlined,
    LoginOutlined, LogoutOutlined, SettingOutlined,
    UserOutlined, DashboardOutlined, EditOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, notification, Space, Typography } from "antd";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { logoutUserAPI } from "../../../services/api.service";
import ManageAccount from "../modal/manage.account";
import NotificationBell from "../NotificationBell";
import "./header.css";

const { Text } = Typography;

const NAV_ITEMS = [
    { key: "/",            icon: <HomeOutlined />,        label: "Trang chủ" },
    { key: "/company",     icon: <BankOutlined />,        label: "Công ty" },
    { key: "/job",         icon: <FileTextOutlined />,    label: "Việc làm" },
    { key: "/blog",        icon: <CommentOutlined />,     label: "Diễn đàn" },
    { key: "/cv-builder",  icon: <AliwangwangOutlined />, label: "Tạo CV" },
];

const Header = () => {
    const { user, setUser } = useContext(AuthContext);
    const [openMangeAccount, setOpenManageAccount] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await logoutUserAPI();
            if (res && res.statusCode === 200) {
                localStorage.removeItem("access_token");
                setUser({ email: "", name: "", id: "" });
                notification.success({ message: "Đăng xuất thành công!" });
                navigate("/");
            }
        } catch {
            notification.error({ message: "Có lỗi xảy ra khi đăng xuất!" });
        }
    };

    const userMenuItems = [
        {
            key: "account",
            icon: <SettingOutlined />,
            label: "Quản lý tài khoản",
            onClick: () => setOpenManageAccount(true),
        },
        {
            key: "cv",
            icon: <EditOutlined />,
            label: "Tạo CV",
            onClick: () => navigate("/cv-builder"),
        },
        {
            key: "saved",
            icon: <HeartOutlined />,
            label: "Việc đã lưu",
            onClick: () => navigate("/saved-jobs"),
        },
        {
            key: "portal",
            icon: <DashboardOutlined />,
            label: user?.role?.name === "SUPER_ADMIN" ? "Trang quản trị" :
                   user?.role?.name === "HR"          ? "HR Portal" :
                                                        "Trang cá nhân",
            onClick: () => {
                if (user?.role?.name === "SUPER_ADMIN") navigate("/admin");
                else if (user?.role?.name === "HR") navigate("/hr");
                else navigate("/my");
            },
        },
        { type: "divider" },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <>
            <header className="site-header">
                <div className="header-inner">
                    {/* Logo */}
                    <Link to="/" className="header-logo">
                        <span className="logo-icon">💼</span>
                        <span className="logo-text">WorkHub</span>
                    </Link>

                    {/* Nav */}
                    <nav className="header-nav">
                        {NAV_ITEMS.map(item => (
                            <NavLink
                                key={item.key}
                                to={item.key}
                                end={item.key === "/"}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "nav-link-active" : ""}`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="header-actions">
                        {user?.id ? (
                            <Space size={16} align="center">
                                <NotificationBell />
                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    placement="bottomRight"
                                    trigger={["click"]}
                                >
                                    <div className="user-trigger">
                                        <Avatar
                                            size={34}
                                            style={{ background: "linear-gradient(135deg,#1677ff,#0958d9)", cursor: "pointer" }}
                                            icon={<UserOutlined />}
                                        />
                                        <Text className="user-name" ellipsis style={{ maxWidth: 100 }}>
                                            {user.name}
                                        </Text>
                                    </div>
                                </Dropdown>
                            </Space>
                        ) : (
                            <Space>
                                <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
                                <Button type="primary" onClick={() => navigate("/register")}>
                                    Đăng ký
                                </Button>
                            </Space>
                        )}
                    </div>
                </div>
            </header>

            <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
        </>
    );
};

export default Header;
