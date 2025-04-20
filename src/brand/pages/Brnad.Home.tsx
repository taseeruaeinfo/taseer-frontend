"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineRetweet, AiOutlineSend, AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BrandLayout from "../components/BrandLayout";
import CusotmAdsBar from "../components/CustomAds";

type Post = {
    id: string;
    username: string;
    name: string;
    profilePic: string;
    content: string;
    location: string;
    likes: number;
    isLiked: boolean;
    badge: string;
};

const posts: Post[] = [
    {
        id: "1",
        username: "nehajakhar",
        name: "Neha Jakhar",
        profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
        content: "Looking for a fellow creator to co-host a podcast. Let me know if someone would be interested?",
        location: "Dubai, UAE",
        likes: 32,
        isLiked: false,
        badge: "Creator",
    },
    {
        id: "2",
        username: "taseerbrand",
        name: "Taseer",
        profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
        content: "We're organizing One Billion Summit, a global event bringing together top influencers, creators, and entrepreneurs.",
        location: "Dubai, UAE",
        likes: 21,
        isLiked: false,
        badge: "Brand",
    },
];

export default function BrandPosts() {
    const navigate = useNavigate();
    const [postsData, setPostsData] = useState(posts);

    const handleFollow = (username: string) => {
        toast.success(`You followed ${username}!`);
    };

    const handleLike = (id: string) => {
        setPostsData((prev) =>
            prev.map((post) => (post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post))
        );
    };

    return (
        <BrandLayout>
            <div className="max-w-6xl mx-auto px-4 lg:flex gap-6">
                {/* Main Posts Section */}
                <div className="lg:w-2/3">
                    {/* Search Bar */}
                    <div className="relative w-full mb-6">
                        <AiOutlineSearch className="absolute left-4 top-3 text-gray-500 text-xl" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring focus:ring-purple-300"
                        />
                    </div>

                    {/* Posts */}
                    {postsData.map((post) => (
                        <div key={post.id} className="bg-white p-5 rounded-lg shadow mb-4">
                            <div className="flex items-start">
                                {/* Profile Image */}
                                <img
                                    src={post.profilePic}
                                    alt={post.name}
                                    className="w-12 h-12 rounded-full cursor-pointer"
                                    onClick={() => navigate(`/profile/${post.username}`)}
                                />

                                {/* Name, Badge & Location */}
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center">
                                        <h2
                                            className="font-bold text-lg cursor-pointer hover:underline"
                                            onClick={() => navigate(`/profile/${post.username}`)}
                                        >
                                            {post.name}
                                        </h2>
                                        <span className="ml-2 text-xs text-gray-700 px-2 py-1 rounded-full">{post.badge}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{post.location}</p>
                                </div>

                                {/* Follow Button */}
                                <button
                                    onClick={() => handleFollow(post.username)}
                                    className="text-blue-500 font-medium"
                                >
                                    Follow
                                </button>
                            </div>

                            {/* Post Content */}
                            <p className="mt-3 text-gray-700">{post.content}</p>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-4 text-gray-600">
                                <button onClick={() => handleLike(post.id)} className="flex items-center gap-1">
                                    {post.isLiked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                                    <span>{post.likes}</span>
                                </button>
                                <button onClick={() => navigate(`/post/${post.id}`)} className="flex items-center gap-1">
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
                    ))}
                </div>


            </div>
            <CusotmAdsBar />
        </BrandLayout>
    );
}
