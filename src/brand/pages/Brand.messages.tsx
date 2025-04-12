import { useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import BrandLayout from "../components/BrandLayout";

const chatUsers = [
    {
        name: "Mohan Bishnoi",
        username: "mohanbishnoi502",
        profile: "https://randomuser.me/api/portraits/men/75.jpg",
        messages: [
            { from: "them", text: "Hey, I loved your latest video on monetization!" },
            { from: "me", text: "Thanks! Working on a course next 🧠" },
            { from: "them", text: "That’s awesome! Let me know if you collab." }
        ]
    },
    {
        name: "Ritika Sharma",
        username: "ritikasharma",
        profile: "https://randomuser.me/api/portraits/women/44.jpg",
        messages: [
            { from: "them", text: "Your Instagram tips reel blew up!" },
            { from: "me", text: "Haha yeah, 20k views in 24h 😍" }
        ]
    }
];

export default function BrandsMessagesPage() {
    const [selectedUserIndex, setSelectedUserIndex] = useState(0);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const selectedUser = chatUsers[selectedUserIndex];

    const handleSend = () => {
        if (message.trim()) {
            chatUsers[selectedUserIndex].messages.push({ from: "me", text: message });
            setMessage("");
        }
    };

    return (
        <>
            <BrandLayout>
                <div className="flex h-[95vh] -m-4 text-gray-800">
                    {/* Sidebar */}
                    <div className="w-[25%] border-r overflow-y-auto bg-white">
                        <div className="p-4 font-bold text-xl">Messages</div>
                        {chatUsers.map((user, index) => (
                            <div
                                key={user.username}
                                onClick={() => setSelectedUserIndex(index)}
                                className={clsx(
                                    "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100",
                                    selectedUserIndex === index && "bg-gray-200"
                                )}
                            >
                                <img
                                    src={user.profile}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                                    onClick={() => navigate(`/profile/${user.username}`)}
                                />
                                <div>
                                    <h4
                                        onClick={() => navigate(`/profile/${user.username}`)}
                                        className="font-medium hover:underline"
                                    >
                                        {user.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Box */}
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b flex items-center gap-4 bg-white">
                            <img
                                src={selectedUser.profile}
                                className="w-12 h-12 rounded-full"
                                alt={selectedUser.name}
                            />
                            <div>
                                <h3 className="font-semibold">{selectedUser.name}</h3>
                                <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                            {selectedUser.messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        "max-w-[75%] p-3 rounded-lg",
                                        msg.from === "me"
                                            ? "bg-blue-100 text-right ml-auto"
                                            : "bg-gray-100 text-left mr-auto"
                                    )}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Input Bar */}
                        <div className="p-4 border-t bg-white flex items-center gap-2">
                            <button className="text-gray-600 text-xl">
                                <BsEmojiSmile />
                            </button>
                            <button className="text-gray-600 text-xl">
                                <FiPaperclip />
                            </button>
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 border rounded-full px-4 py-2 outline-none"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={handleSend}
                                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </div>
                </div>
            </BrandLayout>
        </>
    );
}
