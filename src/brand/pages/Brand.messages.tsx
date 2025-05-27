"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";
import { useSocket } from "../../hooks/useSocket";
import Cookies from "js-cookie";
import BrandLayout from "../components/BrandLayout";

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
  sender: any;
  receiver: any;
  seen: boolean;
  delivered: boolean;
  createdAt: string;
  status: "sending" | "sent" | "delivered" | "seen" | "failed";
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<User[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [newChatUser, setNewChatUser] = useState<User | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const currentConversationRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = Cookies.get("jwt");

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
  } = useSocket(token ?? "");

  const selectedUser = useMemo(
    () =>
      selectedUserIndex !== null
        ? conversations[selectedUserIndex]
        : newChatUser,
    [selectedUserIndex, conversations, newChatUser]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Stable function references
  const loadConversations = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/messages/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //@ts-expect-error - network
      if (response.data.success) {
        //@ts-expect-error - network

        const conversationsWithOnlineStatus = response.data.conversations.map(
          (conv: User) => ({
            ...conv,
            isOnline: onlineUsers.some((user) => user.userId === conv.id),
          })
        );

        setConversations(conversationsWithOnlineStatus);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, [token, onlineUsers]);

  const loadMessages = useCallback(
    async (partnerId: string) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/conversation/${partnerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        //@ts-expect-error - network

        if (response.data.success) {
          //@ts-expect-error - network

          const messagesWithStatus = response.data.messages.map((msg: any) => ({
            ...msg,
            status: msg.seen ? "seen" : msg.delivered ? "delivered" : "sent",
          }));

          setMessages(messagesWithStatus);
          setTimeout(scrollToBottom, 100);

          if (socket && connectionStatus === "connected") {
            markConversationSeen(partnerId);
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    },
    [token, socket, connectionStatus, markConversationSeen, scrollToBottom]
  );

  const loadNewChatUser = useCallback(
    async (userId: string) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        //@ts-expect-error - network

        if (response.data.success) {
          //@ts-expect-error - network

          const userData = response.data.user;
          setNewChatUser(userData);
          //@ts-expect-error - network

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
         navigate("/brand/messages", { replace: true });
      }
    },
    [token, conversations, navigate, loadConversations]
  );

  // Handle URL parameters - only run once when component mounts or URL changes
  useEffect(() => {
    const userId = searchParams.get("id");
    if (userId && token) {
      loadNewChatUser(userId);
    } else if (token) {
      loadConversations().then(() => setLoading(false));
    }
  }, [searchParams.get("id"), token]); // Only depend on the actual URL parameter

  // Socket event handlers - stable references
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const newMessage = event.detail;

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
            status: "delivered",
          },
        ]);
        setTimeout(scrollToBottom, 100);

        if (
          newMessage.senderId === selectedUser.id &&
          socket &&
          connectionStatus === "connected"
        ) {
          markConversationSeen(selectedUser.id);
        }
      }

      loadConversations();
    };

    const handleMessageSent = (event: CustomEvent) => {
      const sentMessage = event.detail;

      if (selectedUser && sentMessage.receiverId === selectedUser.id) {
        setMessages((prev) => [
          ...prev,
          {
            ...sentMessage,
            from: "me",
            status: "sent",
          },
        ]);
        setTimeout(scrollToBottom, 100);

        if (isNewChat) {
          setIsNewChat(false);
          loadConversations().then(() => {
            const newConvIndex = conversations.findIndex(
              (conv) => conv.id === selectedUser.id
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

    const handleMessageDelivered = (event: CustomEvent) => {
      const { messageId } = event.detail;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, status: "delivered", delivered: true }
            : msg
        )
      );
    };

    const handleMessageSeen = (event: CustomEvent) => {
      const { messageId } = event.detail;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "seen", seen: true } : msg
        )
      );
    };

    const handleConversationUpdated = (event: CustomEvent) => {
      const { partnerId, lastMessage, lastMessageTime } = event.detail;
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === partnerId
            ? { ...conv, lastMessage, lastMessageTime }
            : conv
        )
      );
    };

    const handleUnreadCountUpdated = (event: CustomEvent) => {
      const { partnerId, unreadCount } = event.detail;
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === partnerId
            ? { ...conv, unreadCount, unread: unreadCount > 0 }
            : conv
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

    const handleOnlineUsersUpdated = () => {
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
      "message_delivered",
      handleMessageDelivered as EventListener
    );
    window.addEventListener("message_seen", handleMessageSeen as EventListener);
    window.addEventListener(
      "conversation_updated",
      handleConversationUpdated as EventListener
    );
    window.addEventListener(
      "unread_count_updated",
      handleUnreadCountUpdated as EventListener
    );
    window.addEventListener("user_typing", handleUserTyping as EventListener);
    window.addEventListener(
      "user_stopped_typing",
      handleUserStoppedTyping as EventListener
    );
    window.addEventListener(
      "online_users_updated",
      handleOnlineUsersUpdated as EventListener
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
        "message_delivered",
        handleMessageDelivered as EventListener
      );
      window.removeEventListener(
        "message_seen",
        handleMessageSeen as EventListener
      );
      window.removeEventListener(
        "conversation_updated",
        handleConversationUpdated as EventListener
      );
      window.removeEventListener(
        "unread_count_updated",
        handleUnreadCountUpdated as EventListener
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
        handleOnlineUsersUpdated as EventListener
      );
    };
  }, [selectedUser?.id, socket, connectionStatus, isNewChat, onlineUsers]); // Minimal dependencies

  // Handle conversation room management - separate effect with proper cleanup
  useEffect(() => {
    if (
      selectedUser &&
      !isNewChat &&
      socket &&
      connectionStatus === "connected"
    ) {
      // Only join if we're not already in this conversation
      if (currentConversationRef.current !== selectedUser.id) {
        // Leave previous conversation if exists
        if (currentConversationRef.current) {
          leaveConversation(currentConversationRef.current);
        }

        // Join new conversation
        joinConversation(selectedUser.id);
        currentConversationRef.current = selectedUser.id;

        // Load messages for this conversation
        loadMessages(selectedUser.id);
      }
    }

    // Cleanup function
    return () => {
      if (
        currentConversationRef.current &&
        socket &&
        connectionStatus === "connected"
      ) {
        leaveConversation(currentConversationRef.current);
        currentConversationRef.current = null;
      }
    };
  }, [selectedUser?.id, isNewChat, socket, connectionStatus]); // Only essential dependencies

  // Auto-scroll when messages change
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages.length]);

  // Set loading to false when data is ready
  useEffect(() => {
    if (conversations.length > 0 || newChatUser || !searchParams.get("id")) {
      setLoading(false);
    }
  }, [conversations.length, newChatUser, searchParams.get("id")]);

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
        receiver: selectedUser,
        seen: false,
        delivered: false,
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, tempMessage]);
      setTimeout(scrollToBottom, 100);

      sendMessage(selectedUser.id, message.trim());
      setMessage("");

      if (socket && connectionStatus === "connected") {
        stopTyping(selectedUser.id);
      }
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
    socket,
  ]);

  const handleInputChange = useCallback(
    (value: string) => {
      setMessage(value);

      if (
        selectedUser &&
        value.trim() &&
        socket &&
        connectionStatus === "connected"
      ) {
        startTyping(selectedUser.id);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          stopTyping(selectedUser.id);
        }, 2000);
      } else if (selectedUser && socket && connectionStatus === "connected") {
        stopTyping(selectedUser.id);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [selectedUser?.id, connectionStatus, startTyping, stopTyping, socket]
  );

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
       navigate("/brand/messages", { replace: true });
    },
    [navigate]
  );

  const handleBackToConversations = useCallback(() => {
    setSelectedUserIndex(null);
    setIsNewChat(false);
    setNewChatUser(null);
     navigate("/brand/messages", { replace: true });
  }, [navigate]);

  if (loading) {
    return (
      <BrandLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout>
      <div className="flex  h-full bg-white text-gray-800">
        {/* Connection Status */}
        <div
          className={clsx(
            "fixed  right-4 z-50 px-3  rounded-full text-sm font-medium",
            connectionStatus === "connected"
              ? "bg-green-100 text-green-800"
              : connectionStatus === "connecting"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {connectionStatus === "connected"
            ? "🟢 Connected"
            : connectionStatus === "connecting"
            ? "🟡 Connecting..."
            : "🔴 Disconnected"}
        </div>

        {/* Sidebar */}
        <div
          className={clsx(
            "border-r overflow-y-auto bg-white flex flex-col transition-all duration-300",
            selectedUser ? "w-0 md:w-[25%]" : "w-full md:w-[25%]"
          )}
        >
          <div className="p-4 border-b">
            <h2 className="font-bold text-xl">Messages</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((user, index) => (
              <div
                key={user.id}
                onClick={() => handleSelectConversation(index)}
                className={clsx(
                  "flex items-center px-4 py-3 cursor-pointer ",
                  selectedUserIndex === index && "bg-gray-200"
                )}
              >
                <div className="relative">
                  <img
                    src={
                      user.profilePic || "/placeholder.svg?height=40&width=40"
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  {isUserOnline(user.id) && (
                    <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{user.name}</h4>
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
          <div className="flex-1 flex flex-col">
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
                  src={
                    selectedUser.profilePic ||
                    "/placeholder.svg?height=48&width=48"
                  }
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
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
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
    </BrandLayout>
  );
}
