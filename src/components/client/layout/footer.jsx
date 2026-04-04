import { Link } from "react-router-dom";
import { GithubOutlined, LinkedinOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./footer.css";

const Footer = () => (
    <footer className="site-footer">
        <div className="footer-inner">
            <div className="footer-brand">
                <Link to="/" className="footer-logo">
                    <span>💼</span>
                    <span className="footer-logo-text">WorkHub</span>
                </Link>
                <p className="footer-tagline">
                    Nền tảng kết nối ứng viên và nhà tuyển dụng hàng đầu Việt Nam.
                    Cơ hội nghề nghiệp đang chờ bạn khám phá.
                </p>
                <div className="footer-socials">
                    <a href="#" className="footer-social"><GithubOutlined /></a>
                    <a href="#" className="footer-social"><LinkedinOutlined /></a>
                    <a href="#" className="footer-social"><MailOutlined /></a>
                </div>
            </div>

            <div className="footer-links-group">
                <div className="footer-col">
                    <div className="footer-col-title">Khám phá</div>
                    <Link to="/job" className="footer-link">Tìm việc làm</Link>
                    <Link to="/company" className="footer-link">Nhà tuyển dụng</Link>
                    <Link to="/blog" className="footer-link">Diễn đàn</Link>
                    <Link to="/saved-jobs" className="footer-link">Việc đã lưu</Link>
                </div>
                <div className="footer-col">
                    <div className="footer-col-title">Tài khoản</div>
                    <Link to="/login" className="footer-link">Đăng nhập</Link>
                    <Link to="/register" className="footer-link">Đăng ký</Link>
                </div>
                <div className="footer-col">
                    <div className="footer-col-title">Liên hệ</div>
                    <span className="footer-contact"><PhoneOutlined /> 0901 234 567</span>
                    <span className="footer-contact"><MailOutlined /> workhub@gmail.com</span>
                    <span className="footer-contact"><EnvironmentOutlined /> Hà Nội, Việt Nam</span>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <span>© {new Date().getFullYear()} WorkHub. All rights reserved.</span>
            <span>Made with ❤️ in Vietnam</span>
        </div>
    </footer>
);

export default Footer;
