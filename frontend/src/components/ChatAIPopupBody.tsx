import React, { useEffect, useState, useCallback, useRef } from "react";
import { AIService } from "@/services/AIService";

const AI_CHAT_USER_ID = 3; // Đảm bảo đúng với backend
const BOT_AVATAR = "🤖";
const BOT_NAME = "Spotify AI";
const QUICK_REPLIES = [
    "Gợi ý nhạc mới",
    "Tôi muốn nghe nhạc Pop",
    "Tìm bài hát theo lời",
    "Tôi muốn nghe lại playlist cũ"
];

const ChatAIPopupBody = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([{
        from: "bot",
        text: "Xin chào 👋\nTôi là Spotify AI. Bạn muốn nghe gì hôm nay?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
    const [input, setInput] = useState("");
    const [isAiResponding, setIsAiResponding] = useState(false);

    // Lấy user hiện tại từ localStorage/session
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const aiService = AIService.getInstance();

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (user?.id) {
                aiService.clearUserCache(user.id);
            }
        };
    }, [user?.id]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        // Thêm tin nhắn của user vào chat
        setMessages(prev => [
            ...prev,
            { from: "user", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
        ]);
        setInput("");

        // Gọi API a2a_server
        setIsAiResponding(true);
        try {
            const response = await aiService.sendMessage(user?.id || '1', text);

            // Thêm phản hồi từ AI vào chat
            setMessages(prev => [
                ...prev,
                {
                    from: "bot",
                    text: response.result,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [
                ...prev,
                {
                    from: "bot",
                    text: error instanceof Error ? error.message : "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
            ]);
        } finally {
            setIsAiResponding(false);
        }
    }, [user?.id]);

    if (error)
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
                {error}
            </div>
        );

    // Giao diện như cũ, nhưng messages đã load từ BE
    return (
        <>
            {/* Nút mở chat */}
            <button
                style={{
                    position: "fixed", bottom: 30, right: 30, zIndex: 1000,
                    background: "#ff4081", borderRadius: "50%", width: 60, height: 60, border: "none",
                    boxShadow: "0 0 10px #aaa", display: "flex", alignItems: "center", justifyContent: "center"
                }}
                onClick={() => setOpen(true)}
                title="Chat với AI"
            >
                <span style={{ fontSize: 32, color: "#fff" }}>{BOT_AVATAR}</span>
            </button>

            {/* Popup chat */}
            {open && (
                <div
                    style={{
                        position: "fixed", bottom: 100, right: 30, width: 350, height: 500,
                        background: "#fff", borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        zIndex: 1001, display: "flex", flexDirection: "column", overflow: "hidden"
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: "#ff4081", padding: "16px 20px", display: "flex",
                        alignItems: "center", justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: "50%", background: "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginRight: 12, fontSize: 24, border: "2px solid #ff4081"
                            }}>
                                {BOT_AVATAR}
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>{BOT_NAME}</span>
                        </div>
                        <button
                            style={{
                                background: "transparent", border: "none", fontSize: 22,
                                color: "#fff", cursor: "pointer", marginLeft: 8
                            }}
                            onClick={() => setOpen(false)}
                            title="Đóng"
                        >×</button>
                    </div>
                    {/* Body */}
                    <div style={{ flex: 1, background: "#f8fafc", padding: 16, overflowY: "auto" }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: "flex", flexDirection: "column",
                                alignItems: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 12
                            }}>
                                <div style={{
                                    background: msg.from === "bot" ? "#f1f1f1" : "#ff4081",
                                    color: msg.from === "bot" ? "#222" : "#fff",
                                    borderRadius: 18, padding: "10px 16px", maxWidth: 220,
                                    fontSize: 15, fontWeight: 500, whiteSpace: "pre-line"
                                }}>
                                    {msg.from === "bot"
                                        ? msg.text.split('\n').map((line, idx) => {
                                            // Nếu là dòng bắt đầu bằng "- ", render dạng list
                                            if (line.startsWith('- ')) {
                                                return <div key={idx} style={{ marginLeft: 16 }}>• {line.slice(2)}</div>;
                                            }
                                            // Nếu là dòng tiêu đề
                                            if (line.startsWith('Có thể là một trong những bài sau:')) {
                                                return <div key={idx} style={{ fontWeight: 700, marginBottom: 4 }}>{line}</div>;
                                            }
                                            // Nếu là dòng rỗng
                                            if (line.trim() === '') return <br key={idx} />;
                                            // Dòng thường
                                            return <div key={idx}>{line}</div>;
                                        })
                                        : msg.text
                                    }
                                </div>
                                <span style={{
                                    fontSize: 11, color: "#aaa", marginTop: 2,
                                    alignSelf: msg.from === "user" ? "flex-end" : "flex-start"
                                }}>{msg.time}</span>
                            </div>
                        ))}
                        {/* Loading indicator */}
                        {isAiResponding && (
                            <div style={{
                                display: "flex", flexDirection: "column",
                                alignItems: "flex-start", marginBottom: 12
                            }}>
                                <div style={{
                                    background: "#f1f1f1",
                                    borderRadius: 18, padding: "10px 16px",
                                    fontSize: 15, fontWeight: 500
                                }}>
                                    Đang suy nghĩ...
                                </div>
                            </div>
                        )}
                        {/* Quick replies */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                            {QUICK_REPLIES.map((q, i) => (
                                <button
                                    key={i}
                                    style={{
                                        background: "#fff",
                                        color: "#222",
                                        border: "1px solid #ccc",
                                        borderRadius: 20,
                                        padding: "8px 18px",
                                        fontWeight: 500,
                                        marginTop: 2,
                                        cursor: "pointer",
                                        fontSize: 15,
                                        opacity: isAiResponding ? 0.5 : 1,
                                        pointerEvents: isAiResponding ? "none" : "auto"
                                    }}
                                    onClick={() => sendMessage(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Input */}
                    <form
                        style={{
                            display: "flex", alignItems: "center", padding: 12, borderTop: "1px solid #eee", background: "#fff"
                        }}
                        onSubmit={e => { e.preventDefault(); sendMessage(input); }}
                    >
                        <input
                            style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                outline: "none",
                                fontSize: 15,
                                padding: "10px 14px",
                                borderRadius: 18,
                                background: "#fff",
                                color: "#222",
                                marginRight: 8
                            }}
                            placeholder="Write your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={isAiResponding}
                        />
                        <button
                            type="submit"
                            style={{
                                background: "#fff",
                                color: "#222",
                                border: "1px solid #ccc",
                                borderRadius: "50%",
                                width: 38,
                                height: 38,
                                fontSize: 20,
                                cursor: "pointer",
                                opacity: isAiResponding ? 0.5 : 1,
                                pointerEvents: isAiResponding ? "none" : "auto"
                            }}
                        >➤</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatAIPopupBody; 