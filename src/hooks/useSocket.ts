"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, type Socket } from "socket.io-client"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  sender: any
  receiver: any
  seen: boolean
  delivered: boolean
  createdAt: string
  type: string
}

interface OnlineUser {
  userId: string
  username: string
  firstName: string
  lastName: string
}

type ConnectionStatus = "connecting" | "connected" | "disconnected"

interface UseSocketReturn {
  socket: Socket | null
  connectionStatus: ConnectionStatus
  onlineUsers: OnlineUser[]
  sendMessage: (receiverId: string, content: string) => void
  markMessageSeen: (messageId: string, senderId: string) => void
  markConversationSeen: (partnerId: string) => void
  startTyping: (receiverId: string) => void
  stopTyping: (receiverId: string) => void
  joinConversation: (partnerId: string) => void
  leaveConversation: (partnerId: string) => void
  reconnect: () => void
}

export const useSocket = (token: string | null): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  const socketRef = useRef<Socket | null>(null)
  const eventListenersSetup = useRef(false)
  const currentRoom = useRef<string | null>(null)
  const isConnecting = useRef(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  const setupEventListeners = useCallback((socket: Socket) => {
    if (eventListenersSetup.current) return
    eventListenersSetup.current = true

    console.log("🔧 Setting up socket event listeners")

    // Connection events
    socket.on("connect", () => {
      if (!mountedRef.current) return
      console.log("✅ Connected to server")
      setConnectionStatus("connected")
      isConnecting.current = false

      // Clear any pending reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    })

    socket.on("disconnect", (reason) => {
      if (!mountedRef.current) return
      console.log("❌ Disconnected:", reason)
      setConnectionStatus("disconnected")
      isConnecting.current = false

      // Only attempt reconnection for certain disconnect reasons
      if (reason === "io server disconnect" || reason === "transport close") {
        // Server initiated disconnect or transport issues - attempt reconnection
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current && !isConnecting.current) {
              console.log("🔄 Attempting reconnection...")
              socket.connect()
            }
          }, 2000)
        }
      }
    })

    socket.on("connect_error", (error) => {
      if (!mountedRef.current) return
      console.error("Connection error:", error)
      setConnectionStatus("disconnected")
      isConnecting.current = false
    })

    // Online users events
    socket.on("online_users", (users: OnlineUser[]) => {
      if (!mountedRef.current) return
      setOnlineUsers(users)
      window.dispatchEvent(new CustomEvent("online_users_updated", { detail: users }))
    })

    socket.on("user_online", (user: OnlineUser) => {
      if (!mountedRef.current) return
      setOnlineUsers((prev) => {
        const exists = prev.some((u) => u.userId === user.userId)
        if (exists) return prev
        const updated = [...prev, user]
        window.dispatchEvent(new CustomEvent("user_online", { detail: user }))
        return updated
      })
    })

    socket.on("user_offline", (data: { userId: string }) => {
      if (!mountedRef.current) return
      setOnlineUsers((prev) => {
        const updated = prev.filter((user) => user.userId !== data.userId)
        window.dispatchEvent(new CustomEvent("user_offline", { detail: data }))
        return updated
      })
    })

    // Message events
    socket.on("new_message", (message: Message) => {
      if (!mountedRef.current) return
      console.log("📨 New message received:", message.id)
      window.dispatchEvent(new CustomEvent("new_message", { detail: message }))
    })

    socket.on("message_sent", (message: Message) => {
      if (!mountedRef.current) return
      console.log("✅ Message sent:", message.id)
      window.dispatchEvent(new CustomEvent("message_sent", { detail: message }))
    })

    socket.on("message_delivered", (data: { messageId: string }) => {
      if (!mountedRef.current) return
      console.log("✅ Message delivered:", data.messageId)
      window.dispatchEvent(new CustomEvent("message_delivered", { detail: data }))
    })

    socket.on("message_seen", (data: { messageId: string; seenBy: string }) => {
      if (!mountedRef.current) return
      console.log("👁️ Message seen:", data.messageId)
      window.dispatchEvent(new CustomEvent("message_seen", { detail: data }))
    })

    socket.on("conversation_seen", (data: { seenBy: string; conversationWith: string }) => {
      if (!mountedRef.current) return
      console.log("👁️ Conversation seen:", data)
      window.dispatchEvent(new CustomEvent("conversation_seen", { detail: data }))
    })

    socket.on("conversation_updated", (data: any) => {
      if (!mountedRef.current) return
      console.log("🔄 Conversation updated:", data)
      window.dispatchEvent(new CustomEvent("conversation_updated", { detail: data }))
    })

    socket.on("unread_count_updated", (data: { partnerId: string; unreadCount: number }) => {
      if (!mountedRef.current) return
      console.log("🔢 Unread count updated:", data)
      window.dispatchEvent(new CustomEvent("unread_count_updated", { detail: data }))
    })

    // Typing events
    socket.on("user_typing", (data: any) => {
      if (!mountedRef.current) return
      window.dispatchEvent(new CustomEvent("user_typing", { detail: data }))
    })

    socket.on("user_stopped_typing", (data: { userId: string }) => {
      if (!mountedRef.current) return
      window.dispatchEvent(new CustomEvent("user_stopped_typing", { detail: data }))
    })

    socket.on("message_error", (error: { error: string }) => {
      if (!mountedRef.current) return
      console.error("❌ Message error:", error.error)
      window.dispatchEvent(new CustomEvent("message_error", { detail: error }))
    })
  }, [])

  const cleanupSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("🧹 Cleaning up socket connection...")

      // Remove all listeners
      socketRef.current.removeAllListeners()

      // Disconnect
      socketRef.current.disconnect()

      // Clear references
      socketRef.current = null
      setSocket(null)
      setConnectionStatus("disconnected")
      setOnlineUsers([])
      eventListenersSetup.current = false
      currentRoom.current = null
      isConnecting.current = false

      // Clear reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [])

  const connect = useCallback(() => {
    if (!token || !mountedRef.current || socketRef.current || isConnecting.current) {
      return
    }

    isConnecting.current = true
    setConnectionStatus("connecting")

    console.log("🔌 Connecting to socket server...")

    const newSocket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 10000,
      reconnection: false, // We'll handle reconnection manually
      forceNew: true, // Force a new connection
    })

    socketRef.current = newSocket
    setSocket(newSocket)
    setupEventListeners(newSocket)
  }, [token, setupEventListeners])



  const reconnect = useCallback(() => {
    console.log("🔄 Manual reconnection requested")
    cleanupSocket()
    setTimeout(() => {
      if (mountedRef.current) {
        connect()
      }
    }, 1000)
  }, [cleanupSocket, connect])

  // Initialize connection when token is available
  useEffect(() => {
    mountedRef.current = true

    if (token && !socketRef.current && !isConnecting.current) {
      connect()
    }

    return () => {
      mountedRef.current = false
      cleanupSocket()
    }
  }, [token, connect, cleanupSocket])

  // Socket methods
  const sendMessage = useCallback(
    (receiverId: string, content: string) => {
      if (socket && connectionStatus === "connected") {
        console.log("📤 Sending message to:", receiverId)
        socket.emit("send_message", { receiverId, content, type: "text" })
      }
    },
    [socket, connectionStatus],
  )

  const markMessageSeen = useCallback(
    (messageId: string, senderId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("mark_message_seen", { messageId, senderId })
      }
    },
    [socket, connectionStatus],
  )

  const markConversationSeen = useCallback(
    (partnerId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("mark_conversation_seen", { partnerId })
      }
    },
    [socket, connectionStatus],
  )

  const startTyping = useCallback(
    (receiverId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("typing_start", { receiverId })
      }
    },
    [socket, connectionStatus],
  )

  const stopTyping = useCallback(
    (receiverId: string) => {
      if (socket && connectionStatus === "connected") {
        socket.emit("typing_stop", { receiverId })
      }
    },
    [socket, connectionStatus],
  )

  const joinConversation = useCallback(
    (partnerId: string) => {
      if (socket && connectionStatus === "connected") {
        const roomName = [socket.id?.split("").slice(0, 10).join(""), partnerId].sort().join("_")

        // Only join if not already in this room
        if (currentRoom.current !== roomName) {
          // Leave previous room if exists
          if (currentRoom.current) {
            const previousPartnerId = currentRoom.current.split("_")[1]
            if (previousPartnerId !== partnerId) {
              socket.emit("leave_conversation", { partnerId: previousPartnerId })
            }
          }

          socket.emit("join_conversation", { partnerId })
          currentRoom.current = roomName
          console.log("🏠 Joined conversation room:", roomName)
        }
      }
    },
    [socket, connectionStatus],
  )

  const leaveConversation = useCallback(
    (partnerId: string) => {
      if (socket && connectionStatus === "connected" && currentRoom.current) {
        socket.emit("leave_conversation", { partnerId })
        currentRoom.current = null
        console.log("🚪 Left conversation room")
      }
    },
    [socket, connectionStatus],
  )

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
    reconnect,
  }
}
