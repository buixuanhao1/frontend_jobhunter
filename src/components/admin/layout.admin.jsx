import React, { useContext, useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Dropdown, Space, Avatar } from 'antd';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined, BugOutlined, AppstoreOutlined, UserOutlined, ScheduleOutlined, AliwangwangOutlined, ApiOutlined, ExceptionOutlined, BankOutlined } from '@ant-design/icons';
import { logoutUserAPI, getAccount } from '../../services/api.service';
import { AuthContext } from '../context/auth.context';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await getAccount();
                if (res.data) {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error("Error fetching account:", error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchAccount();
    }, []);

    const menuItems = [
        { label: <Link to='/admin'>Dashboard</Link>, key: '/admin', icon: <AppstoreOutlined /> },
        { label: <Link to='/admin/company'>Company</Link>, key: '/admin/company', icon: <BankOutlined /> },
        { label: <Link to='/admin/user'>User</Link>, key: '/admin/user', icon: <UserOutlined /> },
        { label: <Link to='/admin/job'>Job</Link>, key: '/admin/job', icon: <ScheduleOutlined /> },
        { label: <Link to='/admin/resume'>Resume</Link>, key: '/admin/resume', icon: <AliwangwangOutlined /> },
        { label: <Link to='/admin/permission'>Permission</Link>, key: '/admin/permission', icon: <ApiOutlined /> },
        { label: <Link to='/admin/role'>Role</Link>, key: '/admin/role', icon: <ExceptionOutlined /> },
    ];

    const handleLogout = async () => {
        const res = await logoutUserAPI();
        if (res && +res.statusCode === 200) {
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    };

    const itemsDropdown = [
        { label: <Link to={'/'}>Trang chủ</Link>, key: 'home' },
        { label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>, key: 'logout' },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme='light' collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    <BugOutlined /> ADMIN
                </div>
                <Menu mode="inline" items={menuItems} />
            </Sider>
            <Layout>
                <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <Space style={{ cursor: "pointer" }}>
                            Welcome {user?.name}
                            <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                        </Space>
                    </Dropdown>
                </div>
                <Content style={{ padding: '15px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
