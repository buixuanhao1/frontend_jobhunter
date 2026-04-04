import { useState, useRef, useContext, useCallback } from "react";
import {
    Button, Form, Input, Select, Tabs, Steps, message,
    Divider, Tooltip, Upload, Modal
} from "antd";
import {
    PlusOutlined, DeleteOutlined, DownloadOutlined,
    EyeOutlined, SaveOutlined, UploadOutlined, CheckOutlined
} from "@ant-design/icons";
import { AuthContext } from "../../components/context/auth.context";
import { callUploadSingleFile } from "../../services/api.service";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import "./cv-builder.css";

const { Option } = Select;
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const TEMPLATES = [
    { key: "modern",  label: "Modern",  desc: "Sidebar màu tối, hiện đại" },
    { key: "classic", label: "Classic", desc: "Truyền thống, chuyên nghiệp" },
    { key: "minimal", label: "Minimal", desc: "Tối giản, 2 cột" },
];

const EMPTY_DATA = {
    personal: { name: "", position: "", email: "", phone: "", address: "", dob: "", avatar: "" },
    objective: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
};

const loadSaved = () => {
    try { return JSON.parse(localStorage.getItem("cv_builder_data") || "null"); } catch { return null; }
};

const CVBuilder = () => {
    const { user } = useContext(AuthContext);
    const [template, setTemplate] = useState("modern");
    const [data, setData] = useState(() => loadSaved() || { ...EMPTY_DATA, personal: { ...EMPTY_DATA.personal, name: user?.name || "", email: user?.email || "" } });
    const [activeTab, setActiveTab] = useState("personal");
    const [exporting, setExporting] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const previewRef = useRef(null);

    const TemplateComp = template === "modern" ? ModernTemplate : template === "classic" ? ClassicTemplate : MinimalTemplate;

    const update = useCallback((section, value) => {
        setData(d => ({ ...d, [section]: value }));
    }, []);

    const updatePersonal = (field, value) => {
        setData(d => ({ ...d, personal: { ...d.personal, [field]: value } }));
    };

    const saveToLocal = () => {
        localStorage.setItem("cv_builder_data", JSON.stringify(data));
        message.success("Đã lưu CV vào trình duyệt!");
    };

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            const html2pdf = (await import("html2pdf.js")).default;
            const el = previewRef.current;
            await html2pdf().set({
                margin: 0,
                filename: `CV_${data.personal.name || "MyCV"}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            }).from(el).save();
        } catch (e) {
            message.error("Không thể xuất PDF: " + e.message);
        }
        setExporting(false);
    };

    const handleUploadAndSave = async () => {
        setSaving(true);
        try {
            const html2pdf = (await import("html2pdf.js")).default;
            const el = previewRef.current;
            const blob = await html2pdf().set({
                margin: 0,
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            }).from(el).outputPdf("blob");

            const file = new File([blob], `CV_${data.personal.name || "MyCV"}.pdf`, { type: "application/pdf" });
            const res = await callUploadSingleFile(file, "resume");
            if (res?.data?.fileName) {
                localStorage.setItem("cv_builder_filename", res.data.fileName);
                localStorage.setItem("cv_builder_data", JSON.stringify(data));
                message.success("Đã lưu CV lên server! Bạn có thể dùng CV này để ứng tuyển.");
            } else {
                message.error("Lỗi khi lưu lên server");
            }
        } catch (e) {
            message.error("Có lỗi xảy ra: " + e.message);
        }
        setSaving(false);
    };

    const tabItems = [
        {
            key: "personal",
            label: "👤 Cá nhân",
            children: <PersonalForm data={data.personal} onChange={updatePersonal} />,
        },
        {
            key: "objective",
            label: "🎯 Mục tiêu",
            children: (
                <div className="cvb-form-section">
                    <label className="cvb-label">Mục tiêu nghề nghiệp</label>
                    <Input.TextArea
                        rows={6}
                        value={data.objective}
                        onChange={e => update("objective", e.target.value)}
                        placeholder="Mô tả mục tiêu nghề nghiệp của bạn..."
                    />
                </div>
            ),
        },
        {
            key: "experience",
            label: "💼 Kinh nghiệm",
            children: <ListSection
                items={data.experience}
                onChange={v => update("experience", v)}
                fields={EXPERIENCE_FIELDS}
                addLabel="Thêm kinh nghiệm"
                emptyItem={{ position: "", company: "", from: "", to: "", description: "" }}
            />,
        },
        {
            key: "education",
            label: "🎓 Học vấn",
            children: <ListSection
                items={data.education}
                onChange={v => update("education", v)}
                fields={EDUCATION_FIELDS}
                addLabel="Thêm học vấn"
                emptyItem={{ school: "", degree: "", major: "", from: "", to: "", gpa: "" }}
            />,
        },
        {
            key: "skills",
            label: "🛠️ Kỹ năng",
            children: <SkillsSection skills={data.skills} onChange={v => update("skills", v)} />,
        },
        {
            key: "projects",
            label: "🚀 Dự án",
            children: <ListSection
                items={data.projects}
                onChange={v => update("projects", v)}
                fields={PROJECT_FIELDS}
                addLabel="Thêm dự án"
                emptyItem={{ name: "", tech: "", description: "", link: "" }}
            />,
        },
        {
            key: "certifications",
            label: "🏆 Chứng chỉ",
            children: <ListSection
                items={data.certifications}
                onChange={v => update("certifications", v)}
                fields={CERT_FIELDS}
                addLabel="Thêm chứng chỉ"
                emptyItem={{ name: "", issuer: "", date: "" }}
            />,
        },
    ];

    return (
        <div className="cvb-wrapper">
            {/* Top bar */}
            <div className="cvb-topbar">
                <div className="cvb-topbar-left">
                    <div className="cvb-topbar-title">✏️ CV Builder</div>
                    <div className="cvb-topbar-sub">Tạo CV chuyên nghiệp — tải về PDF hoặc dùng để ứng tuyển ngay</div>
                </div>
                <div className="cvb-topbar-actions">
                    <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>Xem trước</Button>
                    <Button icon={<SaveOutlined />} onClick={saveToLocal}>Lưu nháp</Button>
                    <Button icon={<DownloadOutlined />} loading={exporting} onClick={handleExportPDF}>Tải PDF</Button>
                    <Button type="primary" icon={<CheckOutlined />} loading={saving} onClick={handleUploadAndSave}>
                        Lưu & dùng để ứng tuyển
                    </Button>
                </div>
            </div>

            <div className="cvb-body">
                {/* Left: Form */}
                <div className="cvb-left">
                    {/* Template selector */}
                    <div className="cvb-template-picker">
                        <div className="cvb-section-label">Chọn mẫu CV</div>
                        <div className="cvb-template-list">
                            {TEMPLATES.map(t => (
                                <div
                                    key={t.key}
                                    className={`cvb-template-item ${template === t.key ? "active" : ""}`}
                                    onClick={() => setTemplate(t.key)}
                                >
                                    <div className="cvb-template-thumb">
                                        <TemplateThumbnail type={t.key} />
                                    </div>
                                    <div className="cvb-template-name">{t.label}</div>
                                    <div className="cvb-template-desc">{t.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    {/* Form tabs */}
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        size="small"
                        tabPosition="top"
                        className="cvb-tabs"
                    />
                </div>

                {/* Right: Preview */}
                <div className="cvb-right">
                    <div className="cvb-preview-label">Xem trước CV</div>
                    <div className="cvb-preview-scroll">
                        <div className="cvb-preview-page" ref={previewRef}>
                            <TemplateComp data={data} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Full preview modal */}
            <Modal
                open={previewOpen}
                onCancel={() => setPreviewOpen(false)}
                footer={[
                    <Button key="download" type="primary" icon={<DownloadOutlined />} loading={exporting} onClick={handleExportPDF}>
                        Tải PDF
                    </Button>,
                    <Button key="use" icon={<CheckOutlined />} loading={saving} onClick={handleUploadAndSave}>
                        Lưu & ứng tuyển
                    </Button>,
                ]}
                width={900}
                title="Xem trước CV"
                centered
            >
                <div style={{ overflow: "auto", maxHeight: "80vh", background: "#f5f5f5", padding: 20, borderRadius: 8 }}>
                    <div style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,.15)", margin: "0 auto", width: "fit-content" }}>
                        <TemplateComp data={data} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

/* ── Sub-components ──────────────────────────── */

const PersonalForm = ({ data, onChange }) => (
    <div className="cvb-form-section">
        <div className="cvb-form-grid">
            <Field label="Họ và tên *" value={data.name} onChange={v => onChange("name", v)} placeholder="Nguyễn Văn A" />
            <Field label="Vị trí ứng tuyển" value={data.position} onChange={v => onChange("position", v)} placeholder="Frontend Developer" />
            <Field label="Email" value={data.email} onChange={v => onChange("email", v)} placeholder="email@example.com" />
            <Field label="Số điện thoại" value={data.phone} onChange={v => onChange("phone", v)} placeholder="0901 234 567" />
            <Field label="Địa chỉ" value={data.address} onChange={v => onChange("address", v)} placeholder="Hà Nội, Việt Nam" />
            <Field label="Ngày sinh" value={data.dob} onChange={v => onChange("dob", v)} placeholder="01/01/2000" />
        </div>
        <div style={{ marginTop: 12 }}>
            <label className="cvb-label">Ảnh đại diện (URL)</label>
            <Input value={data.avatar} onChange={e => onChange("avatar", e.target.value)} placeholder="https://... hoặc để trống" />
        </div>
    </div>
);

const Field = ({ label, value, onChange, placeholder, textarea }) => (
    <div className="cvb-field">
        <label className="cvb-label">{label}</label>
        {textarea
            ? <Input.TextArea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
            : <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        }
    </div>
);

const ListSection = ({ items, onChange, fields, addLabel, emptyItem }) => {
    const add = () => onChange([...items, { ...emptyItem }]);
    const remove = i => onChange(items.filter((_, idx) => idx !== i));
    const set = (i, field, val) => {
        const next = [...items];
        next[i] = { ...next[i], [field]: val };
        onChange(next);
    };

    return (
        <div className="cvb-form-section">
            {items.map((item, i) => (
                <div key={i} className="cvb-list-item">
                    <div className="cvb-list-item-header">
                        <span className="cvb-list-item-num">#{i + 1}</span>
                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(i)} />
                    </div>
                    <div className="cvb-form-grid">
                        {fields.map(f => (
                            <div key={f.key} className={`cvb-field ${f.full ? "cvb-field-full" : ""}`}>
                                <label className="cvb-label">{f.label}</label>
                                {f.textarea
                                    ? <Input.TextArea rows={3} value={item[f.key] || ""} onChange={e => set(i, f.key, e.target.value)} placeholder={f.placeholder} />
                                    : <Input value={item[f.key] || ""} onChange={e => set(i, f.key, e.target.value)} placeholder={f.placeholder} />
                                }
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <Button icon={<PlusOutlined />} onClick={add} block style={{ marginTop: 8 }}>{addLabel}</Button>
        </div>
    );
};

const SkillsSection = ({ skills, onChange }) => {
    const add = () => onChange([...skills, { name: "", level: "Intermediate" }]);
    const remove = i => onChange(skills.filter((_, idx) => idx !== i));
    const set = (i, field, val) => {
        const next = [...skills];
        next[i] = { ...next[i], [field]: val };
        onChange(next);
    };

    return (
        <div className="cvb-form-section">
            {skills.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <Input style={{ flex: 1 }} value={s.name} onChange={e => set(i, "name", e.target.value)} placeholder="Tên kỹ năng (VD: ReactJS)" />
                    <Select value={s.level} onChange={v => set(i, "level", v)} style={{ width: 140 }}>
                        {SKILL_LEVELS.map(l => <Option key={l} value={l}>{l}</Option>)}
                    </Select>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(i)} />
                </div>
            ))}
            <Button icon={<PlusOutlined />} onClick={add} block style={{ marginTop: 4 }}>Thêm kỹ năng</Button>
        </div>
    );
};

const TemplateThumbnail = ({ type }) => {
    const styles = {
        modern:  { left: "#1e3a5f", right: "#f0f5ff", accent: "#1677ff" },
        classic: { left: "#fff",    right: "#fff",    accent: "#333" },
        minimal: { left: "#fff",    right: "#f8f8f8", accent: "#111" },
    };
    const s = styles[type];
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", background: "#fff", borderRadius: 4, overflow: "hidden" }}>
            {type === "modern" && (
                <>
                    <div style={{ width: "35%", background: s.left }} />
                    <div style={{ flex: 1, padding: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ height: 6, background: "#1a1a2e", borderRadius: 2, width: "70%" }} />
                        <div style={{ height: 3, background: s.accent, borderRadius: 2, width: "40%" }} />
                        <div style={{ height: 2, background: "#e5e7eb", borderRadius: 2, width: "90%", marginTop: 4 }} />
                        <div style={{ height: 2, background: "#e5e7eb", borderRadius: 2, width: "75%" }} />
                        <div style={{ height: 2, background: "#e5e7eb", borderRadius: 2, width: "85%" }} />
                    </div>
                </>
            )}
            {type === "classic" && (
                <div style={{ flex: 1, padding: 4, display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                    <div style={{ height: 6, background: "#1a1a1a", borderRadius: 2, width: "60%" }} />
                    <div style={{ height: 1, background: "#333", width: "90%", marginTop: 2, marginBottom: 2 }} />
                    <div style={{ height: 2, background: "#e0e0e0", borderRadius: 2, width: "90%" }} />
                    <div style={{ height: 2, background: "#e0e0e0", borderRadius: 2, width: "80%" }} />
                    <div style={{ height: 1, background: "#333", width: "90%", marginTop: 2 }} />
                    <div style={{ height: 2, background: "#e0e0e0", borderRadius: 2, width: "85%" }} />
                </div>
            )}
            {type === "minimal" && (
                <div style={{ flex: 1, padding: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ height: 6, background: "#111", borderRadius: 2, width: "45%" }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
                            <div style={{ height: 2, background: "#ccc", borderRadius: 1, width: 30 }} />
                            <div style={{ height: 2, background: "#ccc", borderRadius: 1, width: 24 }} />
                        </div>
                    </div>
                    <div style={{ height: 1, background: "#111", width: "100%", margin: "2px 0" }} />
                    <div style={{ display: "flex", gap: 4 }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                            <div style={{ height: 2, background: "#ddd", borderRadius: 1 }} />
                            <div style={{ height: 2, background: "#ddd", borderRadius: 1, width: "80%" }} />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                            <div style={{ height: 2, background: "#ddd", borderRadius: 1 }} />
                            <div style={{ height: 2, background: "#ddd", borderRadius: 1, width: "70%" }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Field definitions ───────────────────────── */
const EXPERIENCE_FIELDS = [
    { key: "position",    label: "Vị trí",        placeholder: "Frontend Developer" },
    { key: "company",     label: "Công ty",         placeholder: "FPT Software" },
    { key: "from",        label: "Từ tháng/năm",   placeholder: "01/2022" },
    { key: "to",          label: "Đến tháng/năm",  placeholder: "12/2023 (để trống = Hiện tại)" },
    { key: "description", label: "Mô tả công việc", placeholder: "Mô tả trách nhiệm và thành tích...", full: true, textarea: true },
];
const EDUCATION_FIELDS = [
    { key: "school",  label: "Trường",       placeholder: "Đại học Bách Khoa Hà Nội" },
    { key: "degree",  label: "Bằng cấp",     placeholder: "Kỹ sư / Cử nhân / Thạc sĩ" },
    { key: "major",   label: "Chuyên ngành", placeholder: "Công nghệ thông tin" },
    { key: "from",    label: "Năm bắt đầu",  placeholder: "2018" },
    { key: "to",      label: "Năm kết thúc", placeholder: "2022" },
    { key: "gpa",     label: "GPA",          placeholder: "3.5/4.0" },
];
const PROJECT_FIELDS = [
    { key: "name",        label: "Tên dự án",       placeholder: "E-commerce Website" },
    { key: "tech",        label: "Công nghệ",        placeholder: "ReactJS, Spring Boot, MySQL" },
    { key: "link",        label: "Link",             placeholder: "github.com/..." },
    { key: "description", label: "Mô tả",            placeholder: "Mô tả ngắn về dự án...", full: true, textarea: true },
];
const CERT_FIELDS = [
    { key: "name",   label: "Tên chứng chỉ", placeholder: "AWS Solutions Architect" },
    { key: "issuer", label: "Đơn vị cấp",   placeholder: "Amazon Web Services" },
    { key: "date",   label: "Ngày cấp",     placeholder: "06/2023" },
];

export default CVBuilder;
