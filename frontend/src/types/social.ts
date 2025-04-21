
export type Friend = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  bio?: string;
};

export type FriendRequest = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
};
