"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineSearch,
} from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
import FollowButton from "../../components/ui/FollowButton";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import BrandLayout from "../components/BrandLayout";

type Post = {
  id: string;
  text: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    profilePic: string;
    type: string;
    isFollowing: boolean;
  };
  likeCount: number;
  commentCount: number;
  repostCount: number;
  isLiked: boolean;
};

// Define a type for creators

// Sample creators data for the sidebar

export default function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);
  const user = useSelector((state: RootState) => state.user);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Initial fetch of posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch initial posts
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("jwt");
      const response = await axios.get("https://taseer-b.onrender.com/api/posts", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      //@ts-expect-error - idk
      setPosts(response.data.posts);
      //@ts-expect-error - idk
      setNextCursor(response.data.nextCursor);
      //@ts-expect-error - idk
      setHasMore(response.data.nextCursor !== null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts. Please try again.");
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch more posts (for infinite scrolling)
  const fetchMorePosts = async () => {
    if (!nextCursor || loading) return;

    setLoading(true);

    try {
      const token = Cookies.get("jwt");
      const response = await axios.get(
        `https://taseer-b.onrender.com/api/posts?cursor=${nextCursor}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      //@ts-expect-error - idk
      setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      //@ts-expect-error - idk
      setNextCursor(response.data.nextCursor);
      //@ts-expect-error - idk
      setHasMore(response.data.nextCursor !== null);
    } catch (err) {
      console.error("Error fetching more posts:", err);
      setError("Failed to load more posts");
      toast.error("Failed to load more posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        toast.error("You must be logged in to like a post.");
        return;
      }

      // Optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post
        )
      );
      await axios.post(
        `https://taseer-b.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error liking post:", err);
      toast.error("Failed to like post");

      // Rollback optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? post.likeCount - 1
                  : post.likeCount + 1,
              }
            : post
        )
      );
    }
  };

  // Function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BrandLayout>
      <ToastContainer />
      <div className="mx-auto max-w-6xl px-4 lg:flex gap-6">
        {/* Main Posts Section */}
        <div className="w-full">
          {/* Search Bar */}
          <div className="relative ">
            <div className="absolute   bg-white/40 w-full flex gap-x-10 mb-6">
              <AiOutlineSearch className="absolute left-4 top-3 text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring focus:ring-purple-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
              <button className="ml-2 underline" onClick={fetchPosts}>
                Try again
              </button>
            </div>
          )}

          {/* Posts */}
          <section className="w-full mt-16">
            {filteredPosts.length === 0 && !loading ? (
              <div className="bg-white p-5 rounded-lg shadow mb-4 text-center">
                <p className="text-gray-600">
                  {searchTerm ? "No posts match your search" : "No posts found"}
                </p>
              </div>
            ) : (
              filteredPosts.map((post, index) => {
                const isLastElement = index === filteredPosts.length - 1;
                return (
                  <div
                    key={post.id}
                    ref={isLastElement ? lastPostElementRef : null}
                    className="bg-white p-5 rounded-lg shadow mb-4"
                  >
                    <div className="flex items-start">
                      {/* Profile Image */}
                      <img
                        src={
                          post.user.profilePic ||
                          "https://via.placeholder.com/150"
                        }
                        alt={post.user.username}
                        className="w-12 h-12 rounded-full cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/${post.user.username}`)
                        }
                      />

                      {/* Name & Location */}
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <h2
                            className="font-bold text-lg cursor-pointer hover:underline"
                            onClick={() =>
                              navigate(`/profile/${post.user.username}`)
                            }
                          >
                            {post.user.username}
                          </h2>
                          <span className="ml-2 text-xs uppercase bg-purple-500 rounded-full px-2 py-1 text-white">
                            {post.user.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Follow Button */}
                      <FollowButton
                        followingId={post.user.id}
                        disable={
                          post.user.id == user?.id || post.user.isFollowing
                        }
                      />
                    </div>

                    {/* Post Content */}
                    <p className="mt-3 text-gray-700">{post.text}</p>

                    {/* Actions */}
                    <div className="grid grid-cols-4 justify-between mt-4 text-gray-600">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1"
                      >
                        {post.isLiked ? (
                          <AiFillHeart className="text-red-500" />
                        ) : (
                          <AiOutlineHeart />
                        )}
                        <span>{post.likeCount}</span>
                      </button>
                      <button
                        onClick={() => navigate(`/post/${post.id}`)}
                        className="flex items-center gap-1"
                      >
                        <AiOutlineComment />
                        <span>{post.commentCount}</span>
                      </button>
                      {/* <button className="flex items-center gap-1">
                                            <AiOutlineRetweet />
                                            <span>{post.repostCount}</span>
                                        </button>
                                        <button className="flex items-center gap-1">
                                            <AiOutlineSend />
                                            <span>Send</span>
                                        </button> */}
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
        </div>
      </div>
    </BrandLayout>
  );
}
