import React, { useState } from "react";
import ChatAIPopupBody from "./ChatAIPopupBody";

const AIChatPopup = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                style={{
                    position: "fixed",
                    bottom: 30,
                    right: 30,
                    zIndex: 1000,
                    background: "orange",
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    border: "none",
                    boxShadow: "0 0 10px #aaa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onClick={() => setOpen(true)}
                title="Chat với AI"
            >
                <span style={{ fontSize: 32 }}>🤖</span>
            </button>

            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 100,
                        right: 30,
                        width: 370,
                        height: 540,
                        background: "#fff",
                        borderRadius: 18,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        zIndex: 1001,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        border: "1.5px solid #f59e42",
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(90deg, #f59e42 0%, #ffb347 100%)",
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "50%",
                                    background: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 12,
                                    fontSize: 24,
                                    border: "2px solid #f59e42",
                                }}
                            >
                                🤖
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 18, color: "#222" }}>
                                Spotify AI
                            </span>
                        </div>
                        <button
                            style={{
                                background: "transparent",
                                border: "none",
                                fontSize: 22,
                                color: "#222",
                                cursor: "pointer",
                                marginLeft: 8,
                            }}
                            onClick={() => setOpen(false)}
                            title="Đóng"
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ flex: 1, background: "#f8fafc" }}>
                        <ChatAIPopupBody />
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatPopup; 