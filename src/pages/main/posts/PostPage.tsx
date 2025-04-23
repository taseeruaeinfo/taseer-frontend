import { useState } from "react";
import DashboardLayout from "../../../components/main/DashBoardLayout";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineComment, AiOutlineHeart, AiOutlineRetweet, AiOutlineSend } from "react-icons/ai";



export default function PostPage() {

    const data = {
        id: "1",
        username: "nehajakhar",
        name: "Neha Jakhar",
        profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
        content: "Looking for a fellow creator to co-host a podcast. Let me know if someone would be interested?",
        location: "Dubai, UAE",
        likes: 32,
        isLiked: false,
        badge: "Creator",
    }

    const navigate = useNavigate();
    const [content, setContent] = useState("");

    const handlePostSubmit = () => {
        if (content.trim() === "") return;


    };

    return (
        <DashboardLayout>

            <div className="max-w-xl mx-auto p-4 space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-md space-y-4">
                    <textarea
                        placeholder="What's on your mind?"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        onClick={handlePostSubmit}
                        className="w-full bg-blue-600 text-white rounded-xl py-2 font-semibold hover:bg-blue-700 transition"
                    >
                        Post
                    </Button>
                </div>

                <div className="bg-white p-5 rounded-lg shadow mb-4">
                    <div className="flex items-start">
                        {/* Profile Image */}
                        <img
                            src={data.profilePic}
                            alt={data.name}
                            className="w-12 h-12 rounded-full cursor-pointer"
                            onClick={() => navigate(`/profile/${data.username}`)}
                        />

                        {/* Name, Badge & Location */}
                        <div className="ml-3 flex-1">
                            <div className="flex items-center">
                                <h2
                                    className="font-bold text-lg cursor-pointer hover:underline"
                                    onClick={() => navigate(`/profile/${data.username}`)}
                                >
                                    {data.name}
                                </h2>
                                <span className="ml-2 text-xs text-gray-700 px-2 py-1 rounded-full">{data.badge}</span>
                            </div>
                            <p className="text-sm text-gray-500">{data.location}</p>
                        </div>

                        {/* Follow Button */}
                        <button
                            className="text-blue-500 font-medium"
                        >
                            Follow
                        </button>
                    </div>

                    {/* Post Content */}
                    <p className="mt-3 text-gray-700">{content}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 text-gray-600">
                        <button className="flex items-center gap-1">
                            {data.isLiked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                            <span>{data.likes}</span>
                        </button>
                        <button onClick={() => navigate(`/post/${data.id}`)} className="flex items-center gap-1">
                            <AiOutlineComment />
                            <span>Comment</span>
                        </button>
                        <button className="flex items-center gap-1">
                            <AiOutlineRetweet />
                            <span>Repeat</span>
                        </button>
                        <button className="flex items-center gap-1">
                            <AiOutlineSend />
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout >

    );
}
