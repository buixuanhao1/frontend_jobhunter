import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Badge, Dropdown, Empty, List, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { fetchNotificationsAPI, fetchUnreadCountAPI, markAllReadAPI } from "../../services/api.service";
import { AuthContext } from "../context/auth.context";

dayjs.extend(relativeTime);

const TYPE_COLOR = {
    RESUME_STATUS: "#52c41a",
    NEW_MESSAGE:   "#1677ff",
    NEW_JOB:       "#faad14",
    NEW_COMMENT:   "#722ed1",
    NEW_LIKE:      "#ff4d4f",
};

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        if (!user?.id) return;

        // Load dữ liệu ban đầu
        fetchNotificationsAPI().then(res => { if (res?.data) setNotifications(res.data); });
        fetchUnreadCountAPI().then(res => { if (res?.data) setUnreadCount(Number(res.data.count) || 0); });

        // WebSocket subscribe
        const token = localStorage.getItem("access_token");
        const userId = user.id; // capture để dùng trong closure
        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/notifications/${userId}`, (msg) => {
                    try {
                        const newNotif = JSON.parse(msg.body);
                        setNotifications(prev => [newNotif, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    } catch (e) { /* ignore parse error */ }
                });
            },
            onStompError: (frame) => {
                console.warn("Notification WS error:", frame);
            },
        });
        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [user?.id]);

    const handleOpenChange = async (visible) => {
        setOpen(visible);
        if (visible && unreadCount > 0) {
            await markAllReadAPI();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const dropdownContent = (
        <div style={{ width: 340, maxHeight: 420, overflowY: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "12px 16px", fontWeight: 600, borderBottom: "1px solid #f0f0f0", fontSize: 14 }}>
                Thông báo
            </div>
            {notifications.length === 0 ? (
                <Empty description="Không có thông báo" style={{ padding: 24 }} />
            ) : (
                <List
                    dataSource={notifications}
                    renderItem={item => (
                        <List.Item
                            style={{
                                padding: "10px 16px",
                                background: item.read ? "#fff" : "#f0f7ff",
                                cursor: "default",
                                borderBottom: "1px solid #f5f5f5"
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: TYPE_COLOR[item.type] || "#1677ff",
                                        marginTop: 6
                                    }} />
                                }
                                title={<Typography.Text strong style={{ fontSize: 13 }}>{item.title}</Typography.Text>}
                                description={
                                    <>
                                        <div style={{ fontSize: 12, color: "#555" }}>{item.content}</div>
                                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{dayjs(item.createdAt).fromNow()}</div>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );

    if (!user?.id) return null;

    return (
        <Dropdown
            dropdownRender={() => dropdownContent}
            trigger={["click"]}
            open={open}
            onOpenChange={handleOpenChange}
            placement="bottomRight"
        >
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <BellOutlined style={{ fontSize: 20, cursor: "pointer", color: "#555" }} />
            </Badge>
        </Dropdown>
    );
};

export default NotificationBell;
