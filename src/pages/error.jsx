import { Button, Result } from "antd";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError(); // Có thể là null hoặc undefined
    console.error(error);

    return (
        <Result
            status="404"
            title="Oops!"
            subTitle={error?.statusText || error?.message || "Something went wrong!"}
            extra={
                <Link to="/">
                    <Button type="primary">Back to homepage</Button>
                </Link>
            }
        />
    );
}
