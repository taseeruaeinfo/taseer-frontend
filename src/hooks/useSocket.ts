"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
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
  type: string;
}

interface OnlineUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface UseOptimizedSocketReturn {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  onlineUsers: OnlineUser[];
  sendMessage: (receiverId: string, content: string) => void;
  markMessageSeen: (messageId: string, senderId: string) => void;
  markConversationSeen: (partnerId: string) => void;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  joinConversation: (partnerId: string) => void;
  leaveConversation: (partnerId: string) => void;
  getOnlineStatus: (userIds: string[]) => void;
  reconnect: () => void;
}

export const useOptimizedSocket = (
  token: string | null
): UseOptimizedSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<
    Array<{ receiverId: string; content: string }>
  >([]);

  const connect = useCallback(() => {
    if (!token) return;

    setConnectionStatus("connecting");

    const newSocket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
      setConnectionStatus("connected");

      // Send queued messages
      if (messageQueueRef.current.length > 0) {
        messageQueueRef.current.forEach(({ receiverId, content }) => {
          newSocket.emit("send_message", {
            receiverId,
            content,
            type: "text",
          });
        });
        messageQueueRef.current = [];
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      setConnectionStatus("disconnected");

      // Auto-reconnect for certain disconnect reasons
      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionStatus("disconnected");
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      setConnectionStatus("connected");
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("❌ Failed to reconnect");
      setConnectionStatus("disconnected");
    });

    // Online users events with debouncing
    let onlineUsersTimeout: NodeJS.Timeout;
    newSocket.on("online_users", (users: OnlineUser[]) => {
      clearTimeout(onlineUsersTimeout);
      onlineUsersTimeout = setTimeout(() => {
        setOnlineUsers(users);
        window.dispatchEvent(new CustomEvent("online_users_updated"));
      }, 100);
    });

    newSocket.on("user_online", (user: OnlineUser) => {
      setOnlineUsers((prev) => {
        const exists = prev.some((u) => u.userId === user.userId);
        if (exists) return prev;
        const updated = [...prev, user];
        window.dispatchEvent(new CustomEvent("online_users_updated"));
        return updated;
      });
    });

    newSocket.on("user_offline", (data: { userId: string }) => {
      setOnlineUsers((prev) => {
        const updated = prev.filter((user) => user.userId !== data.userId);
        window.dispatchEvent(new CustomEvent("online_users_updated"));
        return updated;
      });
    });

    // Message events
    newSocket.on("new_message", (message: Message) => {
      console.log("New message received:", message);
      window.dispatchEvent(new CustomEvent("new_message", { detail: message }));
    });

    newSocket.on("message_sent", (message: Message) => {
      console.log("Message sent successfully:", message);
      window.dispatchEvent(
        new CustomEvent("message_sent", { detail: message })
      );
    });

    newSocket.on("message_error", (error: { error: string }) => {
      console.error("Message error:", error.error);
      window.dispatchEvent(new CustomEvent("message_error", { detail: error }));
    });

    newSocket.on(
      "message_seen",
      (data: { messageId: string; seenBy: string }) => {
        console.log("Message seen:", data);
        window.dispatchEvent(new CustomEvent("message_seen", { detail: data }));
      }
    );

    newSocket.on(
      "conversation_seen",
      (data: { seenBy: string; conversationWith: string }) => {
        console.log("Conversation seen:", data);
        window.dispatchEvent(
          new CustomEvent("conversation_seen", { detail: data })
        );
      }
    );

    let typingTimeout: NodeJS.Timeout | undefined;

    newSocket.on(
      "user_typing",
      (data: {
        userId: string;
        username: string;
        firstName: string;
        lastName: string;
      }) => {
        if (typingTimeout) clearTimeout(typingTimeout);

        window.dispatchEvent(new CustomEvent("user_typing", { detail: data }));

        typingTimeout = setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("user_stopped_typing", {
              detail: { userId: data.userId },
            })
          );
          typingTimeout = undefined;
        }, 3000);
      }
    );

    newSocket.on("user_stopped_typing", (data: { userId: string }) => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = undefined;
      }
      window.dispatchEvent(
        new CustomEvent("user_stopped_typing", { detail: data })
      );
    });

    // Online status events
    newSocket.on("online_statuses", (statuses: { [key: string]: boolean }) => {
      console.log("Online statuses:", statuses);
      window.dispatchEvent(
        new CustomEvent("online_statuses", { detail: statuses })
      );
    });
  }, [token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnectionStatus("disconnected");
      setOnlineUsers([]);
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  useEffect(() => {
    if (token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  // Optimized socket methods with queuing for offline scenarios
  const sendMessage = useCallback(
    (receiverId: string, content: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("send_message", {
          receiverId,
          content,
          type: "text",
        });
      } else {
        // Queue message for when connection is restored
        messageQueueRef.current.push({ receiverId, content });
        console.log("Message queued for when connection is restored");
      }
    },
    [socket, connectionStatus]
  );

  const markMessageSeen = useCallback(
    (messageId: string, senderId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("mark_message_seen", {
          messageId,
          senderId,
        });
      }
    },
    [socket, connectionStatus]
  );

  const markConversationSeen = useCallback(
    (partnerId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("mark_conversation_seen", {
          partnerId,
        });
      }
    },
    [socket, connectionStatus]
  );

  const startTyping = useCallback(
    (receiverId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("typing_start", {
          receiverId,
        });
      }
    },
    [socket, connectionStatus]
  );

  const stopTyping = useCallback(
    (receiverId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("typing_stop", {
          receiverId,
        });
      }
    },
    [socket, connectionStatus]
  );

  const joinConversation = useCallback(
    (partnerId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("join_conversation", {
          partnerId,
        });
      }
    },
    [socket, connectionStatus]
  );

  const leaveConversation = useCallback(
    (partnerId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("leave_conversation", {
          partnerId,
        });
      }
    },
    [socket, connectionStatus]
  );

  const getOnlineStatus = useCallback(
    (userIds: string[]) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("get_online_status", {
          userIds,
        });
      }
    },
    [socket, connectionStatus]
  );

  return {
    socket,
    connectionStatus,
    onlineUsers,
    sendMessage,
    markMessageSeen,
    markConversationSeen,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    getOnlineStatus,
    reconnect,
  };
};
