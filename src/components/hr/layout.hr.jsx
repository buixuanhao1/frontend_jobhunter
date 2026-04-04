import { useContext, useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Button, message } from "antd";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
    DashboardOutlined, FileTextOutlined, SolutionOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined,
    LogoutOutlined, HomeOutlined, BankOutlined
} from "@ant-design/icons";
import { AuthContext } from "../context/auth.context";
import { logoutUserAPI, getAccount } from "../../services/api.service";

const { Sider, Content, Header } = Layout;

const LayoutHR = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) { navigate("/login"); return; }
            try {
                const res = await getAccount();
                if (res.data) setUser(res.data.user);
            } catch {
                localStorage.removeItem("access_token");
                navigate("/login");
            }
        };
        init();
    }, []);

    // Only HR can access this layout
    useEffect(() => {
        if (!user?.id) return; // chưa load xong
        const role = user?.role?.name;
        if (role && role !== "HR") {
            message.warning("Bạn không có quyền truy cập trang này");
            if (role === "SUPER_ADMIN") navigate("/admin");
            else navigate("/my");
        }
    }, [user?.id, user?.role?.name]);

    const handleLogout = async () => {
        await logoutUserAPI();
        localStorage.removeItem("access_token");
        setUser({ email: "", name: "", id: "" });
        message.success("Đăng xuất thành công");
        navigate("/");
    };

    const menuItems = [
        { key: "/hr", icon: <DashboardOutlined />, label: <Link to="/hr">Tổng quan</Link> },
        { key: "/hr/jobs", icon: <FileTextOutlined />, label: <Link to="/hr/jobs">Quản lý Jobs</Link> },
        { key: "/hr/resumes", icon: <SolutionOutlined />, label: <Link to="/hr/resumes">Đơn ứng tuyển</Link> },
    ];

    const userMenu = [
        { key: "home", icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link> },
        { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true, onClick: handleLogout },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                theme="dark"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                style={{ background: "#0f172a" }}
            >
                <div className="hr-sider-logo">
                    {!collapsed && <span className="hr-logo-text">HR Portal</span>}
                    {collapsed && <span style={{ fontSize: 20 }}>💼</span>}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ background: "#0f172a", borderRight: "none" }}
                />
            </Sider>

            <Layout>
                <Header style={{
                    background: "#fff",
                    padding: "0 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                    height: 60
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={["click"]}>
                        <Space style={{ cursor: "pointer" }}>
                            <Avatar
                                style={{ background: "linear-gradient(135deg,#1677ff,#0958d9)" }}
                                icon={<UserOutlined />}
                            />
                            <span style={{ fontWeight: 600, color: "#374151" }}>{user?.name}</span>
                        </Space>
                    </Dropdown>
                </Header>

                <Content style={{ background: "#f5f7fa", padding: 24, minHeight: "calc(100vh - 60px)" }}>
                    <Outlet />
                </Content>
            </Layout>

            <style>{`
                .hr-sider-logo {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid rgba(255,255,255,.08);
                    margin-bottom: 8px;
                }
                .hr-logo-text {
                    font-size: 18px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #60a5fa, #818cf8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.5px;
                }
            `}</style>
        </Layout>
    );
};

export default LayoutHR;
