import { AliwangwangOutlined, BankOutlined, FileTextOutlined, HomeOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, notification } from "antd";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { logoutUserAPI } from "../../../services/api.service";

const Header = () => {
    const { user, setUser } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');
    const navigate = useNavigate(); // Hook để điều hướng

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await logoutUserAPI();
        if (res.data.statusCode === 200) {
            localStorage.removeItem("access_token");
            setUser({
                email: "",
                name: "",
                id: ""
            });
            notification.success({ message: "Logout success!" });
            navigate("/");
        }

    }

    const items = [
        {

            key: 'home',
            icon: <HomeOutlined />,
            label: <NavLink to="/">Home</NavLink>

        },
        {

            key: 'user',
            icon: <UserOutlined />,
            label: <NavLink to="/user">User</NavLink>
        },
        {

            key: 'company',
            icon: <BankOutlined />,
            label: <NavLink to="/company">Company</NavLink>
        },
        {

            key: 'job',
            icon: <FileTextOutlined />,
            label: <NavLink to="/job">User</NavLink>
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
                    label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
                    key: 'logout',
                },
            ],
        }]),


    ];

    return (<Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />)
}

export default Header;