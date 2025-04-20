import { useState } from "react";
import { FiSend, FiPaperclip, FiSearch } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import DashboardLayout from "../../../components/main/DashBoardLayout";
const chatUsers = [
    {
        name: "Mohan Bishnoi",
        username: "mohanbishnoi502",
        profile: "https://randomuser.me/api/portraits/men/75.jpg",
        unread: false,
        archived: false,
        messages: [
            { from: "them", text: "Hey, I loved your latest video on monetization!" },
            { from: "me", text: "Thanks! Working on a course next 🧠" },
            { from: "them", text: "That's awesome! Let me know if you collab." }
        ]
    },
    {
        name: "Ritika Sharma",
        username: "ritikasharma",
        profile: "https://randomuser.me/api/portraits/women/44.jpg",
        unread: true,
        archived: false,
        messages: [
            { from: "them", text: "Your Instagram tips reel blew up!" },
            { from: "me", text: "Haha yeah, 20k views in 24h 😍" }
        ]
    },
    {
        name: "Amit Kumar",
        username: "amitkumar",
        profile: "https://randomuser.me/api/portraits/men/32.jpg",
        unread: false,
        archived: true,
        messages: [
            { from: "them", text: "When is your next live session?" },
            { from: "me", text: "Planning for next Friday at 7PM!" }
        ]
    }
];

// Emoji picker data
const emojiGroups = [
    { category: "Smileys", emojis: ["😀", "😁", "😂", "🤣", "😊", "😇", "🙂", "😉"] },
    { category: "Gestures", emojis: ["👍", "👎", "👌", "✌️", "🤞", "👏", "🙌", "🤝"] },
    { category: "Objects", emojis: ["💻", "📱", "🎥", "📸", "🔍", "📊", "📈", "💡"] }
];

export default function BrandsMessagesPage() {
    const [selectedUserIndex, setSelectedUserIndex] = useState(0);
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    const navigate = useNavigate();

    const selectedUser = chatUsers[selectedUserIndex];

    const handleSend = () => {
        if (message.trim()) {
            chatUsers[selectedUserIndex].messages.push({ from: "me", text: message });
            setMessage("");
        }
    };

    const handleEmojiClick = (emoji: any) => {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleAttachment = (type: any) => {
        // This would trigger the file input in a real application
        console.log(`Attachment of type ${type} selected`);
        setShowAttachments(false);
    };

    const filteredUsers = chatUsers.filter(user => {
        // Apply filter (All, Unread, Archived)
        if (filter === "Unread" && !user.unread) return false;
        if (filter === "Archived" && !user.archived) return false;

        // Apply search if active
        if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !user.username.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    return (
        <>
            <DashboardLayout>
                <div className="flex h-[95vh] -m-4 text-gray-800">
                    {/* Sidebar */}
                    <div className="w-[25%] border-r overflow-y-auto bg-white flex flex-col">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-xl">Messages</h2>
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <FiSearch size={20} />
                                </button>
                            </div>

                            {showSearch && (
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full p-2 border rounded-lg mb-2"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            )}

                            <div className="flex space-x-2 text-sm">
                                {["All", "Unread", "Archived"].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => setFilter(option)}
                                        className={clsx(
                                            "px-3 py-1 rounded-full",
                                            filter === option
                                                ? "bg-blue-100 text-blue-700 font-medium"
                                                : "hover:bg-gray-100"
                                        )}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.username}
                                    onClick={() => {
                                        setSelectedUserIndex(chatUsers.indexOf(user));
                                        if (user.unread) user.unread = false;
                                    }}
                                    className={clsx(
                                        "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 relative",
                                        selectedUser.username === user.username && "bg-gray-200"
                                    )}
                                >
                                    <img
                                        src={user.profile}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/profile/${user.username}`);
                                        }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/profile/${user.username}`);
                                                }}
                                                className="font-medium hover:underline"
                                            >
                                                {user.name}
                                            </h4>
                                            {user.unread && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <div className="p-4 border-t bg-white flex flex-col">
                            {/* Emoji Picker */}
                            {showEmojiPicker && (
                                <div className="bg-white border rounded-lg shadow-lg p-2 mb-2">
                                    <div className="flex flex-wrap gap-2">
                                        {emojiGroups.map((group) => (
                                            <div key={group.category} className="w-full">
                                                <div className="text-xs text-gray-500 mb-1">{group.category}</div>
                                                <div className="flex flex-wrap">
                                                    {group.emojis.map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => handleEmojiClick(emoji)}
                                                            className="text-xl p-1 hover:bg-gray-100 rounded"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Attachment Picker */}
                            {showAttachments && (
                                <div className="bg-white border rounded-lg shadow-lg p-2 mb-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Image", "Video", "Document", "Audio", "Poll", "Contact"].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => handleAttachment(type)}
                                                className="p-2 hover:bg-gray-100 rounded text-center"
                                            >
                                                <div className="text-sm">{type}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <button
                                    className="text-gray-600 text-xl hover:text-blue-500"
                                    onClick={() => {
                                        setShowEmojiPicker(!showEmojiPicker);
                                        setShowAttachments(false);
                                    }}
                                >
                                    <BsEmojiSmile />
                                </button>
                                <button
                                    className="text-gray-600 text-xl hover:text-blue-500"
                                    onClick={() => {
                                        setShowAttachments(!showAttachments);
                                        setShowEmojiPicker(false);
                                    }}
                                >
                                    <FiPaperclip />
                                </button>
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
                </div>
            </DashboardLayout>
        </>
    );
}