"use client";
import { useState, useEffect, useCallback } from "react";
import { FaInstagram, FaFacebook, FaStar, FaEnvelope } from "react-icons/fa";
// import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BrandLayout from "../../../brand/components/BrandLayout";

// Type definitions
interface SocialHandles {
  instagram?: string;
  facebook?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  dob?: string;
  gender?: string;
  city?: string;
  country?: string;
  socialHandles?: SocialHandles;
}

interface Campaign {
  title: string;
  status: string;
}

interface AnalyticsData {
  engagementRate?: string;
  monthlyReach?: string;
  totalCampaigns?: string;
  recentCampaigns?: Campaign[];
}

// interface AudienceData {
//   primaryAgeGroup?: string;
//   genderSplit?: string;
//   topLocation?: string;
//   interests?: string[];
// }

// interface PortfolioItem {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl?: string;
//   url?: string;
//   createdAt: string;
// }

interface Review {
  rating: number;
  comment: string;
  clientName: string;
  createdAt: string;
}

interface Post {
  id: string;
  text: string;
  createdAt: string;
  _count?: {
    likes?: number;
    comments?: number;
    reposts?: number;
  };
}

type TabType = "analytics" | "reviews" | "posts";

interface TabData {
  [key: string]: React.ReactNode;
}

interface TabLoading {
  [key: string]: boolean;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("analytics");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabData, setTabData] = useState<TabData>({});
  const [tabLoading, setTabLoading] = useState<TabLoading>({});
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get<User>(`https://api.taseer.app/api/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user profile");
        setLoading(false);
        console.error("Error fetching user profile:", err);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

//   const handleFollow = async () => {
//     try {
//       // Assuming we have the current user's ID stored somewhere (e.g., in localStorage)
//       const currentUserId = localStorage.getItem("userId");

//       if (!currentUserId) {
//         toast.error("Please login to follow users");
//         return;
//       }

//       await axios.post(`https://api.taseer.app/api/users/${id}/follow`, {
//         followerId: currentUserId,
//       });
//       toast.success(`Following ${user?.firstName} ${user?.lastName}!`);
//     } catch (err) {
//       toast.error("Failed to follow user");
//       console.error("Error following user:", err);
//     }
//   };

  const handleMessage = () => {
    navigate(`/brand/messages/?id=${id}`);
  };

  const fetchTabData = useCallback(
    async (tab: TabType) => {
      if (tabData[tab] || tabLoading[tab]) return;

      setTabLoading((prev) => ({ ...prev, [tab]: true }));

      try {
        let data: React.ReactNode = null;

        switch (tab) {
          case "analytics": {
            // Fetch analytics data from campaigns and posts
            const analyticsResponse = await axios.get<AnalyticsData>(
              `https://api.taseer.app/api/users/${id}/analytics`
            );
            data = (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Analytics Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">
                      Engagement Rate
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {analyticsResponse.data.engagementRate || "0%"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">
                      Monthly Reach
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      {analyticsResponse.data.monthlyReach || "0"}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800">
                      Total Campaigns
                    </h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {analyticsResponse.data.totalCampaigns || "0"}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Recent Performance</h4>
                  <ul className="space-y-2">
                    {analyticsResponse.data.recentCampaigns?.map(
                      (campaign: Campaign, index: number) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <span>{campaign.title}</span>
                          <span className="text-sm text-gray-600">
                            {campaign.status}
                          </span>
                        </li>
                      )
                    ) || <li className="text-gray-500">No recent campaigns</li>}
                  </ul>
                </div>
              </>
            );
            break;
          }

        //   case "audience": {
        //     const audienceResponse = await axios.get<AudienceData>(
        //       `https://api.taseer.app/api/users/${id}/audience`
        //     );
        //     data = (
        //       <>
        //         <h3 className="text-lg font-semibold mb-4">
        //           Audience Insights
        //         </h3>
        //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        //           <div>
        //             <h4 className="font-semibold mb-2">Demographics</h4>
        //             <ul className="space-y-2">
        //               <li className="flex justify-between">
        //                 <span>Primary Age Group:</span>
        //                 <strong>
        //                   {audienceResponse.data.primaryAgeGroup ||
        //                     "18-35 years"}
        //                 </strong>
        //               </li>
        //               <li className="flex justify-between">
        //                 <span>Gender Split:</span>
        //                 <strong>
        //                   {audienceResponse.data.genderSplit ||
        //                     "60% Female, 40% Male"}
        //                 </strong>
        //               </li>
        //               <li className="flex justify-between">
        //                 <span>Top Location:</span>
        //                 <strong>
        //                   {audienceResponse.data.topLocation ||
        //                     user?.city + ", " + user?.country}
        //                 </strong>
        //               </li>
        //             </ul>
        //           </div>
        //           <div>
        //             <h4 className="font-semibold mb-2">Interests</h4>
        //             <div className="flex flex-wrap gap-2">
        //               {(
        //                 audienceResponse.data.interests || [
        //                   "Tech",
        //                   "Lifestyle",
        //                   "Travel",
        //                 ]
        //               ).map((interest: string, index: number) => (
        //                 <span
        //                   key={index}
        //                   className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        //                 >
        //                   {interest}
        //                 </span>
        //               ))}
        //             </div>
        //           </div>
        //         </div>
        //       </>
        //     );
        //     break;
        //   }

        //   case "experience": {
        //     const portfolioResponse = await axios.get<PortfolioItem[]>(
        //       `https://api.taseer.app/api/users/${id}/portfolio`
        //     );
        //     data = (
        //       <>
        //         <h3 className="text-lg font-semibold mb-4">
        //           Professional Experience
        //         </h3>
        //         {portfolioResponse.data.length > 0 ? (
        //           <div className="space-y-4">
        //             {portfolioResponse.data.map((item: PortfolioItem) => (
        //               <div
        //                 key={item.id}
        //                 className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        //               >
        //                 <div className="flex items-start space-x-4">
        //                   {item.imageUrl && (
        //                     <img
        //                       src={item.imageUrl || "/placeholder.svg"}
        //                       alt={item.name}
        //                       className="w-16 h-16 object-cover rounded-lg"
        //                     />
        //                   )}
        //                   <div className="flex-1">
        //                     <h4 className="font-semibold text-lg">
        //                       {item.name}
        //                     </h4>
        //                     <p className="text-gray-600 mt-1">
        //                       {item.description}
        //                     </p>
        //                     {item.url && (
        //                       <a
        //                         href={item.url}
        //                         target="_blank"
        //                         rel="noopener noreferrer"
        //                         className="text-blue-500 hover:underline mt-2 inline-block"
        //                       >
        //                         View Project →
        //                       </a>
        //                     )}
        //                     <p className="text-sm text-gray-500 mt-2">
        //                       Added{" "}
        //                       {new Date(item.createdAt).toLocaleDateString()}
        //                     </p>
        //                   </div>
        //                 </div>
        //               </div>
        //             ))}
        //           </div>
        //         ) : (
        //           <div className="text-center py-8 text-gray-500">
        //             <p>No portfolio items added yet.</p>
        //           </div>
        //         )}
        //       </>
        //     );
        //     break;
        //   }

          case "reviews": {
            const reviewsResponse = await axios.get<Review[]>(
              `https://api.taseer.app/api/users/${id}/reviews`
            );
            data = (
              <>
                <h3 className="text-lg font-semibold mb-4">Client Reviews</h3>
                {reviewsResponse.data.length > 0 ? (
                  <div className="space-y-4">
                    {reviewsResponse.data.map(
                      (review: Review, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">
                            "{review.comment}"
                          </p>
                          <p className="text-sm text-gray-500">
                            — {review.clientName}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet.</p>
                  </div>
                )}
              </>
            );
            break;
          }

          case "posts": {
            const postsResponse = await axios.get<Post[]>(
              `https://api.taseer.app/api/users/${id}/posts`
            );
            data = (
              <>
                <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                {postsResponse.data.length > 0 ? (
                  <div className="space-y-4">
                    {postsResponse.data.map((post: Post) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <img
                              src={user?.profilePic || "/placeholder.svg"}
                              alt={user?.firstName}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium">
                              {user?.firstName} {user?.lastName}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{post.text}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <span>❤️</span>
                            <span>{post._count?.likes || 0}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>💬</span>
                            <span>{post._count?.comments || 0}</span>
                          </span>
                        
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No posts yet.</p>
                  </div>
                )}
              </>
            );
            break;
          }

          default:
            data = <div>Content not available</div>;
        }

        setTabData((prev: TabData) => ({ ...prev, [tab]: data }));
      } catch (err) {
        console.error(`Error fetching ${tab} data:`, err);
        setTabData((prev: TabData) => ({
          ...prev,
          [tab]: (
            <div className="text-center py-8 text-gray-500">
              <p>Unable to load {tab} data at this time.</p>
            </div>
          ),
        }));
      } finally {
        setTabLoading((prev: TabLoading) => ({ ...prev, [tab]: false }));
      }
    },
    [id, user, tabData, tabLoading]
  );

  useEffect(() => {
    if (user && activeTab) {
      fetchTabData(activeTab);
    }
  }, [activeTab, user, fetchTabData]);

  const tabs = ["Analytics", "Reviews", "Posts"];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!user) return <div className="text-center">User not found</div>;

  return (
    <BrandLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
          <img
            src={
              user.profilePic ||
              "https://randomuser.me/api/portraits/women/12.jpg"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />

          <div className="md:ml-6 flex-1 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
            <p className="text-gray-600 text-sm">
              {user.gender || "Not specified"} • {user.city},{" "}
              {user.country || "USA"}
            </p>

           

            <div className="flex justify-center md:justify-start space-x-4 mt-3 text-gray-700">
              {user.socialHandles?.instagram && (
                <a
                  href={`${user.socialHandles.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram
                    size={20}
                    className="hover:text-pink-500 cursor-pointer"
                  />
                </a>
              )}
              {user.socialHandles?.facebook && (
                <a
                  href={`${user.socialHandles.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook
                    size={20}
                    className="hover:text-blue-600 cursor-pointer"
                  />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 md:ml-auto">
            <button
              onClick={handleMessage}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              <FaEnvelope /> Message
            </button>
            {/* <button
              onClick={handleFollow}
              className="text-blue-500 font-semibold hover:underline"
            >
              Follow
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b pb-2">
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as TabType)}
                className={`capitalize pb-2 transition ${
                  activeTab === tab.toLowerCase()
                    ? "border-b-2 border-black text-black"
                    : "hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-gray-700">
          {tabLoading[activeTab] ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            tabData[activeTab] || (
              <div className="text-center py-8 text-gray-500">
                <p>Loading {activeTab} data...</p>
              </div>
            )
          )}
        </div>
      </div>
    </BrandLayout>
  );
};

export default ProfilePage;
