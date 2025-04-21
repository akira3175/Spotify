
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, User, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  senderId: string | number;
  receiverId: string | number;
  text: string;
  timestamp: Date;
  shared?: {
    type: 'song' | 'playlist';
    title: string;
    artist?: string;
    id: number;
  };
}

// Mock friends data
const mockFriends = [
  { 
    id: 1, 
    name: 'John Doe', 
    username: 'johndoe', 
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Music producer and vinyl collector'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    username: 'janesmith', 
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'offline',
    bio: 'Classical pianist and composer'
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    username: 'robertj', 
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Blues guitarist and songwriter'
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    username: 'emilyd', 
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Folk singer and lyricist'
  }
];

// Sample conversation data for each friend
const sampleConversations: Record<number, Message[]> = {
  1: [ // John Doe
    {
      id: 1,
      senderId: 1,
      receiverId: 'current-user',
      text: 'Hey! Have you checked out the new album by The Weeknd?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: 2,
      senderId: 'current-user',
      receiverId: 1,
      text: 'Not yet! Is it good?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) // 23 hours ago
    },
    {
      id: 3,
      senderId: 1,
      receiverId: 'current-user',
      text: 'It\'s amazing! Check out this track:',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22) // 22 hours ago
    },
    {
      id: 4,
      senderId: 1,
      receiverId: 'current-user',
      text: '',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
      shared: {
        type: 'song',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        id: 20
      }
    },
    {
      id: 5,
      senderId: 'current-user',
      receiverId: 1,
      text: 'Wow, this is really good! Thanks for sharing.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    }
  ],
  2: [ // Jane Smith
    {
      id: 1,
      senderId: 2,
      receiverId: 'current-user',
      text: 'Hello! I saw you liked classical music. Have you been to any concerts lately?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    },
    {
      id: 2,
      senderId: 'current-user',
      receiverId: 2,
      text: 'Hi Jane! Yes, I went to a piano recital last weekend. It was wonderful!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47) // 47 hours ago
    },
    {
      id: 3,
      senderId: 2,
      receiverId: 'current-user',
      text: 'That sounds lovely! I\'m performing next month at the community center if you\'d like to come.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36) // 36 hours ago
    },
    {
      id: 4,
      senderId: 'current-user',
      receiverId: 2,
      text: 'I\'d love to! Please send me the details when you have them.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 35) // 35 hours ago
    }
  ],
  3: [ // Robert Johnson
    {
      id: 1,
      senderId: 3,
      receiverId: 'current-user',
      text: 'Check out this blues playlist I made!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
    },
    {
      id: 2,
      senderId: 3,
      receiverId: 'current-user',
      text: '',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      shared: {
        type: 'playlist',
        title: 'Blues Classics',
        id: 101
      }
    },
    {
      id: 3,
      senderId: 'current-user',
      receiverId: 3,
      text: 'This looks great! I\'ve been looking for some new blues music.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10) // 10 hours ago
    }
  ],
  4: [ // Emily Davis
    {
      id: 1,
      senderId: 4,
      receiverId: 'current-user',
      text: 'Hi there! I noticed we have similar music taste.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    },
    {
      id: 2,
      senderId: 'current-user',
      receiverId: 4,
      text: 'Hey Emily! Yes, I love folk music too! Any recommendations?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
    },
    {
      id: 3,
      senderId: 4,
      receiverId: 'current-user',
      text: 'Check out Fleet Foxes if you haven\'t already. Their harmonies are incredible!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
    },
    {
      id: 4,
      senderId: 'current-user',
      receiverId: 4,
      text: 'Thanks! I\'ll add them to my playlist.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ]
};

const Chat = () => {
  const { userId } = useParams<{ userId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [friend, setFriend] = useState<any>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load friend data and chat history
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Find friend from mock data
      const friendId = Number(userId);
      const foundFriend = mockFriends.find(f => f.id === friendId);
      
      if (foundFriend) {
        setFriend(foundFriend);
      } else {
        // Fallback in case friend is not found
        setFriend({
          id: friendId,
          name: 'User',
          username: 'user' + friendId,
          avatarUrl: '',
          status: 'offline'
        });
      }

      // Load chat history from localStorage or use sample data
      const chatKey = `spotify_chat_${user?.id}_${userId}`;
      const storedMessages = localStorage.getItem(chatKey);
      
      if (storedMessages) {
        // Parse stored messages and convert timestamp strings back to Date objects
        const parsedMessages = JSON.parse(storedMessages);
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } else if (sampleConversations[friendId]) {
        // Use sample conversation
        setMessages(sampleConversations[friendId]);
        localStorage.setItem(chatKey, JSON.stringify(sampleConversations[friendId]));
      } else {
        // Create welcome message for new chats
        const welcomeMessage = {
          id: 1,
          senderId: Number(userId),
          receiverId: user?.id || 'current-user',
          text: 'Hi there! How are you?',
          timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(chatKey, JSON.stringify([welcomeMessage]));
      }
    }
  }, [isAuthenticated, userId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Create new message
    const newMessage: Message = {
      id: Date.now(),
      senderId: user?.id || 'current-user',
      receiverId: Number(userId),
      text: messageText,
      timestamp: new Date()
    };

    // Update messages
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Save to localStorage
    const chatKey = `spotify_chat_${user?.id}_${userId}`;
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    // Clear input
    setMessageText('');

    // Show notification toast
    toast({
      title: "Message sent",
      description: "Your message has been sent.",
    });
  };

  // Format time for messages
  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!friend) return null;

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-zinc-900 p-4 flex items-center border-b border-zinc-800">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/friends')}
          >
            <ArrowLeft size={18} />
          </Button>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-zinc-800 rounded-full overflow-hidden relative">
              {friend.avatarUrl ? (
                <img 
                  src={friend.avatarUrl} 
                  alt={friend.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                  <User size={20} />
                </div>
              )}
              {friend.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium">{friend.name}</p>
              <p className="text-xs text-zinc-400">@{friend.username}</p>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === user?.id || message.senderId === 'current-user';
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser 
                      ? 'bg-green-500 text-black rounded-br-none' 
                      : 'bg-zinc-800 text-white rounded-bl-none'
                  }`}
                >
                  {message.text && <p>{message.text}</p>}
                  
                  {/* Shared content (song or playlist) */}
                  {message.shared && (
                    <div className={`mt-2 p-3 rounded-md ${isCurrentUser ? 'bg-green-600' : 'bg-zinc-700'}`}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-black/20 flex items-center justify-center rounded">
                          <Music size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm">{message.shared.title}</p>
                          {message.shared.artist && (
                            <p className="text-xs opacity-80">{message.shared.artist}</p>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {message.shared.type === 'song' ? 'Song' : 'Playlist'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'text-black/70' : 'text-zinc-400'}`}>
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div className="bg-zinc-900 p-4 border-t border-zinc-800">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
