import { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip, FiSearch, FiArrowLeft } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";
import { useSocket } from "../../hooks/useSocket";
import BrandLayout from "../components/BrandLayout";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  type: string;
  unread?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface Message {
  id: string;
  content: string;
  from: "me" | "them";
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePic: string;
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePic: string;
  };
  seen: boolean;
  delivered: boolean;
  createdAt: string;
}

const emojiGroups = [
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

export default function BrandsMessagesPage() {
  const [conversations, setConversations] = useState<User[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [newChatUser, setNewChatUser] = useState<User | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [fetchingNewUser, setFetchingNewUser] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get token from localStorage or your auth context
  const token = Cookies.get("jwt");

  // Initialize socket
  const {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    markConversationSeen,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
  } = useSocket(token ?? "");

  const selectedUser =
    selectedUserIndex !== null ? conversations[selectedUserIndex] : newChatUser;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load user for new chat
  const loadNewChatUser = async (userId: string) => {
    setFetchingNewUser(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //@ts-expect-error -network
      if (response.data.success) {
        //@ts-expect-error -network
        const userData = response.data.user;
        setNewChatUser(userData);
        //@ts-expect-error -network
        if (response.data.hasExistingChat) {
          // If chat exists, load conversations and select this user
          await loadConversations();
          const existingConvIndex = conversations.findIndex(
            (conv) => conv.id === userId
          );
          if (existingConvIndex !== -1) {
            setSelectedUserIndex(existingConvIndex);
            setIsNewChat(false);
            setNewChatUser(null);
          }
        } else {
          // New chat
          setIsNewChat(true);
          setSelectedUserIndex(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error loading new chat user:", error);
      // If user not found or error, redirect to messages without params
      navigate("/brand/message", { replace: true });
    } finally {
      setFetchingNewUser(false);
    }
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/messages/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //@ts-expect-error -network
      if (response.data.success) {
        //@ts-expect-error -network
        setConversations(response.data.conversations);
        //@ts-expect-error -network
        return response.data.conversations;
      }
    } catch (error) { 
      console.error("Error loading conversations:", error);
    }
  };

  // Load messages for selected conversation
  const loadMessages = async (partnerId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/conversation/${partnerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //@ts-expect-error -network
      if (response.data.success) {
        //@ts-expect-error -network
        setMessages(response.data.messages);
        scrollToBottom();

        // Mark conversation as seen
        if (socket) {
          markConversationSeen(partnerId);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Handle URL parameters on component mount
  useEffect(() => {
    const userId = searchParams.get("id");

    if (userId && token) {
      loadNewChatUser(userId);
    } else if (token) {
      loadConversations().then(() => setLoading(false));
    }
  }, [searchParams, token]);

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const newMessage = event.detail;

      // Add to messages if it's for current conversation
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser.id ||
          newMessage.receiverId === selectedUser.id)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            from: newMessage.senderId === selectedUser.id ? "them" : "me",
          },
        ]);
        scrollToBottom();

        // Mark as seen if conversation is active
        if (newMessage.senderId === selectedUser.id) {
          markConversationSeen(selectedUser.id);
        }
      }

      // Update conversations list
      loadConversations();
    };

    const handleMessageSent = (event: CustomEvent) => {
      const sentMessage = event.detail;

      // Add to messages if it's for current conversation
      if (selectedUser && sentMessage.receiverId === selectedUser.id) {
        setMessages((prev) => [
          ...prev,
          {
            ...sentMessage,
            from: "me",
          },
        ]);
        scrollToBottom();

        // If this was a new chat, convert it to existing chat
        if (isNewChat) {
          setIsNewChat(false);
          loadConversations().then((convs) => {
            const newConvIndex = convs.findIndex(
              (conv: User) => conv.id === selectedUser.id
            );
            if (newConvIndex !== -1) {
              setSelectedUserIndex(newConvIndex);
              setNewChatUser(null);
            }
          });
        }
      }

      setSending(false);
      loadConversations();
    };

    const handleMessageError = (event: CustomEvent) => {
      console.error("Message error:", event.detail.error);
      setSending(false);
    };

    const handleUserTyping = (event: CustomEvent) => {
      const { userId } = event.detail;
      setTypingUsers((prev) => new Set([...prev, userId]));
    };

    const handleUserStoppedTyping = (event: CustomEvent) => {
      const { userId } = event.detail;
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    };

    // Add event listeners
    window.addEventListener("new_message", handleNewMessage as EventListener);
    window.addEventListener("message_sent", handleMessageSent as EventListener);
    window.addEventListener(
      "message_error",
      handleMessageError as EventListener
    );
    window.addEventListener("user_typing", handleUserTyping as EventListener);
    window.addEventListener(
      "user_stopped_typing",
      handleUserStoppedTyping as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "new_message",
        handleNewMessage as EventListener
      );
      window.removeEventListener(
        "message_sent",
        handleMessageSent as EventListener
      );
      window.removeEventListener(
        "message_error",
        handleMessageError as EventListener
      );
      window.removeEventListener(
        "user_typing",
        handleUserTyping as EventListener
      );
      window.removeEventListener(
        "user_stopped_typing",
        handleUserStoppedTyping as EventListener
      );
    };
  }, [selectedUser, socket, markConversationSeen, isNewChat]);

  // Load messages when selected user changes
  useEffect(() => {
    if (selectedUser && !isNewChat) {
      loadMessages(selectedUser.id);
      joinConversation(selectedUser.id);

      return () => {
        leaveConversation(selectedUser.id);
      };
    }
  }, [selectedUser, joinConversation, leaveConversation, isNewChat]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set loading to false when conversations are loaded or new chat user is loaded
  useEffect(() => {
    if (conversations.length > 0 || newChatUser || !searchParams.get("id")) {
      setLoading(false);
    }
  }, [conversations, newChatUser, searchParams]);

  const handleSend = () => {
    if (message.trim() && selectedUser && !sending) {
      setSending(true);
      sendMessage(selectedUser.id, message.trim());
      setMessage("");

      // Stop typing
      stopTyping(selectedUser.id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);

    // Handle typing indicators
    if (selectedUser && value.trim()) {
      startTyping(selectedUser.id);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedUser.id);
      }, 2000);
    } else if (selectedUser) {
      stopTyping(selectedUser.id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachment = (type: string) => {
    console.log(`Attachment of type ${type} selected`);
    setShowAttachments(false);
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((user) => user.userId === userId);
  };

  const handleSelectConversation = (index: number) => {
    setSelectedUserIndex(index);
    setIsNewChat(false);
    setNewChatUser(null);
    // Clear URL params
    navigate("/brand/message", { replace: true });
  };

  const handleBackToConversations = () => {
    setSelectedUserIndex(null);
    setIsNewChat(false);
    setNewChatUser(null);
    navigate("/brand/message", { replace: true });
  };

  const filteredConversations = conversations.filter((user) => {
    if (filter === "Unread" && !user.unread) return false;
    if (filter === "Archived" && !user.unread) return false; // Assuming archived logic

    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  if (loading || fetchingNewUser) {
    return (
      <BrandLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </BrandLayout>
    );
  }

  if (!conversations.length && !newChatUser) {
    return (
      <BrandLayout>
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p>Start messaging with creators and brands!</p>
          </div>
        </div>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout>
      <div className="flex h-[95vh] -m-4 text-gray-800">
        {/* Connection Status */}
        <div
          className={clsx(
            "fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium",
            isConnected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>

        {/* Sidebar */}
        <div
          className={clsx(
            "border-r overflow-y-auto bg-white flex flex-col transition-all duration-300",
            selectedUser ? "w-0 md:w-[25%]" : "w-full md:w-[25%]"
          )}
        >
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
            {filteredConversations.map((user, index) => (
              <div
                key={user.id}
                onClick={() => handleSelectConversation(index)}
                className={clsx(
                  "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 relative",
                  selectedUserIndex === index && "bg-gray-200"
                )}
              >
                <div className="relative">
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${user.username}`);
                    }}
                  />
                  {isUserOnline(user.id) && (
                    <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
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
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {user.unreadCount || 1}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        {selectedUser ? (
          <div
            className={clsx(
              "flex-1 flex flex-col transition-all duration-300",
              selectedUser ? "w-full md:w-[75%]" : "w-0"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-4 bg-white">
              <button
                onClick={handleBackToConversations}
                className="md:hidden text-gray-600 hover:text-gray-800"
              >
                <FiArrowLeft size={20} />
              </button>
              <div className="relative">
                <img
                  src={selectedUser.profilePic}
                  className="w-12 h-12 rounded-full"
                  alt={selectedUser.name}
                />
                {isUserOnline(selectedUser.id) && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">
                  @{selectedUser.username} •{" "}
                  {isUserOnline(selectedUser.id) ? "Online" : "Offline"}
                  {isNewChat && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      New Chat
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {isNewChat && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Start a conversation with {selectedUser.name}
                    </h3>
                    <p>Send your first message below!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={msg.id || i}
                    className={clsx(
                      "max-w-[75%] p-3 rounded-lg relative",
                      msg.from === "me"
                        ? "bg-blue-100 text-right ml-auto"
                        : "bg-gray-100 text-left mr-auto"
                    )}
                  >
                    <div>{msg.content}</div>
                    {msg.from === "me" && (
                      <div className="text-xs text-gray-500 mt-1">
                        {msg.delivered && "✓"} {msg.seen && "✓"}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Typing indicator */}
              {typingUsers.has(selectedUser.id) && (
                <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 text-left mr-auto">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
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
                    {[
                      "Image",
                      "Video",
                      "Document",
                      "Audio",
                      "Poll",
                      "Contact",
                    ].map((type) => (
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
                  onChange={(e) => handleInputChange(e.target.value)}
                 
                  className="flex-1 border rounded-full px-4 py-2 outline-none"
                  placeholder={
                    isNewChat
                      ? `Send your first message to ${selectedUser.name}...`
                      : "Type a message..."
                  }
                //   disabled={sending || !isConnected}
                />
                <button
                  onClick={handleSend}
                //   disabled={sending || !isConnected || !message.trim()}
                  className={clsx(
                    "px-4 py-2 rounded-full transition-colors",
                    // sending || !isConnected || !message.trim()
                    //   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    //   : "bg-blue-500 text-white hover:bg-blue-600"
                  )}
                >
                  {sending ? "..." : <FiSend />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Select a conversation to start messaging
              </h3>
              <p>Choose a conversation from the sidebar to view messages</p>
            </div>
          </div>
        )}
      </div>
    </BrandLayout>
  );
}
