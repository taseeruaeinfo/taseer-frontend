import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import DashboardLayout from "../../../components/main/DashBoardLayout";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {

    AiOutlineComment,
    AiOutlineHeart,
    AiOutlineRetweet,
    AiOutlineSend,
} from "react-icons/ai";
import axios from "axios";

export default function PostPage() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");

    // ✅ Get user from Redux
    const user = useSelector((state: RootState) => state.user);

    const handlePostSubmit = async () => {
        if (content.trim() === "") return;
        const token = Cookies.get("jwt");

        console.log(token)
        try {
            const response = await axios.post(
                "http://localhost:5000/api/posts/create",
                { text: content },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                navigate("/home");
            }
        } catch (error) {
            alert(error)
            console.error("Error creating post:", error);
        }
    };

    if (!user) {
        return <div className="text-center mt-10">Loading user data...</div>;
    }

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

                {/* Preview card using actual user data */}
                <div className="bg-white p-5 rounded-lg shadow mb-4">
                    <div className="flex items-start">
                        <img
                            src={user.profilePic || "https://via.placeholder.com/150"}
                            alt={user.name}
                            className="w-12 h-12 rounded-full cursor-pointer"
                            onClick={() => navigate(`/profile/${user.username}`)}
                        />
                        <div className="ml-3 flex-1">
                            <div className="flex items-center">
                                <h2
                                    className="font-bold text-lg cursor-pointer hover:underline"
                                    onClick={() => navigate(`/profile/${user.username}`)}
                                >
                                    {user.username}
                                </h2>
                                <span className="ml-2 text-xs text-gray-700 px-2 py-1 rounded-full">
                                    {user.type === "creator" ? "Creator" : "Brand"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{user.nationality || "Unknown"}</p>
                        </div>
                    </div>

                    <p className="mt-3 text-gray-700">{content}</p>

                    <div className="flex items-center justify-between mt-4 text-gray-600">
                        <button className="flex items-center gap-1">
                            <AiOutlineHeart />
                            <span>0</span>
                        </button>
                        <button onClick={() => navigate(`/post/preview`)} className="flex items-center gap-1">
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
        </DashboardLayout>
    );
}
