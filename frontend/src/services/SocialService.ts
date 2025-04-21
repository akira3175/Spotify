import { Friend, FriendRequest, ChatMessage } from '../types/social';

// Sample friends data
export const sampleFriends: Friend[] = [
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    lastSeen: new Date(),
    bio: 'Passionate about rock music and electric guitar. Been to over 50 concerts!'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'offline',
    lastSeen: new Date(Date.now() - 86400000), // 24 hours ago
    bio: 'Classical pianist and music theory teacher. Love Mozart and Beethoven.'
  },
  {
    id: '4',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'away',
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    bio: 'Hip-hop producer and DJ. Always looking for new sounds and beats.'
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    lastSeen: new Date(),
    bio: 'Folk singer and songwriter. Inspired by nature and human emotions.'
  }
];

// Sample friend requests data
export const sampleFriendRequests: FriendRequest[] = [
  {
    id: 'req1',
    senderId: '2',
    senderName: 'John Doe',
    senderAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'pending',
    createdAt: new Date('2024-04-19'),
  },
  {
    id: 'req2',
    senderId: '3',
    senderName: 'Jane Smith',
    senderAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'accepted',
    createdAt: new Date('2024-03-25'),
  },
  {
    id: 'req3',
    senderId: '4',
    senderName: 'Michael Wilson',
    senderAvatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'pending',
    createdAt: new Date('2024-04-17'),
  },
  {
    id: 'req4',
    senderId: '5',
    senderName: 'Emily Davis',
    senderAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'rejected',
    createdAt: new Date('2024-04-15'),
  },
  {
    id: 'req5',
    senderId: '2',
    senderName: 'Emily Davis',
    senderAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'pending',
    createdAt: new Date('2024-04-21'),
  },
];

// Sample chat messages data
export const sampleChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: '2',
    receiverId: '1',
    content: 'Hey, have you heard the new Queen song?',
    timestamp: new Date('2024-04-21T10:30:00'),
    read: true,
  },
  {
    id: 'msg2',
    senderId: '1',
    receiverId: '2',
    content: 'No, I haven\'t! Is it any good?',
    timestamp: new Date('2024-04-21T10:32:00'),
    read: true,
  },
  {
    id: 'msg3',
    senderId: '2',
    receiverId: '1',
    content: 'It\'s amazing! You should check it out.',
    timestamp: new Date('2024-04-21T10:35:00'),
    read: true,
  },
  {
    id: 'msg4',
    senderId: '3',
    receiverId: '1',
    content: 'Hello! Are you interested in classical music?',
    timestamp: new Date('2024-04-21T11:00:00'),
    read: false,
  },
  {
    id: 'msg5',
    senderId: '1',
    receiverId: '3',
    content: 'Yes, I do! I love classical music.',
    timestamp: new Date('2024-04-21T11:05:00'),
    read: false,
  },
];

export class SocialService {
  static getFriends(): Friend[] {
    return sampleFriends;
  }

  static getFriendRequests(): FriendRequest[] {
    return sampleFriendRequests;
  }

  static getChatMessages(userId: string): ChatMessage[] {
    return sampleChatMessages.filter(
      (msg) => msg.senderId === userId || msg.receiverId === userId
    );
  }

  static sendChatMessage(senderId: string, receiverId: string, content: string): ChatMessage {
    const newMessage: ChatMessage = {
      id: `msg${sampleChatMessages.length + 1}`,
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      timestamp: new Date(),
      read: false,
    };

    sampleChatMessages.push(newMessage);
    return newMessage;
  }

  static acceptFriendRequest(requestId: string): void {
    const request = sampleFriendRequests.find((req) => req.id === requestId);
    if (request) {
      request.status = 'accepted';

      // Add the sender to the friend list
      const newFriend: Friend = {
        id: request.senderId,
        name: request.senderName,
        email: '', // You might want to fetch the email from user data
        avatarUrl: request.senderAvatarUrl,
        status: 'online',
        lastSeen: new Date(),
        bio: '', // You might want to fetch the bio from user data
      };

      sampleFriends.push(newFriend);
    }
  }

  static rejectFriendRequest(requestId: string): void {
    const request = sampleFriendRequests.find((req) => req.id === requestId);
    if (request) {
      request.status = 'rejected';
    }
  }
}
