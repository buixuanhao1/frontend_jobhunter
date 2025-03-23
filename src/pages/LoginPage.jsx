import { Button, Input, notification } from 'antd';
import { useState } from "react";
import { loginUserAPI } from '../services/api.service';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleClickBtn = async () => {

        const res = await loginUserAPI(username, password);
        console.log(res);
        if (res.data) {
            notification.success({
                message: "Login success!",
                description: "Đăng nhập thành công!"
            })
        } else {
            notification.error({
                message: "Login failed!",
                description: res.error
            })
        }
    }

    return (<>
        <div>
            <span>User Name</span>
            <Input placeholder="Email" value={username} onChange={(event) => { setUsername(event.target.value) }} />
            <span>Password</span>
            <Input.Password placeholder="Password" value={password} onChange={(event) => { setPassword(event.target.value) }} />
        </div>
        <div>
            <Button type='primary' onClick={() => { handleClickBtn() }}> Create user </Button>
        </div>
    </>

    )
}

export default LoginPage;