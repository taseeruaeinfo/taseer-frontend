import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

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

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: OnlineUser[];
  sendMessage: (receiverId: string, content: string) => void;
  markMessageSeen: (messageId: string, senderId: string) => void;
  markConversationSeen: (partnerId: string) => void;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  joinConversation: (partnerId: string) => void;
  leaveConversation: (partnerId: string) => void;
  getOnlineStatus: (userIds: string[]) => void;
}

export const useSocket = (token: string | null): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Online users events
    newSocket.on('online_users', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('user_online', (user: OnlineUser) => {
      setOnlineUsers(prev => {
        const exists = prev.some(u => u.userId === user.userId);
        if (exists) return prev;
        return [...prev, user];
      });
    });

    newSocket.on('user_offline', (data: { userId: string }) => {
      setOnlineUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    // Message events
    newSocket.on('new_message', (message: Message) => {
      // Handle new incoming message
      console.log('New message received:', message);
      // You can dispatch this to your state management or handle it in the component
      window.dispatchEvent(new CustomEvent('new_message', { detail: message }));
    });

    newSocket.on('message_sent', (message: Message) => {
      // Handle message sent confirmation
      console.log('Message sent successfully:', message);
      window.dispatchEvent(new CustomEvent('message_sent', { detail: message }));
    });

    newSocket.on('message_error', (error: { error: string }) => {
      console.error('Message error:', error.error);
      window.dispatchEvent(new CustomEvent('message_error', { detail: error }));
    });

    newSocket.on('message_seen', (data: { messageId: string; seenBy: string }) => {
      console.log('Message seen:', data);
      window.dispatchEvent(new CustomEvent('message_seen', { detail: data }));
    });

    newSocket.on('conversation_seen', (data: { seenBy: string; conversationWith: string }) => {
      console.log('Conversation seen:', data);
      window.dispatchEvent(new CustomEvent('conversation_seen', { detail: data }));
    });

    // Typing events
    newSocket.on('user_typing', (data: { userId: string; username: string; firstName: string; lastName: string }) => {
      console.log('User typing:', data);
      window.dispatchEvent(new CustomEvent('user_typing', { detail: data }));
    });

    newSocket.on('user_stopped_typing', (data: { userId: string }) => {
      console.log('User stopped typing:', data);
      window.dispatchEvent(new CustomEvent('user_stopped_typing', { detail: data }));
    });

    // Online status events
    newSocket.on('online_statuses', (statuses: { [key: string]: boolean }) => {
      console.log('Online statuses:', statuses);
      window.dispatchEvent(new CustomEvent('online_statuses', { detail: statuses }));
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
    };
  }, [token]);

  // Socket methods
  const sendMessage = (receiverId: string, content: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        receiverId,
        content,
        type: 'text'
      });
    }
  };

  const markMessageSeen = (messageId: string, senderId: string) => {
    if (socket && isConnected) {
      socket.emit('mark_message_seen', {
        messageId,
        senderId
      });
    }
  };

  const markConversationSeen = (partnerId: string) => {
    if (socket && isConnected) {
      socket.emit('mark_conversation_seen', {
        partnerId
      });
    }
  };

  const startTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_start', {
        receiverId
      });
    }
  };

  const stopTyping = (receiverId: string) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', {
        receiverId
      });
    }
  };

  const joinConversation = (partnerId: string) => {
    if (socket && isConnected) {
      socket.emit('join_conversation', {
        partnerId
      });
    }
  };

  const leaveConversation = (partnerId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_conversation', {
        partnerId
      });
    }
  };

  const getOnlineStatus = (userIds: string[]) => {
    if (socket && isConnected) {
      socket.emit('get_online_status', {
        userIds
      });
    }
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    markMessageSeen,
    markConversationSeen,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    getOnlineStatus
  };
};