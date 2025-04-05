"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineRetweet, AiOutlineSend } from "react-icons/ai";
import { toast } from "react-toastify";
import DashboardLayout from "../../../components/main/DashBoardLayout";
import Button from "../../../components/ui/Button";

const dummyPost = {
    id: "1",
    username: "nehajakhar",
    name: "Neha Jakhar",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
    content: "Looking for a fellow creator to co-host a podcast. Let me know if someone would be interested?",
    location: "Dubai, UAE",
    likes: 32,
    isLiked: false,
    badge: "Creator",
};

const dummyComments = [
    {
        id: 1,
        username: "Jane Smith",
        userProfilePic: "https://randomuser.me/api/portraits/women/20.jpg",
        content: "This sounds exciting! I'd love to co-host.",
        time: "3h ago",
    },
    {
        id: 2,
        username: "Alex Tan",
        userProfilePic: "https://randomuser.me/api/portraits/men/22.jpg",
        content: "Count me in! DM sent 🚀",
        time: "6h ago",
    },
];

export default function PostDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log("Post ID:", id);
    const [post, setPost] = useState(dummyPost);
    const [comments, setComments] = useState(dummyComments);
    const [newComment, setNewComment] = useState("");

    const handleLike = () => {
        const updatedPost = {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
        setPost(updatedPost);
    };

    const handleComment = () => {
        if (newComment.trim() === "") return;
        const comment = {
            id: comments.length + 1,
            username: "You",
            userProfilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
            content: newComment,
            time: "Just now",
        };
        setComments([comment, ...comments]);
        setNewComment("");
        toast.success("Comment posted!");
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto mt-6 px-4">
                {/* Post Card */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex items-start">
                        {/* Profile Image */}
                        <img
                            src={post.profilePic}
                            alt={post.name}
                            className="w-12 h-12 rounded-full cursor-pointer"
                            onClick={() => navigate(`/profile/${post.username}`)}
                        />
                        <div className="ml-3 flex-1">
                            {/* Name & Badge */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2
                                        className="font-bold text-lg cursor-pointer hover:underline"
                                        onClick={() => navigate(`/profile/${post.username}`)}
                                    >
                                        {post.name}
                                    </h2>
                                    <span className="text-sm text-gray-500">{post.location}</span>
                                    <div className="text-xs text-gray-600 mt-1">{post.badge}</div>
                                </div>
                                <button
                                    onClick={() => toast.success(`You followed ${post.username}!`)}
                                    className="text-blue-500 font-medium"
                                >
                                    Follow
                                </button>
                            </div>
                            {/* Post Content */}
                            <p className="mt-3 text-gray-700">{post.content}</p>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-4 text-gray-600">
                                <button onClick={handleLike} className="flex items-center gap-1">
                                    {post.isLiked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                                    <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1">
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
                </div>

                {/* Comment Input */}
                <div className="bg-white p-5 rounded-lg shadow mb-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <div className="text-right mt-2">
                        <Button
                            variant="primary"
                            onClick={handleComment}
                        >
                            Comment
                        </Button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-4 rounded shadow flex items-start gap-3">
                            <img
                                src={comment.userProfilePic}
                                alt={comment.username}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{comment.username}</p>
                                <p className="text-gray-600 text-sm">{comment.content}</p>
                                <p className="text-xs text-gray-400 mt-1">{comment.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
