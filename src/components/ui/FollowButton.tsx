import { useState } from "react";
import axios from "axios"; // Assuming axios is used for making HTTP requests
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const FollowButton = ({ followingId, disable }: { followingId: string, disable: boolean }) => {
    const [isFollowing, setIsFollowing] = useState(disable);

    const user = useSelector((state: RootState) => state.user);

    const handleFollow = async () => {
        try {
            const token = Cookies.get("jwt")
            const response = await axios.post(`http://localhost:5000/api/${user?.id}/follow`, {
                followingId,
            }, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            // If successful, toggle the following state
            setIsFollowing(true);
            //@ts-expect-error - wtf
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error following user:", error);
            toast.error("Failed to follow user");
        }
    };

    return (
        <button
            disabled={isFollowing}
            onClick={handleFollow}
            className={`${isFollowing ? "bg-gray-300" : "bg-blue-500"
                } text-white px-4 py-2 rounded`}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    );
};

export default FollowButton;
