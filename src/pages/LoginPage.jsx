import { useState } from "react";
import { login } from "../services/auth";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await login(email, password);

        if (data && data.statusCode === 200) {
            localStorage.setItem("token", data.access_token);
            alert("Đăng nhập thành công!");
            // Chuyển hướng hoặc cập nhật trạng thái đăng nhập
        } else {
            setError("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div>
            <h1>Đăng nhập</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label>Mật khẩu:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
}

export default LoginPage;
