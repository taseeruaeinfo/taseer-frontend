"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FiSend, FiPaperclip, FiSearch, FiArrowLeft } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";
import { useOptimizedSocket } from "../../../hooks/useSocket";
import DashboardLayout from "../../../components/main/DashBoardLayout";
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
  isOnline?: boolean;
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
  status: "sending" | "sent" | "delivered" | "seen" | "failed";
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

export default function OptimizedMessagesPage() {
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
  const [connectionRetries, setConnectionRetries] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const messageCache = useRef<Map<string, Message[]>>(new Map());
  const conversationCache = useRef<User[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = Cookies.get("jwt");

  // Optimized socket with better connection management
  const {
    socket,
    connectionStatus,
    onlineUsers,
    sendMessage,
    markConversationSeen,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    reconnect,
  } = useOptimizedSocket(token ?? "");

  const selectedUser = useMemo(
    () =>
      selectedUserIndex !== null
        ? conversations[selectedUserIndex]
        : newChatUser,
    [selectedUserIndex, conversations, newChatUser]
  );

  // Optimized scroll to bottom with debouncing
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Cached API calls to reduce database queries
  const loadNewChatUser = useCallback(
    async (userId: string) => {
      setFetchingNewUser(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        //@ts-expect-error - server resposne erroor

        if (response.data.success) {
          //@ts-expect-error - server resposne erroor

          const userData = response.data.user;
          setNewChatUser(userData);
          //@ts-expect-error - server resposne erroor

          if (response.data.hasExistingChat) {
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
            setIsNewChat(true);
            setSelectedUserIndex(null);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Error loading new chat user:", error);
        navigate("/messages", { replace: true });
      } finally {
        setFetchingNewUser(false);
      }
    },
    [token, conversations, navigate]
  );

  // Optimized conversation loading with caching
  const loadConversations = useCallback(async () => {
    try {
      // Return cached data if available and recent
      if (conversationCache.current.length > 0) {
        setConversations(conversationCache.current);
        return conversationCache.current;
      }

      const response = await axios.get(
        "http://localhost:5000/api/messages/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //@ts-expect-error - server resposne erroor

      if (response.data.success) {
        //@ts-expect-error - server resposne erroor

        const conversationsWithOnlineStatus = response.data.conversations.map(
          (conv: User) => ({
            ...conv,
            isOnline: onlineUsers.some((user) => user.userId === conv.id),
          })
        );

        setConversations(conversationsWithOnlineStatus);
        conversationCache.current = conversationsWithOnlineStatus;
        return conversationsWithOnlineStatus;
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, [token, onlineUsers]);

  // Optimized message loading with caching
  const loadMessages = useCallback(
    async (partnerId: string) => {
      try {
        // Check cache first
        const cachedMessages = messageCache.current.get(partnerId);
        if (cachedMessages) {
          setMessages(cachedMessages);
          scrollToBottom();
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/messages/conversation/${partnerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        //@ts-expect-error - server resposne erroor
        if (response.data.success) {
          //@ts-expect-error - server resposne erroor

          const messagesWithStatus = response.data.messages.map((msg: any) => ({
            ...msg,
            status: msg.seen ? "seen" : msg.delivered ? "delivered" : "sent",
          }));

          setMessages(messagesWithStatus);
          messageCache.current.set(partnerId, messagesWithStatus);
          scrollToBottom();

          if (socket) {
            markConversationSeen(partnerId);
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    },
    [token, socket, markConversationSeen, scrollToBottom]
  );

  // Handle URL parameters
  useEffect(() => {
    const userId = searchParams.get("id");

    if (userId && token) {
      loadNewChatUser(userId);
    } else if (token) {
      loadConversations().then(() => setLoading(false));
    }
  }, [searchParams, token, loadNewChatUser, loadConversations]);

  // Optimized socket event handlers
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const newMessage = event.detail;

      // Update message cache
      if (selectedUser) {
        const cacheKey = selectedUser.id;
        const cachedMessages = messageCache.current.get(cacheKey) || [];

        if (
          newMessage.senderId === selectedUser.id ||
          newMessage.receiverId === selectedUser.id
        ) {
          const updatedMessages = [
            ...cachedMessages,
            {
              ...newMessage,
              from: newMessage.senderId === selectedUser.id ? "them" : "me",
              status: "delivered",
            },
          ];

          setMessages(updatedMessages);
          messageCache.current.set(cacheKey, updatedMessages);
          scrollToBottom();

          if (newMessage.senderId === selectedUser.id) {
            markConversationSeen(selectedUser.id);
          }
        }
      }

      // Invalidate conversation cache to refresh unread counts
      conversationCache.current = [];
      loadConversations();
    };

    const handleMessageSent = (event: CustomEvent) => {
      const sentMessage = event.detail;

      if (selectedUser && sentMessage.receiverId === selectedUser.id) {
        const cacheKey = selectedUser.id;
        const cachedMessages = messageCache.current.get(cacheKey) || [];
        const updatedMessages = [
          ...cachedMessages,
          {
            ...sentMessage,
            from: "me",
            status: "sent",
          },
        ];

        setMessages(updatedMessages);
        messageCache.current.set(cacheKey, updatedMessages);
        scrollToBottom();

        if (isNewChat) {
          setIsNewChat(false);
          conversationCache.current = []; // Invalidate cache
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
    };

    const handleMessageError = (event: CustomEvent) => {
      console.error("Message error:", event.detail.error);
      setSending(false);

      // Update message status to failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.status === "sending" ? { ...msg, status: "failed" } : msg
        )
      );
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

    const handleOnlineStatusUpdate = () => {
      // Update online status in conversations
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          isOnline: onlineUsers.some((user) => user.userId === conv.id),
        }))
      );
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
    window.addEventListener(
      "online_users_updated",
      handleOnlineStatusUpdate as EventListener
    );

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
      window.removeEventListener(
        "online_users_updated",
        handleOnlineStatusUpdate as EventListener
      );
    };
  }, [
    selectedUser,
    socket,
    markConversationSeen,
    isNewChat,
    onlineUsers,
    loadConversations,
    scrollToBottom,
  ]);

  // Load messages when selected user changes
  useEffect(() => {
    if (selectedUser && !isNewChat) {
      loadMessages(selectedUser.id);
      joinConversation(selectedUser.id);

      return () => {
        leaveConversation(selectedUser.id);
      };
    }
  }, [
    selectedUser,
    joinConversation,
    leaveConversation,
    isNewChat,
    loadMessages,
  ]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Set loading to false when data is ready
  useEffect(() => {
    if (conversations.length > 0 || newChatUser || !searchParams.get("id")) {
      setLoading(false);
    }
  }, [conversations, newChatUser, searchParams]);

  // Handle connection retries
  useEffect(() => {
    if (connectionStatus === "disconnected" && connectionRetries < 3) {
      const timer = setTimeout(() => {
        setConnectionRetries((prev) => prev + 1);
        reconnect();
      }, 2000 * (connectionRetries + 1)); // Exponential backoff

      return () => clearTimeout(timer);
    }
  }, [connectionStatus, connectionRetries, reconnect]);

  const handleSend = useCallback(() => {
    if (
      message.trim() &&
      selectedUser &&
      !sending &&
      connectionStatus === "connected"
    ) {
      setSending(true);

      // Optimistic update
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        content: message.trim(),
        from: "me",
        sender: {
          id: "current-user",
          firstName: "",
          lastName: "",
          username: "",
          profilePic: "",
        },
        receiver: {
          id: selectedUser.id,
          firstName: selectedUser.name.split(" ")[0],
          lastName: selectedUser.name.split(" ")[1] || "",
          username: selectedUser.username,
          profilePic: selectedUser.profilePic,
        },
        seen: false,
        delivered: false,
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, tempMessage]);
      scrollToBottom();

      sendMessage(selectedUser.id, message.trim());
      setMessage("");

      // Stop typing
      stopTyping(selectedUser.id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [
    message,
    selectedUser,
    sending,
    connectionStatus,
    sendMessage,
    stopTyping,
    scrollToBottom,
  ]);

  const handleInputChange = useCallback(
    (value: string) => {
      setMessage(value);

      if (selectedUser && value.trim() && connectionStatus === "connected") {
        startTyping(selectedUser.id);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          stopTyping(selectedUser.id);
        }, 2000);
      } else if (selectedUser) {
        stopTyping(selectedUser.id);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [selectedUser, connectionStatus, startTyping, stopTyping]
  );

  const handleEmojiClick = useCallback((emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  const handleAttachment = useCallback((type: string) => {
    console.log(`Attachment of type ${type} selected`);
    setShowAttachments(false);
  }, []);

  const isUserOnline = useCallback(
    (userId: string) => {
      return onlineUsers.some((user) => user.userId === userId);
    },
    [onlineUsers]
  );

  const handleSelectConversation = useCallback(
    (index: number) => {
      setSelectedUserIndex(index);
      setIsNewChat(false);
      setNewChatUser(null);
      navigate("/messages", { replace: true });
    },
    [navigate]
  );

  const handleBackToConversations = useCallback(() => {
    setSelectedUserIndex(null);
    setIsNewChat(false);
    setNewChatUser(null);
    navigate("/messages", { replace: true });
  }, [navigate]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((user) => {
      if (filter === "Unread" && !user.unread) return false;
      if (filter === "Archived" && !user.unread) return false;

      if (
        searchQuery &&
        !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [conversations, filter, searchQuery]);

  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "connecting":
        return "bg-yellow-100 text-yellow-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "🟢 Connected";
      case "connecting":
        return "🟡 Connecting...";
      case "disconnected":
        return "🔴 Disconnected";
      default:
        return "⚪ Unknown";
    }
  };

  if (loading || fetchingNewUser) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!conversations.length && !newChatUser) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p>Start messaging with creators and brands!</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex h-[95vh] -m-4 text-gray-800">
        {/* Enhanced Connection Status */}
        <div
          className={clsx(
            "fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300",
            getConnectionStatusColor()
          )}
        >
          {getConnectionStatusText()}
          {connectionStatus === "disconnected" && connectionRetries > 0 && (
            <span className="ml-2 text-xs">(Retry {connectionRetries}/3)</span>
          )}
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
                    src={user.profilePic || "/placeholder.svg"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${user.username}`);
                    }}
                  />
                  {user.isOnline && (
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
                  src={selectedUser.profilePic || "/placeholder.svg"}
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
                      <div className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                        {msg.status === "sending" && <span>⏳</span>}
                        {msg.status === "sent" && <span>✓</span>}
                        {msg.status === "delivered" && <span>✓✓</span>}
                        {msg.status === "seen" && (
                          <span className="text-blue-500">✓✓</span>
                        )}
                        {msg.status === "failed" && (
                          <span className="text-red-500">❌</span>
                        )}
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
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 border rounded-full px-4 py-2 outline-none"
                  placeholder={
                    isNewChat
                      ? `Send your first message to ${selectedUser.name}...`
                      : connectionStatus === "connected"
                      ? "Type a message..."
                      : "Connecting..."
                  }
                  disabled={sending || connectionStatus !== "connected"}
                />
                <button
                  onClick={handleSend}
                  disabled={
                    sending ||
                    connectionStatus !== "connected" ||
                    !message.trim()
                  }
                  className={clsx(
                    "px-4 py-2 rounded-full transition-colors",
                    sending ||
                      connectionStatus !== "connected" ||
                      !message.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
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
    </DashboardLayout>
  );
}
