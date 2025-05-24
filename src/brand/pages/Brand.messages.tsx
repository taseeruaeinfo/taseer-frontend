import { useState } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSearch,
  FiChevronDown,
  FiX,
  FiMail,
  FiPhone,
  FiHome,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import BrandLayout from "../components/BrandLayout";

interface Message {
  from: "me" | "them";
  text: string;
}

interface ContactInfo {
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface ChatUser {
  name: string;
  username: string;
  profile: string;
  unread: boolean;
  archived: boolean;
  stage: StageType;
  isPremium: boolean;
  contactInfo: ContactInfo;
  messages: Message[];
}

type StageType =
  | "Requested"
  | "Negotiation"
  | "Content in Progress"
  | "Approved for Posting"
  | "Live"
  | "Analytics Submitted"
  | "Payment Pending"
  | "Cancelled / Dropped";

interface EmojiGroup {
  category: string;
  emojis: string[];
}

interface ContractDetails {
  deliverables: string;
  platform: string;
  contentFormat: string;
  deadline: string;
  postingDate: string;
  budget: string;
  paymentSplit: string;
  paymentMode: string;
}

const chatUsers: ChatUser[] = [
  {
    name: "Mohan Bishnoi",
    username: "mohanbishnoi502",
    profile: "https://randomuser.me/api/portraits/men/75.jpg",
    unread: false,
    archived: false,
    stage: "Requested",
    isPremium: true,
    contactInfo: {
      email: "mohan@creator.com",
      phone: "+91 98765 43210",
      address: "123 Creator Lane, Mumbai, India",
    },
    messages: [
      { from: "them", text: "Hey, I loved your latest video on monetization!" },
      { from: "me", text: "Thanks! Working on a course next 🧠" },
      { from: "them", text: "That's awesome! Let me know if you collab." },
    ],
  },
  {
    name: "Ritika Sharma",
    username: "ritikasharma",
    profile: "https://randomuser.me/api/portraits/women/44.jpg",
    unread: true,
    archived: false,
    stage: "Negotiation",
    isPremium: false,
    contactInfo: {
      email: null,
      phone: null,
      address: null,
    },
    messages: [
      { from: "them", text: "Your Instagram tips reel blew up!" },
      { from: "me", text: "Haha yeah, 20k views in 24h 😍" },
    ],
  },
  {
    name: "Amit Kumar",
    username: "amitkumar",
    profile: "https://randomuser.me/api/portraits/men/32.jpg",
    unread: false,
    archived: true,
    stage: "Content in Progress",
    isPremium: false,
    contactInfo: {
      email: "amit@example.com",
      phone: null,
      address: null,
    },
    messages: [
      { from: "them", text: "When is your next live session?" },
      { from: "me", text: "Planning for next Friday at 7PM!" },
    ],
  },
];

// Emoji picker data
const emojiGroups: EmojiGroup[] = [
  {
    category: "Smileys",
    emojis: ["😀", "😁", "😂", "🤣", "😊", "😇", "🙂", "😉"],
  },
  {
    category: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "👏", "🙌", "🤝"],
  },
  {
    category: "Objects",
    emojis: ["💻", "📱", "🎥", "📸", "🔍", "📊", "📈", "💡"],
  },
];

const stageOptions: StageType[] = [
  "Requested",
  "Negotiation",
  "Content in Progress",
  "Approved for Posting",
  "Live",
  "Analytics Submitted",
  "Payment Pending",
  "Cancelled / Dropped",
];

type InfoType = "Email" | "Phone Number" | "Shipping Address";
type AttachmentType =
  | "Image"
  | "Video"
  | "Document"
  | "Audio"
  | "Poll"
  | "Contact";

export default function BrandsMessagesPage() {
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showAttachments, setShowAttachments] = useState<boolean>(false);
  const [showRequestDropdown, setShowRequestDropdown] =
    useState<boolean>(false);
  const [showContractForm, setShowContractForm] = useState<boolean>(false);
  const [showStageDropdown, setShowStageDropdown] = useState<boolean>(false);
  const [contractDetails, setContractDetails] = useState<ContractDetails>({
    deliverables: "",
    platform: "",
    contentFormat: "",
    deadline: "",
    postingDate: "",
    budget: "",
    paymentSplit: "",
    paymentMode: "",
  });
  const navigate = useNavigate();

  const selectedUser = chatUsers[selectedUserIndex];

  const handleSend = () => {
    if (message.trim()) {
      chatUsers[selectedUserIndex].messages.push({ from: "me", text: message });
      setMessage("");
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachment = (type: AttachmentType) => {
    // This would trigger the file input in a real application
    console.log(`Attachment of type ${type} selected`);
    setShowAttachments(false);
  };

  const handleRequestInfo = (infoType: InfoType) => {
    if (selectedUser.isPremium) {
      // For premium users, show info directly
      console.log(`Showing ${infoType} info directly for premium creator`);
    } else {
      // For non-premium, send request
      console.log(`Sending request for ${infoType} to creator`);
      chatUsers[selectedUserIndex].messages.push({
        from: "me",
        text: `I've requested your ${infoType.toLowerCase()}. Please approve to share.`,
      });
    }
    setShowRequestDropdown(false);
  };

  const handleStageChange = (stage: StageType) => {
    chatUsers[selectedUserIndex].stage = stage;
    setShowStageDropdown(false);
    // Notify about stage change
    chatUsers[selectedUserIndex].messages.push({
      from: "me",
      text: `I've updated the collaboration stage to: ${stage}`,
    });
  };

  const handleSendContract = () => {
    // Check if all required fields are filled
    const requiredFields = [
      "deliverables",
      "platform",
      "contentFormat",
      "deadline",
      "budget",
    ] as const;
    const missingFields = requiredFields.filter(
      (field) => !contractDetails[field]
    );

    if (missingFields.length === 0) {
      // Send contract
      chatUsers[selectedUserIndex].messages.push({
        from: "me",
        text: `I've sent a contract to your email. Details: ${contractDetails.deliverables} on ${contractDetails.platform}, Budget: ${contractDetails.budget}, Deadline: ${contractDetails.deadline}`,
      });
      setShowContractForm(false);
      // Reset form
      setContractDetails({
        deliverables: "",
        platform: "",
        contentFormat: "",
        deadline: "",
        postingDate: "",
        budget: "",
        paymentSplit: "",
        paymentMode: "",
      });
    } else {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
    }
  };

  const filteredUsers = chatUsers.filter((user) => {
    // Apply filter (All, Unread, Archived)
    if (filter === "Unread" && !user.unread) return false;
    if (filter === "Archived" && !user.archived) return false;

    // Apply search if active
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const getStageColor = (stage: StageType): string => {
    switch (stage) {
      case "Requested":
        return "bg-gray-200 text-gray-800";
      case "Negotiation":
        return "bg-blue-100 text-blue-800";
      case "Content in Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Approved for Posting":
        return "bg-green-100 text-green-800";
      case "Live":
        return "bg-purple-100 text-purple-800";
      case "Analytics Submitted":
        return "bg-indigo-100 text-indigo-800";
      case "Payment Pending":
        return "bg-orange-100 text-orange-800";
      case "Cancelled / Dropped":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <BrandLayout>
        <div className="flex h-[95vh] -m-4 text-gray-800">
          {/* Sidebar */}
          <div className="w-[25%] border-r overflow-y-auto bg-white flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">Messages</h2>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FiSearch size={20} />
                </button>
              </div>

              {showSearch && (
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full p-2 border rounded-lg mb-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}

              <div className="flex space-x-2 text-sm">
                {["All", "Unread", "Archived"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={clsx(
                      "px-3 py-1 rounded-full",
                      filter === option
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.username}
                  onClick={() => {
                    setSelectedUserIndex(chatUsers.indexOf(user));
                    if (user.unread) user.unread = false;
                  }}
                  className={clsx(
                    "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 relative",
                    selectedUser.username === user.username && "bg-gray-200"
                  )}
                >
                  <img
                    src={user.profile}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${user.username}`);
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profile/${user.username}`);
                        }}
                        className="font-medium hover:underline"
                      >
                        {user.name}
                      </h4>
                      {user.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(
                          user.stage
                        )}`}
                      >
                        {user.stage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Box */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.profile}
                    className="w-12 h-12 rounded-full"
                    alt={selectedUser.name}
                  />
                  <div>
                    <h3 className="font-semibold">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>

                {/* Action boxes */}
                <div className="flex space-x-2">
                  {/* Request Box */}
                  <div className="relative">
                    <button
                      className="border rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      onClick={() => {
                        setShowRequestDropdown(!showRequestDropdown);
                        setShowStageDropdown(false);
                      }}
                    >
                      Request (1) <FiChevronDown className="inline ml-1" />
                    </button>

                    {showRequestDropdown && (
                      <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg w-48 z-10">
                        <ul>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handleRequestInfo("Email")}
                          >
                            <FiMail className="mr-2" /> Email
                            {selectedUser.isPremium &&
                              selectedUser.contactInfo.email && (
                                <FiCheckCircle className="ml-auto text-green-500" />
                              )}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handleRequestInfo("Phone Number")}
                          >
                            <FiPhone className="mr-2" /> Phone Number
                            {selectedUser.isPremium &&
                              selectedUser.contactInfo.phone && (
                                <FiCheckCircle className="ml-auto text-green-500" />
                              )}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() =>
                              handleRequestInfo("Shipping Address")
                            }
                          >
                            <FiHome className="mr-2" /> Shipping Address
                            {selectedUser.isPremium &&
                              selectedUser.contactInfo.address && (
                                <FiCheckCircle className="ml-auto text-green-500" />
                              )}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Contract Box */}
                  <button
                    className="border rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    onClick={() => {
                      setShowContractForm(!showContractForm);
                      setShowRequestDropdown(false);
                      setShowStageDropdown(false);
                    }}
                  >
                    Contract (2)
                  </button>

                  {/* Stage Box */}
                  <div className="relative">
                    <button
                      className="border rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50"
                      onClick={() => {
                        setShowStageDropdown(!showStageDropdown);
                        setShowRequestDropdown(false);
                      }}
                    >
                      Stage (3) <FiChevronDown className="inline ml-1" />
                    </button>

                    {showStageDropdown && (
                      <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg w-56 z-10">
                        <ul>
                          {stageOptions.map((stage) => (
                            <li
                              key={stage}
                              className={clsx(
                                "px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center",
                                selectedUser.stage === stage &&
                                  "font-medium bg-gray-50"
                              )}
                              onClick={() => handleStageChange(stage)}
                            >
                              {stage}
                              {selectedUser.stage === stage && (
                                <FiCheckCircle className="ml-auto text-green-500" />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Form */}
            {showContractForm && (
              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Create Contract</h3>
                  <button onClick={() => setShowContractForm(false)}>
                    <FiX />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deliverables *
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={contractDetails.deliverables}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          deliverables: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform *
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={contractDetails.platform}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          platform: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Platform</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Twitter/X">Twitter/X</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content Format *
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={contractDetails.contentFormat}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          contentFormat: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Format</option>
                      <option value="Post">Post</option>
                      <option value="Story">Story</option>
                      <option value="Reel">Reel</option>
                      <option value="Video">Video</option>
                      <option value="Live">Live</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={contractDetails.deadline}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posting Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={contractDetails.postingDate}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          postingDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget *
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={contractDetails.budget}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          budget: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Split
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={contractDetails.paymentSplit}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          paymentSplit: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Split</option>
                      <option value="50% upfront, 50% on completion">
                        50% upfront, 50% on completion
                      </option>
                      <option value="100% on completion">
                        100% on completion
                      </option>
                      <option value="100% upfront">100% upfront</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Mode
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={contractDetails.paymentMode}
                      onChange={(e) =>
                        setContractDetails({
                          ...contractDetails,
                          paymentMode: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Mode</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Platform Wallet">Platform Wallet</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleSendContract}
                  >
                    Send Contract <FiFileText className="inline ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Show Contact Info for Premium Users */}
            {selectedUser.isPremium && (
              <div className="bg-gray-50 p-3 border-b">
                <div className="flex flex-wrap gap-3">
                  {selectedUser.contactInfo.email && (
                    <div className="flex items-center text-sm bg-white p-2 rounded border">
                      <FiMail className="mr-2 text-blue-500" />
                      <span>{selectedUser.contactInfo.email}</span>
                    </div>
                  )}
                  {selectedUser.contactInfo.phone && (
                    <div className="flex items-center text-sm bg-white p-2 rounded border">
                      <FiPhone className="mr-2 text-green-500" />
                      <span>{selectedUser.contactInfo.phone}</span>
                    </div>
                  )}
                  {selectedUser.contactInfo.address && (
                    <div className="flex items-center text-sm bg-white p-2 rounded border">
                      <FiHome className="mr-2 text-purple-500" />
                      <span>{selectedUser.contactInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {selectedUser.messages.map((msg, i) => (
                <div
                  key={i}
                  className={clsx(
                    "max-w-[75%] p-3 rounded-lg",
                    msg.from === "me"
                      ? "bg-blue-100 text-right ml-auto"
                      : "bg-gray-100 text-left mr-auto"
                  )}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t bg-white flex flex-col">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="bg-white border rounded-lg shadow-lg p-2 mb-2">
                  <div className="flex flex-wrap gap-2">
                    {emojiGroups.map((group) => (
                      <div key={group.category} className="w-full">
                        <div className="text-xs text-gray-500 mb-1">
                          {group.category}
                        </div>
                        <div className="flex flex-wrap">
                          {group.emojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiClick(emoji)}
                              className="text-xl p-1 hover:bg-gray-100 rounded"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachment Picker */}
              {showAttachments && (
                <div className="bg-white border rounded-lg shadow-lg p-2 mb-2">
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        "Image",
                        "Video",
                        "Document",
                        "Audio",
                        "Poll",
                        "Contact",
                      ] as AttachmentType[]
                    ).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleAttachment(type)}
                        className="p-2 hover:bg-gray-100 rounded text-center"
                      >
                        <div className="text-sm">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  className="text-gray-600 text-xl hover:text-blue-500"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachments(false);
                  }}
                >
                  <BsEmojiSmile />
                </button>
                <button
                  className="text-gray-600 text-xl hover:text-blue-500"
                  onClick={() => {
                    setShowAttachments(!showAttachments);
                    setShowEmojiPicker(false);
                  }}
                >
                  <FiPaperclip />
                </button>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 border rounded-full px-4 py-2 outline-none"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      </BrandLayout>
    </>
  );
}
