import { useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const PrivateRoute = (props) => {

    const { user } = useContext(AuthContext);
    console.log(user);
    if (user && user.id) {
        return (
            <>
                {props.children}
            </>
        )
    }
    return (

        <Result
            status="403"
            title="Oops!"
            subTitle={"Bạn cần đăng nhập để truy cập nguồn tài nguyên này!"}
            extra={
                <Link to="/login">
                    <Button type="primary">Go to login page</Button>
                </Link>
            }
        />
    );
}

export default PrivateRoute;