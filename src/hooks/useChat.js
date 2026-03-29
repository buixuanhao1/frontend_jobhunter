import { useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useChat = () => {
    const clientRef = useRef(null);

    const connect = useCallback((userId, onMessageReceived) => {
        const token = localStorage.getItem("access_token");
        if (!token || !userId) return;

        const client = new Client({
            webSocketFactory: () =>
                new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket connected, subscribing to /topic/chat/" + userId);
                // Subscribe theo userId — khớp với backend gửi vào /topic/chat/{userId}
                client.subscribe(`/topic/chat/${userId}`, (msg) => {
                    onMessageReceived(JSON.parse(msg.body));
                });
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame);
            },
            onDisconnect: () => {
                console.log("WebSocket disconnected");
            },
        });

        client.activate();
        clientRef.current = client;
    }, []);

    const sendMessage = useCallback((receiverId, content) => {
        if (!clientRef.current?.connected) {
            console.warn("WebSocket not connected");
            return;
        }
        clientRef.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify({
                receiverId: String(receiverId),
                content,
            }),
        });
    }, []);

    const disconnect = useCallback(() => {
        clientRef.current?.deactivate();
        clientRef.current = null;
    }, []);

    return { connect, sendMessage, disconnect };
};

export default useChat;
