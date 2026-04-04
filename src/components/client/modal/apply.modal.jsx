import { Button, Col, Divider, Modal, Row, Upload, message, notification, Tabs, Alert } from "antd";
import { UploadOutlined, FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { callCreateResume, callUploadSingleFile } from "../../../services/api.service";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, Link } from "react-router-dom";

const ApplyModal = ({ isModalOpen, setIsModalOpen, jobDetail }) => {
    const { user } = useContext(AuthContext);
    const [urlCV, setUrlCV] = useState("");
    const [activeTab, setActiveTab] = useState("upload");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const savedFileName = localStorage.getItem("cv_builder_filename");
    const savedCVData   = localStorage.getItem("cv_builder_data");
    const savedName     = savedCVData ? JSON.parse(savedCVData)?.personal?.name : null;

    const handleSubmit = async (cvUrl) => {
        if (!cvUrl) { message.error("Vui lòng chọn CV!"); return; }
        if (!user?.id) { setIsModalOpen(false); navigate(`/login?callback=${window.location.href}`); return; }
        if (!jobDetail) return;

        setSubmitting(true);
        try {
            const res = await callCreateResume(cvUrl, jobDetail.id, user.email, user.id);
            if (res.data) {
                message.success("Ứng tuyển thành công!");
                setIsModalOpen(false);
                setUrlCV("");
            } else {
                notification.error({ message: "Có lỗi xảy ra", description: res.message });
            }
        } catch {
            message.error("Có lỗi xảy ra khi ứng tuyển");
        }
        setSubmitting(false);
    };

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        accept: "application/pdf,application/msword,.doc,.docx,.pdf",
        async customRequest({ file, onSuccess, onError }) {
            const res = await callUploadSingleFile(file, "resume");
            if (res?.data) {
                setUrlCV(res.data.fileName);
                onSuccess?.("ok");
            } else {
                setUrlCV("");
                onError?.({ event: new Error(res.message) });
            }
        },
        onChange(info) {
            if (info.file.status === "done") message.success("Tải lên thành công!");
            else if (info.file.status === "error") message.error("Tải lên thất bại");
        },
    };

    const tabItems = [
        {
            key: "upload",
            label: <span><UploadOutlined /> Upload CV</span>,
            children: (
                <div style={{ padding: "16px 0" }}>
                    <div style={{ marginBottom: 12, color: "#6b7280", fontSize: 13 }}>
                        Tải lên file CV của bạn (PDF, DOC, DOCX — tối đa 5MB)
                    </div>
                    <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>Chọn file CV</Button>
                    </Upload>
                    {urlCV && (
                        <div style={{ marginTop: 10, color: "#52c41a", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircleOutlined /> Đã tải lên thành công
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "builder",
            label: <span><FileTextOutlined /> CV đã tạo</span>,
            children: (
                <div style={{ padding: "16px 0" }}>
                    {savedFileName ? (
                        <div>
                            <Alert
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                                message="Tìm thấy CV từ CV Builder"
                                description={
                                    <div>
                                        <div style={{ marginBottom: 8 }}>
                                            CV của <strong>{savedName || "bạn"}</strong> đã được lưu sẵn và sẵn sàng để ứng tuyển.
                                        </div>
                                        <Button
                                            type="primary"
                                            loading={submitting}
                                            onClick={() => handleSubmit(savedFileName)}
                                        >
                                            Dùng CV này để ứng tuyển
                                        </Button>
                                    </div>
                                }
                                style={{ marginBottom: 12 }}
                            />
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <FileTextOutlined style={{ fontSize: 40, color: "#d1d5db", marginBottom: 12 }} />
                            <div style={{ color: "#6b7280", marginBottom: 16 }}>
                                Bạn chưa có CV nào được tạo từ CV Builder
                            </div>
                            <Link to="/cv-builder" onClick={() => setIsModalOpen(false)}>
                                <Button type="primary">Tạo CV ngay</Button>
                            </Link>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Modal
            title={
                <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Ứng tuyển vị trí</div>
                    {jobDetail && (
                        <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 400, marginTop: 2 }}>
                            {jobDetail.name} · {jobDetail.company?.name}
                        </div>
                    )}
                </div>
            }
            open={isModalOpen}
            onCancel={() => { setIsModalOpen(false); setUrlCV(""); }}
            footer={null}
            destroyOnClose
            maskClosable={false}
            width={520}
        >
            {!user?.id ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{ color: "#6b7280", marginBottom: 16 }}>
                        Vui lòng đăng nhập để ứng tuyển công việc này
                    </div>
                    <Button type="primary" onClick={() => { setIsModalOpen(false); navigate("/login"); }}>
                        Đăng nhập
                    </Button>
                </div>
            ) : (
                <>
                    <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", marginBottom: 4, fontSize: 13 }}>
                        <span style={{ color: "#6b7280" }}>Email ứng tuyển: </span>
                        <strong>{user.email}</strong>
                    </div>

                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        size="small"
                    />

                    {activeTab === "upload" && (
                        <div style={{ marginTop: 8, textAlign: "right" }}>
                            <Button
                                type="primary"
                                disabled={!urlCV}
                                loading={submitting}
                                onClick={() => handleSubmit(urlCV)}
                            >
                                Ứng tuyển ngay
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
};

export default ApplyModal;
