import React from "react";

const ClassicTemplate = ({ data }) => {
    const { personal = {}, objective = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data;

    return (
        <div style={{
            fontFamily: "'Times New Roman', Georgia, serif",
            fontSize: 13,
            color: "#1a1a1a",
            background: "#fff",
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm 18mm",
            boxSizing: "border-box",
        }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 20, borderBottom: "2px solid #1a1a1a", paddingBottom: 14 }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                    {personal.name || "HỌ VÀ TÊN"}
                </div>
                {personal.position && (
                    <div style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>{personal.position}</div>
                )}
                <div style={{ fontSize: 12, color: "#444", display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                    {personal.phone && <span>📞 {personal.phone}</span>}
                    {personal.email && <span>✉ {personal.email}</span>}
                    {personal.address && <span>📍 {personal.address}</span>}
                    {personal.dob && <span>🎂 {personal.dob}</span>}
                </div>
            </div>

            {objective && (
                <ClassicSection title="MỤC TIÊU NGHỀ NGHIỆP">
                    <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, textAlign: "justify" }}>{objective}</p>
                </ClassicSection>
            )}

            {experience.length > 0 && (
                <ClassicSection title="KINH NGHIỆM LÀM VIỆC">
                    {experience.map((e, i) => (
                        <div key={i} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <strong style={{ fontSize: 13 }}>{e.position}</strong>
                                <span style={{ fontSize: 12, fontStyle: "italic", color: "#555" }}>
                                    {e.from}{e.to ? ` – ${e.to}` : " – Hiện tại"}
                                </span>
                            </div>
                            <div style={{ fontStyle: "italic", color: "#444", marginBottom: 4 }}>{e.company}</div>
                            {e.description && <div style={{ fontSize: 12, lineHeight: 1.7, color: "#333", paddingLeft: 12 }}>{e.description}</div>}
                        </div>
                    ))}
                </ClassicSection>
            )}

            {education.length > 0 && (
                <ClassicSection title="HỌC VẤN">
                    {education.map((e, i) => (
                        <div key={i} style={{ marginBottom: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <strong>{e.school}</strong>
                                <span style={{ fontStyle: "italic", fontSize: 12, color: "#555" }}>
                                    {e.from}{e.to ? ` – ${e.to}` : ""}
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#444" }}>
                                {e.degree}{e.major ? ` · ${e.major}` : ""}{e.gpa ? `   |   GPA: ${e.gpa}` : ""}
                            </div>
                        </div>
                    ))}
                </ClassicSection>
            )}

            {skills.length > 0 && (
                <ClassicSection title="KỸ NĂNG">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 0" }}>
                        {skills.map((s, i) => (
                            <span key={i} style={{ fontSize: 12, marginRight: 16 }}>
                                • {s.name}{s.level ? ` (${s.level})` : ""}
                            </span>
                        ))}
                    </div>
                </ClassicSection>
            )}

            {projects.length > 0 && (
                <ClassicSection title="DỰ ÁN TIÊU BIỂU">
                    {projects.map((p, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                            <strong>{p.name}</strong>
                            {p.tech && <span style={{ fontSize: 12, fontStyle: "italic", color: "#555" }}> — {p.tech}</span>}
                            {p.description && <div style={{ fontSize: 12, lineHeight: 1.7, paddingLeft: 12 }}>{p.description}</div>}
                            {p.link && <div style={{ fontSize: 12, color: "#1677ff" }}>{p.link}</div>}
                        </div>
                    ))}
                </ClassicSection>
            )}

            {certifications.length > 0 && (
                <ClassicSection title="CHỨNG CHỈ">
                    {certifications.map((c, i) => (
                        <div key={i} style={{ marginBottom: 6, fontSize: 12 }}>
                            <strong>{c.name}</strong>
                            {c.issuer && <span style={{ color: "#555" }}> — {c.issuer}</span>}
                            {c.date && <span style={{ fontStyle: "italic", color: "#777" }}> ({c.date})</span>}
                        </div>
                    ))}
                </ClassicSection>
            )}
        </div>
    );
};

const ClassicSection = ({ title, children }) => (
    <div style={{ marginBottom: 16 }}>
        <div style={{
            fontSize: 13, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: 1, borderBottom: "1px solid #333",
            paddingBottom: 4, marginBottom: 10
        }}>{title}</div>
        {children}
    </div>
);

export default ClassicTemplate;
