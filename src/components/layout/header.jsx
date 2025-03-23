import { BankOutlined, FileTextOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    const [current, setCurrent] = useState('home');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const items = [
        {
            label: 'Home',
            key: 'home',
            icon: <HomeOutlined />,
            label: <NavLink to="/">User</NavLink>

        },
        {
            label: 'User',
            key: 'user',
            icon: <UserOutlined />,
            label: <NavLink to="/user">User</NavLink>
        },
        {
            label: 'Company',
            key: 'company',
            icon: <BankOutlined />,
            label: <NavLink to="/company">Company</NavLink>
        },
        {
            label: 'Job',
            key: 'job',
            icon: <FileTextOutlined />,
            label: <NavLink to="/job">User</NavLink>
        },

    ];

    return (<Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />)
}

export default Header;