import React from "react";

const ModernTemplate = ({ data }) => {
    const { personal = {}, objective = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data;

    return (
        <div style={{
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: 13,
            color: "#1a1a2e",
            background: "#fff",
            width: "210mm",
            minHeight: "297mm",
            display: "flex",
            boxSizing: "border-box",
        }}>
            {/* Left sidebar */}
            <div style={{
                width: "72mm",
                background: "linear-gradient(180deg,#1e3a5f 0%,#0f172a 100%)",
                color: "#fff",
                padding: "28px 20px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 20,
            }}>
                {/* Avatar */}
                {personal.avatar ? (
                    <div style={{ textAlign: "center" }}>
                        <img src={personal.avatar} alt="avatar" style={{
                            width: 90, height: 90, borderRadius: "50%",
                            objectFit: "cover", border: "3px solid rgba(255,255,255,.3)"
                        }} />
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            width: 90, height: 90, borderRadius: "50%",
                            background: "rgba(255,255,255,.15)", margin: "0 auto",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 32, color: "rgba(255,255,255,.6)"
                        }}>{personal.name?.charAt(0) || "?"}</div>
                    </div>
                )}

                {/* Contact */}
                <div>
                    <SideTitle>Liên hệ</SideTitle>
                    {personal.phone && <SideItem icon="📞" text={personal.phone} />}
                    {personal.email && <SideItem icon="✉️" text={personal.email} />}
                    {personal.address && <SideItem icon="📍" text={personal.address} />}
                    {personal.dob && <SideItem icon="🎂" text={personal.dob} />}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <SideTitle>Kỹ năng</SideTitle>
                        {skills.map((s, i) => (
                            <div key={i} style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 12, marginBottom: 4, color: "rgba(255,255,255,.85)" }}>{s.name}</div>
                                <div style={{ height: 4, background: "rgba(255,255,255,.2)", borderRadius: 2 }}>
                                    <div style={{
                                        height: "100%", borderRadius: 2,
                                        background: "#60a5fa",
                                        width: s.level === "Expert" ? "95%" : s.level === "Advanced" ? "75%" : s.level === "Intermediate" ? "55%" : "35%"
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <div>
                        <SideTitle>Chứng chỉ</SideTitle>
                        {certifications.map((c, i) => (
                            <div key={i} style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{c.name}</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>{c.issuer} {c.date && `· ${c.date}`}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right content */}
            <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Name */}
                <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5, lineHeight: 1.1 }}>
                        {personal.name || "Họ và tên"}
                    </div>
                    <div style={{ fontSize: 14, color: "#1677ff", fontWeight: 600, marginTop: 4 }}>
                        {personal.position || "Vị trí ứng tuyển"}
                    </div>
                </div>

                {/* Objective */}
                {objective && (
                    <Section title="Mục tiêu nghề nghiệp">
                        <p style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{objective}</p>
                    </Section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <Section title="Kinh nghiệm làm việc">
                        {experience.map((e, i) => (
                            <ExpItem key={i} item={e} />
                        ))}
                    </Section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <Section title="Học vấn">
                        {education.map((e, i) => (
                            <EduItem key={i} item={e} />
                        ))}
                    </Section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <Section title="Dự án tiêu biểu">
                        {projects.map((p, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{p.name}</div>
                                {p.tech && <div style={{ fontSize: 11, color: "#1677ff", marginBottom: 3 }}>Stack: {p.tech}</div>}
                                {p.description && <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>{p.description}</div>}
                                {p.link && <div style={{ fontSize: 11, color: "#1677ff" }}>{p.link}</div>}
                            </div>
                        ))}
                    </Section>
                )}
            </div>
        </div>
    );
};

const SideTitle = ({ children }) => (
    <div style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: 1.2, color: "#60a5fa", marginBottom: 8,
        borderBottom: "1px solid rgba(255,255,255,.1)", paddingBottom: 4
    }}>{children}</div>
);
const SideItem = ({ icon, text }) => (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 5 }}>
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,.75)", lineHeight: 1.5 }}>{text}</span>
    </div>
);
const Section = ({ title, children }) => (
    <div>
        <div style={{
            fontSize: 13, fontWeight: 800, color: "#0f172a", textTransform: "uppercase",
            letterSpacing: .8, borderLeft: "3px solid #1677ff", paddingLeft: 8, marginBottom: 10
        }}>{title}</div>
        {children}
    </div>
);
const ExpItem = ({ item }) => (
    <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{item.position}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>{item.from}{item.to ? ` – ${item.to}` : " – Hiện tại"}</div>
        </div>
        <div style={{ fontSize: 12, color: "#1677ff", fontWeight: 600, marginBottom: 3 }}>{item.company}</div>
        {item.description && <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>{item.description}</div>}
    </div>
);
const EduItem = ({ item }) => (
    <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{item.school}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.from}{item.to ? ` – ${item.to}` : ""}</div>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{item.degree}{item.major ? ` · ${item.major}` : ""}{item.gpa ? ` · GPA: ${item.gpa}` : ""}</div>
    </div>
);

export default ModernTemplate;
