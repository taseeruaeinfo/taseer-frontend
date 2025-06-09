import { useEffect, useState } from "react";
import DashboardLayout from "../../components/main/DashBoardLayout";
import axios from "axios";
import Cookies from "js-cookie";

export default function PremiumNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("jwt");
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://api.taseer.app/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`, // Make sure to store token on login
        },
      });
      //@ts-expect-error - nwk
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered = notifications;

  return (
    <DashboardLayout>
      <div className="mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
          Your Notifications
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-5">
            {filtered.map((n: any, i: number) => (
              <div
                key={i}
                className="flex items-center p-4 rounded-xl shadow-xl backdrop-blur-md bg-white/70 hover:bg-white/90 transition-all"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{n.message}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                {/* <span className="text-purple-500 text-sm font-semibold">View</span> */}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 pt-10">
                You’re all caught up 🚀
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
