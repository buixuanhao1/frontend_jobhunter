import React from "react";

const MinimalTemplate = ({ data }) => {
    const { personal = {}, objective = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data;

    return (
        <div style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontSize: 12,
            color: "#111",
            background: "#fff",
            width: "210mm",
            minHeight: "297mm",
            padding: "16mm 14mm",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto 1fr",
            gap: "0 20px",
        }}>
            {/* Full-width header */}
            <div style={{ gridColumn: "1 / -1", marginBottom: 18, paddingBottom: 14, borderBottom: "3px solid #111" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
                            {personal.name || "Họ và Tên"}
                        </div>
                        {personal.position && (
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#555", marginTop: 4 }}>{personal.position}</div>
                        )}
                    </div>
                    <div style={{ textAlign: "right", fontSize: 11, color: "#555", lineHeight: 1.8 }}>
                        {personal.phone && <div>{personal.phone}</div>}
                        {personal.email && <div>{personal.email}</div>}
                        {personal.address && <div>{personal.address}</div>}
                        {personal.dob && <div>{personal.dob}</div>}
                    </div>
                </div>
            </div>

            {/* Left column */}
            <div>
                {objective && (
                    <MinSection title="Mục tiêu">
                        <p style={{ fontSize: 12, lineHeight: 1.7, color: "#333", margin: 0 }}>{objective}</p>
                    </MinSection>
                )}

                {experience.length > 0 && (
                    <MinSection title="Kinh nghiệm">
                        {experience.map((e, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <strong style={{ fontSize: 12 }}>{e.position}</strong>
                                    <span style={{ fontSize: 10, color: "#888" }}>{e.from}{e.to ? `–${e.to}` : "–Nay"}</span>
                                </div>
                                <div style={{ fontSize: 11, color: "#666", fontStyle: "italic", marginBottom: 3 }}>{e.company}</div>
                                {e.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{e.description}</div>}
                            </div>
                        ))}
                    </MinSection>
                )}

                {projects.length > 0 && (
                    <MinSection title="Dự án">
                        {projects.map((p, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <strong style={{ fontSize: 12 }}>{p.name}</strong>
                                {p.tech && <span style={{ fontSize: 10, color: "#888" }}> · {p.tech}</span>}
                                {p.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{p.description}</div>}
                            </div>
                        ))}
                    </MinSection>
                )}
            </div>

            {/* Right column */}
            <div>
                {education.length > 0 && (
                    <MinSection title="Học vấn">
                        {education.map((e, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <strong style={{ fontSize: 12 }}>{e.school}</strong>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 11, color: "#555" }}>{e.degree}{e.major ? ` · ${e.major}` : ""}</span>
                                    <span style={{ fontSize: 10, color: "#888" }}>{e.from}{e.to ? `–${e.to}` : ""}</span>
                                </div>
                                {e.gpa && <div style={{ fontSize: 10, color: "#888" }}>GPA: {e.gpa}</div>}
                            </div>
                        ))}
                    </MinSection>
                )}

                {skills.length > 0 && (
                    <MinSection title="Kỹ năng">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {skills.map((s, i) => (
                                <span key={i} style={{
                                    fontSize: 11, padding: "2px 8px",
                                    background: "#f3f4f6", borderRadius: 4,
                                    border: "1px solid #e5e7eb"
                                }}>
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    </MinSection>
                )}

                {certifications.length > 0 && (
                    <MinSection title="Chứng chỉ">
                        {certifications.map((c, i) => (
                            <div key={i} style={{ marginBottom: 6 }}>
                                <strong style={{ fontSize: 12 }}>{c.name}</strong>
                                <div style={{ fontSize: 11, color: "#666" }}>{c.issuer}{c.date ? ` · ${c.date}` : ""}</div>
                            </div>
                        ))}
                    </MinSection>
                )}
            </div>
        </div>
    );
};

const MinSection = ({ title, children }) => (
    <div style={{ marginBottom: 16 }}>
        <div style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: 1.5, color: "#111",
            borderBottom: "1.5px solid #111", paddingBottom: 3, marginBottom: 8
        }}>{title}</div>
        {children}
    </div>
);

export default MinimalTemplate;
