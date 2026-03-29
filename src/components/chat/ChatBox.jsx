import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Button, Input } from "antd";
import { MessageOutlined, CloseOutlined, SendOutlined } from "@ant-design/icons";
import { AuthContext } from "../context/auth.context";
import useChat from "../../hooks/useChat";
import { fetchChatHistoryAPI, fetchUsersForChatAPI } from "../../services/api.service";
import "./ChatBox.css";

const { TextArea } = Input;

const ChatBox = () => {
    const { user, chatTarget, setChatTarget } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);
    const { connect, sendMessage, disconnect } = useChat();

    // Kết nối WebSocket khi user đã đăng nhập
    useEffect(() => {
        if (!user?.id) return;
        connect(user.id, (newMsg) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
        });
        return () => disconnect();
    }, [user?.id]);

    // Tự scroll xuống cuối khi có tin mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load danh sách user khi mở chat
    useEffect(() => {
        if (!open || !user?.id) return;
        fetchUsersForChatAPI().then((res) => {
            if (res?.data) setUsers(res.data);
        });
    }, [open, user?.id]);

    // Khi có chatTarget từ trang khác (vd: trang job detail bấm "Liên hệ HR")
    useEffect(() => {
        if (!chatTarget) return;
        setOpen(true);
        handleSelectUser(chatTarget);
        setChatTarget(null);
    }, [chatTarget]);

    // Load lịch sử khi chọn người
    const handleSelectUser = async (partner) => {
        setSelectedUser(partner);
        setMessages([]);
        const res = await fetchChatHistoryAPI(partner.id);
        if (res?.data) setMessages(res.data);
    };

    const handleSend = () => {
        if (!inputText.trim() || !selectedUser) return;
        sendMessage(selectedUser.id, inputText.trim());
        setInputText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (instant) => {
        if (!instant) return "";
        return new Date(instant).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Không hiển thị nếu chưa đăng nhập
    if (!user?.id) return null;

    return (
        <>
            {/* Nút mở chat */}
            <button className="chat-toggle-btn" onClick={() => setOpen((v) => !v)}>
                {open ? <CloseOutlined /> : <MessageOutlined />}
            </button>

            {/* Panel chat */}
            {open && (
                <div className="chat-panel">
                    {/* Sidebar danh sách người dùng */}
                    <div className="chat-sidebar">
                        <div className="chat-sidebar-header">Tin nhắn</div>
                        <div className="chat-user-list">
                            {users.map((u) => (
                                <div
                                    key={u.id}
                                    className={`chat-user-item ${selectedUser?.id === u.id ? "active" : ""}`}
                                    onClick={() => handleSelectUser(u)}
                                >
                                    <Avatar size={34} style={{ background: "#1677ff", flexShrink: 0 }}>
                                        {u.name?.substring(0, 1)?.toUpperCase()}
                                    </Avatar>
                                    <div style={{ minWidth: 0 }}>
                                        <div className="chat-user-name">{u.name}</div>
                                        <div className="chat-user-email">{u.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Khu vực chat chính */}
                    <div className="chat-main">
                        {selectedUser ? (
                            <>
                                <div className="chat-main-header">
                                    <Avatar size={28} style={{ background: "#1677ff", marginRight: 8 }}>
                                        {selectedUser.name?.substring(0, 1)?.toUpperCase()}
                                    </Avatar>
                                    {selectedUser.name}
                                </div>

                                <div className="chat-messages">
                                    {messages.map((msg, idx) => {
                                        const isMine = msg.sender?.id === user.id;
                                        return (
                                            <div key={msg.id ?? idx} className={`chat-msg-row ${isMine ? "mine" : "theirs"}`}>
                                                <div>
                                                    <div className="chat-bubble">{msg.content}</div>
                                                    <div className="chat-msg-time">{formatTime(msg.createdAt)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="chat-input-area">
                                    <TextArea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập tin nhắn... (Enter để gửi)"
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={handleSend}
                                        disabled={!inputText.trim()}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="chat-empty">
                                <MessageOutlined style={{ fontSize: 36, color: "#d9d9d9" }} />
                                <span>Chọn người để bắt đầu nhắn tin</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;
