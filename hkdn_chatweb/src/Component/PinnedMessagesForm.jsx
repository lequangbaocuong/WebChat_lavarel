import React, { useEffect, useState } from "react";
import axios from "axios";

const PinnedMessagesForm = ({ roomId, onClose }) => {
    const [pinnedMessages, setPinnedMessages] = useState([]); // Lưu danh sách tin nhắn
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi

    useEffect(() => {
        const fetchPinnedMessages = async () => {
            const token = localStorage.getItem("auth_token");

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/rooms/${roomId}/pinned-messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    setPinnedMessages(response.data.messages); // Lưu danh sách tin nhắn
                }
            } catch (err) {
                setError("Không thể tải tin nhắn đã ghim.");
                console.error(err);
            } finally {
                setLoading(false); // Tắt loading
            }
        };

        fetchPinnedMessages();
    }, [roomId]);

    const handleUnpinMessage = async (messageId) => {
        const token = localStorage.getItem("auth_token");

        try {
            const response = await axios.post(
                `http://localhost:8000/api/rooms/${roomId}/messages/${messageId}/unpin`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setPinnedMessages((prevMessages) =>
                    prevMessages.filter((message) => message.id !== messageId)
                );

            }
        } catch (err) {
            console.error("Lỗi khi gỡ ghim tin nhắn:", err);
            alert("Không thể gỡ ghim tin nhắn.");
        }
    };



    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
                <h2 className="text-lg font-semibold mb-4">Tin nhắn đã ghim</h2>
                <p>Phòng ID: {roomId}</p>

                {/* Hiển thị danh sách tin nhắn */}
                <div className="mt-4">
                    {pinnedMessages.length > 0 ? (
                        pinnedMessages.map((message) => (
                            <div
                                key={message.id}
                                className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded-lg"
                            >
                                <p className="text-gray-800 text-sm">{message.content}</p>
                                <button
                                    onClick={() => handleUnpinMessage(message.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Gỡ ghim
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Không có tin nhắn nào được ghim.</p>
                    )}
                </div>

                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default PinnedMessagesForm;
