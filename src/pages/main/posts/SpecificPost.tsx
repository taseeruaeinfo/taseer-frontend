"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure you have axios installed
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { toast } from "react-toastify";
import DashboardLayout from "../../../components/main/DashBoardLayout";
import Button from "../../../components/ui/Button";
import Cookies from "js-cookie";

// Replace these with real API responses
const API_URL = "https://api.taseer.app/api/posts"; // Your backend API URL

export default function PostDetails() {
    const navigate = useNavigate();
    const { id } = useParams(); // Post ID from URL
    const [post, setPost] = useState<any>(null); // To store post data
    const [comments, setComments] = useState<any[]>([]); // To store comments
    const [newComment, setNewComment] = useState(""); // New comment text

    // Fetch post and comments when component loads
    useEffect(() => {
        const fetchPostDetails = async () => {
            const token = Cookies.get("jwt")
            try {
                const postResponse = await axios.get(`${API_URL}/${id}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    }
                });
                setPost(postResponse.data); // Assuming post data contains necessary details

                const commentsResponse = await axios.get(`${API_URL}/comments/${id}`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    }
                });
                //@ts-expect-error - wtf
                setComments(commentsResponse.data); // Set the fetched comments
            } catch (error) {
                console.error("Error fetching post or comments", error);
                toast.error("Failed to load post or comments");
            }
        };

        fetchPostDetails();
    }, [id]);

    // Handle like functionality
    const handleLike = () => {
        const updatedPost = {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
        setPost(updatedPost); // Update post data with the like status
    };

    // Handle comment submission
    const handleComment = async () => {
        if (newComment.trim() === "") return;

        const commentData = {
            text: newComment,
        };

        try {
            const token = Cookies.get("jwt")
            const response = await axios.post(`${API_URL}/comments/${id}`, commentData, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setComments([response.data, ...comments]); // Add new comment at the top of the list
            setNewComment(""); // Reset comment input field
            toast.success("Comment posted successfully!");
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("Failed to post comment");
        }
    };



    return (
        <DashboardLayout>
            {
                !post ? <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div> : <div className="max-w-3xl mx-auto mt-6 px-4">
                    {/* Post Card */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <div className="flex items-start">
                            {/* Profile Image */}
                            <img
                                src={post.user?.profilePic}
                                alt={post.name}
                                className="w-12 h-12 rounded-full cursor-pointer"
                                onClick={() => navigate(`/profile/${post.user.username}`)}
                            />
                            <div className="ml-3 flex-1">
                                {/* Name & Badge */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2
                                            className="font-bold text-lg cursor-pointer hover:underline"
                                            onClick={() => navigate(`/profile/${post.username}`)}
                                        >
                                            {post?.user?.username}
                                        </h2>
                                        <span className="text-sm text-gray-500">{post.user?.nationality}</span>
                                    </div>
                                    <button
                                        onClick={() => toast.success(`You followed ${post.username}!`)}
                                        className="text-blue-500 font-medium"
                                    >
                                        Follow
                                    </button>
                                </div>
                                {/* Post Content */}
                                <p className="mt-3 text-3xl text-gray-700">{post?.text}</p>

                                {/* Actions */}
                                <div className="grid grid-cols-4 justify-between mt-4 text-gray-600">
                                    <button onClick={handleLike} className="flex items-center gap-1">
                                        {post.isLiked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1">
                                        <AiOutlineComment />
                                        <span>Comment</span>
                                    </button>
                                    {/* <button className="flex items-center gap-1">
                                        <AiOutlineRetweet />
                                        <span>Repeat</span>
                                    </button>
                                    <button className="flex items-center gap-1">
                                        <AiOutlineSend />
                                        <span>Send</span>
                                    </button> */}
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
                                    src={comment.user.profilePic}
                                    alt={comment.user.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{comment.user.username}</p>
                                    <p className="text-gray-600 text-sm">{comment.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }

        </DashboardLayout>
    );
}
