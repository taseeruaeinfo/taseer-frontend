import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Button from "../../../components/ui/Button";
import { toast } from "react-toastify";

interface PostPopupProps {
  onClose: () => void;
}

export default function PostPopup({ onClose }: PostPopupProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const handlePostSubmit = async () => {
    if (content.trim() === "") return;
    
    setIsLoading(true);
    const token = Cookies.get("jwt");

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
        toast.success("Post created successfully!");
        onClose(); // Close popup after post
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-black">Loading user data...</div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-2xl shadow-xl max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold">Create a Post</h2>
        <textarea
          placeholder="What's on your mind?"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="white"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 py-2 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePostSubmit}
            disabled={isLoading}
            className="rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></div>
                Posting...
              </div>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}