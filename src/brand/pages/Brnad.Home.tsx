"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineRetweet, AiOutlineSend, AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BrandLayout from "../components/BrandLayout";

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

                {/* Right Sidebar (Recommended Creators) */}
                <div className=" bg-white hidden lg:block lg:w-1/3">
                    <div className=" p-5 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-3">Recommended Creators</h3>

                        {/* Recommended Creator Card */}
                        {[
                            {
                                name: "Neha Jakhar",
                                username: "nehajakhar",
                                location: "Dubai, UAE",
                                badge: "Creator",
                                tags: ["Lifestyle", "Education", "Travel", "Entrepreneur"],
                                profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
                            },
                            {
                                name: "John Doe",
                                username: "johndoe",
                                location: "New York, USA",
                                badge: "Influencer",
                                tags: ["Tech", "Business", "Marketing"],
                                profilePic: "https://randomuser.me/api/portraits/women/13.jpg",
                            }
                        ].map((creator, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow mb-3 flex items-center">
                                {/* Profile Image */}
                                <img
                                    src={creator.profilePic}
                                    className="w-12 h-12 rounded-full cursor-pointer"
                                    alt={creator.name}
                                    onClick={() => navigate(`/profile/${creator.username}`)}
                                />

                                {/* Name & Details */}
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center">
                                        <h2
                                            className="font-bold text-md cursor-pointer hover:underline"
                                            onClick={() => navigate(`/profile/${creator.username}`)}
                                        >
                                            {creator.name}
                                        </h2>
                                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                            {creator.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{creator.location}</p>

                                    {/* Tags */}
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {creator.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="border border-gray-400 text-xs px-2 py-1 rounded-lg text-gray-600">
                                                {tag}
                                            </span>
                                        ))}
                                        {creator.tags.length > 3 && (
                                            <span className="border border-gray-400 text-xs px-2 py-1 rounded-lg text-gray-600">
                                                +{creator.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Follow Button */}
                                <button
                                    onClick={() => toast.success(`You followed ${creator.name}!`)}
                                    className="text-blue-500 font-medium"
                                >
                                    Follow
                                </button>
                            </div>
                        ))}

                        {/* View More Button */}
                        <button
                            onClick={() => navigate("/profile/viewmore")}
                            className="text-blue-500 mt-3 block w-full text-center"
                        >
                            View More
                        </button>
                    </div>
                </div>

            </div>
        </BrandLayout>
    );
}
