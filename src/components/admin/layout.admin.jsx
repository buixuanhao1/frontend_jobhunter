import React, { useContext, useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Dropdown, Avatar, Badge, Typography } from 'antd';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
    MenuFoldOutlined, MenuUnfoldOutlined, AppstoreOutlined,
    UserOutlined, ScheduleOutlined, AliwangwangOutlined,
    ApiOutlined, ExceptionOutlined, BankOutlined,
    HomeOutlined, LogoutOutlined, SettingOutlined,
    BellOutlined
} from '@ant-design/icons';
import { logoutUserAPI, getAccount } from '../../services/api.service';
import { AuthContext } from '../context/auth.context';
import './layout.admin.css';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const NAV_GROUPS = [
    {
        label: 'Tổng quan',
        items: [
            { key: '/admin', icon: <AppstoreOutlined />, label: 'Dashboard', module: null },
        ]
    },
    {
        label: 'Quản lý',
        items: [
            { key: '/admin/user',    icon: <UserOutlined />,         label: 'Người dùng',   module: 'USERS' },
            { key: '/admin/company', icon: <BankOutlined />,         label: 'Công ty',       module: 'COMPANIES' },
            { key: '/admin/job',     icon: <ScheduleOutlined />,     label: 'Việc làm',      module: 'JOBS' },
            { key: '/admin/resume',  icon: <AliwangwangOutlined />,  label: 'Đơn ứng tuyển', module: 'RESUMES' },
        ]
    },
    {
        label: 'Hệ thống',
        items: [
            { key: '/admin/permission', icon: <ApiOutlined />,       label: 'Quyền hạn',    module: 'PERMISSIONS' },
            { key: '/admin/role',       icon: <ExceptionOutlined />, label: 'Vai trò',       module: 'ROLES' },
        ]
    },
];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) { setUser({ email: "", name: "", id: "" }); navigate('/login'); return; }
            try {
                const res = await getAccount();
                if (res.data) setUser(res.data.user);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    setUser({ email: "", name: "", id: "" });
                    navigate('/login');
                }
            }
        };
        fetchAccount();
    }, []);

    useEffect(() => {
        if (!user?.id) return;
        const role = user?.role?.name;
        if (role && role !== "SUPER_ADMIN") {
            if (role === "HR") navigate("/hr");
            else navigate("/my");
        }
    }, [user?.id, user?.role?.name]);

    const hasPerm = (module) => {
        if (!module) return true; // Dashboard always visible
        return user?.role?.permissions?.some(p => p.module === module) ?? false;
    };

    const handleLogout = async () => {
        await logoutUserAPI();
        localStorage.removeItem("access_token");
        setUser({ email: "", name: "", id: "" });
        message.success('Đăng xuất thành công');
        navigate('/');
    };

    const userMenuItems = [
        { key: 'home', icon: <HomeOutlined />, label: <Link to="/">Về trang chủ</Link> },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: handleLogout },
    ];

    // Build flat menu items with group labels
    const menuItems = NAV_GROUPS.map(group => ({
        key: group.label,
        type: 'group',
        label: collapsed ? null : group.label,
        children: group.items
            .filter(item => hasPerm(item.module))
            .map(item => ({
                key: item.key,
                icon: item.icon,
                label: <Link to={item.key}>{item.label}</Link>,
            }))
    })).filter(g => g.children.length > 0);

    const selectedKey = NAV_GROUPS.flatMap(g => g.items)
        .find(item => item.key !== '/admin' && location.pathname.startsWith(item.key))?.key
        || (location.pathname === '/admin' ? '/admin' : '');

    return (
        <Layout className="admin-layout">
            <Sider
                className="admin-sider"
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={240}
                collapsedWidth={64}
            >
                {/* Logo */}
                <div className={`admin-logo ${collapsed ? 'collapsed' : ''}`}>
                    <div className="admin-logo-icon">⚡</div>
                    {!collapsed && <span className="admin-logo-text">WorkHub Admin</span>}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    className="admin-menu"
                />

                {/* User card bottom */}
                {!collapsed && (
                    <div className="admin-sider-user">
                        <Avatar
                            size={34}
                            style={{ background: "linear-gradient(135deg,#1677ff,#0958d9)", flexShrink: 0 }}
                            icon={<UserOutlined />}
                        />
                        <div className="admin-sider-user-info">
                            <div className="admin-sider-user-name">{user?.name}</div>
                            <div className="admin-sider-user-role">Super Admin</div>
                        </div>
                    </div>
                )}
            </Sider>

            <Layout>
                <Header className="admin-header">
                    <Button
                        type="text"
                        className="admin-collapse-btn"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />

                    {/* Breadcrumb-like page title */}
                    <div className="admin-header-title">
                        {NAV_GROUPS.flatMap(g => g.items).find(i => i.key === selectedKey)?.label || 'Dashboard'}
                    </div>

                    <div className="admin-header-right">
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                            <div className="admin-user-trigger">
                                <Avatar
                                    size={34}
                                    style={{ background: "linear-gradient(135deg,#1677ff,#0958d9)" }}
                                    icon={<UserOutlined />}
                                />
                                <div className="admin-user-info">
                                    <span className="admin-user-name">{user?.name}</span>
                                    <span className="admin-user-role">Super Admin</span>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content className="admin-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
