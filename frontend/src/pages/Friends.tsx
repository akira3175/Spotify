import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, Users, UserPlus, UserCheck, UserX, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enhanced mock user data with more details
const mockUsers = [
  { 
    id: 1, 
    name: 'John Doe', 
    username: 'johndoe', 
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Music producer and vinyl collector',
    favGenre: 'Jazz, Hip-Hop'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    username: 'janesmith', 
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'offline',
    bio: 'Classical pianist and composer',
    favGenre: 'Classical, Ambient'
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    username: 'robertj', 
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Blues guitarist and songwriter',
    favGenre: 'Blues, Rock'
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    username: 'emilyd', 
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Folk singer and lyricist',
    favGenre: 'Folk, Indie'
  },
  { 
    id: 5, 
    name: 'Michael Wilson', 
    username: 'mikew', 
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'offline',
    bio: 'Electronic music producer and DJ',
    favGenre: 'Electronic, House'
  },
  { 
    id: 6, 
    name: 'Sarah Johnson', 
    username: 'sarahj', 
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Vocalist and guitar player',
    favGenre: 'Pop, R&B'
  },
  { 
    id: 7, 
    name: 'David Brown', 
    username: 'davidb', 
    avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'offline',
    bio: 'Drummer and percussion enthusiast',
    favGenre: 'Rock, Metal'
  },
  { 
    id: 8, 
    name: 'Lisa Chen', 
    username: 'lisac', 
    avatarUrl: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    status: 'online',
    bio: 'Violinist and orchestra conductor',
    favGenre: 'Classical, Soundtrack'
  }
];

// Sample friend connections
const initialFriends = [
  mockUsers[0], // John Doe
  mockUsers[3], // Emily Davis
  mockUsers[5]  // Sarah Johnson
];

// Sample pending requests
const initialPendingRequests = [
  mockUsers[2], // Robert Johnson
  mockUsers[7]  // Lisa Chen
];

// Sample sent requests
const initialSentRequests = [
  mockUsers[1], // Jane Smith
];

const Friends = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const storedFriends = localStorage.getItem('spotify_friends');
      const storedPendingRequests = localStorage.getItem('spotify_pending_requests');
      const storedSentRequests = localStorage.getItem('spotify_sent_requests');
      
      if (storedFriends) {
        setFriends(JSON.parse(storedFriends));
      } else {
        setFriends(initialFriends);
        localStorage.setItem('spotify_friends', JSON.stringify(initialFriends));
      }
      
      if (storedPendingRequests) {
        setPendingRequests(JSON.parse(storedPendingRequests));
      } else {
        setPendingRequests(initialPendingRequests);
        localStorage.setItem('spotify_pending_requests', JSON.stringify(initialPendingRequests));
      }
      
      if (storedSentRequests) {
        setSentRequests(JSON.parse(storedSentRequests));
      } else {
        setSentRequests(initialSentRequests);
        localStorage.setItem('spotify_sent_requests', JSON.stringify(initialSentRequests));
      }
    }
  }, [isAuthenticated]);

  const filteredUsers = searchTerm ? 
    mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const isFriend = (userId: number) => {
    return friends.some(friend => friend.id === userId);
  };

  const isRequestPending = (userId: number) => {
    return pendingRequests.some(req => req.id === userId) || 
           sentRequests.some(req => req.id === userId);
  };

  const sendFriendRequest = (user: any) => {
    const updatedSentRequests = [...sentRequests, user];
    setSentRequests(updatedSentRequests);
    localStorage.setItem('spotify_sent_requests', JSON.stringify(updatedSentRequests));
    
    toast({
      title: "Friend request sent",
      description: `You sent a friend request to ${user.name}.`,
    });
  };

  const acceptFriendRequest = (user: any) => {
    const updatedFriends = [...friends, user];
    setFriends(updatedFriends);
    localStorage.setItem('spotify_friends', JSON.stringify(updatedFriends));
    
    const updatedPendingRequests = pendingRequests.filter(req => req.id !== user.id);
    setPendingRequests(updatedPendingRequests);
    localStorage.setItem('spotify_pending_requests', JSON.stringify(updatedPendingRequests));
    
    toast({
      title: "Friend request accepted",
      description: `You are now friends with ${user.name}.`,
    });
  };

  const rejectFriendRequest = (user: any) => {
    const updatedPendingRequests = pendingRequests.filter(req => req.id !== user.id);
    setPendingRequests(updatedPendingRequests);
    localStorage.setItem('spotify_pending_requests', JSON.stringify(updatedPendingRequests));
    
    toast({
      title: "Friend request rejected",
      description: `You rejected ${user.name}'s friend request.`,
    });
  };

  const cancelFriendRequest = (user: any) => {
    const updatedSentRequests = sentRequests.filter(req => req.id !== user.id);
    setSentRequests(updatedSentRequests);
    localStorage.setItem('spotify_sent_requests', JSON.stringify(updatedSentRequests));
    
    toast({
      title: "Friend request cancelled",
      description: `You cancelled your friend request to ${user.name}.`,
    });
  };

  const removeFriend = (user: any) => {
    const updatedFriends = friends.filter(friend => friend.id !== user.id);
    setFriends(updatedFriends);
    localStorage.setItem('spotify_friends', JSON.stringify(updatedFriends));
    
    toast({
      title: "Friend removed",
      description: `You removed ${user.name} from your friends.`,
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Users className="mr-2" /> Friends
        </h1>
        
        <Tabs defaultValue="friends">
          <TabsList className="mb-6">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent Requests {sentRequests.length > 0 && `(${sentRequests.length})`}
            </TabsTrigger>
            <TabsTrigger value="find">Find Friends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends">
            {friends.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full overflow-hidden relative">
                        {friend.avatarUrl ? (
                          <img 
                            src={friend.avatarUrl} 
                            alt={friend.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                            {friend.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {friend.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-zinc-400">@{friend.username}</p>
                        <p className="text-xs text-zinc-500 mt-1">{friend.bio}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/chat/${friend.id}`}>
                          <MessageCircle size={16} className="mr-1" /> Message
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const updatedFriends = friends.filter(f => f.id !== friend.id);
                          setFriends(updatedFriends);
                          localStorage.setItem('spotify_friends', JSON.stringify(updatedFriends));
                          toast({
                            title: "Friend removed",
                            description: `You removed ${friend.name} from your friends.`,
                          });
                        }}
                      >
                        <UserX size={16} className="mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 p-8 rounded-lg text-center">
                <Users size={48} className="mx-auto text-zinc-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">No friends yet</h3>
                <p className="text-zinc-400 mb-6">You haven't added any friends yet.</p>
                <Button onClick={() => navigate('/friends?tab=find')}>
                  <UserPlus size={16} className="mr-1" /> Find Friends
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {pendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full overflow-hidden">
                        {request.avatarUrl ? (
                          <img 
                            src={request.avatarUrl} 
                            alt={request.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                            {request.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-zinc-400">@{request.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="bg-green-500 hover:bg-green-600 text-black" 
                        size="sm"
                        onClick={() => acceptFriendRequest(request)}
                      >
                        <UserCheck size={16} className="mr-1" /> Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => rejectFriendRequest(request)}
                      >
                        <UserX size={16} className="mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 p-8 rounded-lg text-center">
                <UserCheck size={48} className="mx-auto text-zinc-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">No pending requests</h3>
                <p className="text-zinc-400">You don't have any pending friend requests.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sent">
            {sentRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sentRequests.map((request) => (
                  <div key={request.id} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full overflow-hidden">
                        {request.avatarUrl ? (
                          <img 
                            src={request.avatarUrl} 
                            alt={request.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                            {request.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-zinc-400">@{request.username}</p>
                      </div>
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => cancelFriendRequest(request)}
                      >
                        <UserX size={16} className="mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 p-8 rounded-lg text-center">
                <UserPlus size={48} className="mx-auto text-zinc-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">No sent requests</h3>
                <p className="text-zinc-400">You haven't sent any friend requests.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="find">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search for users by name or username"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {searchTerm ? (
              filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-zinc-800 rounded-full overflow-hidden">
                          {user.avatarUrl ? (
                            <img 
                              src={user.avatarUrl} 
                              alt={user.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-zinc-400">@{user.username}</p>
                        </div>
                      </div>
                      <div>
                        {isFriend(user.id) ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled
                          >
                            <UserCheck size={16} className="mr-1" /> Friends
                          </Button>
                        ) : isRequestPending(user.id) ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled
                          >
                            <UserPlus size={16} className="mr-1" /> Pending
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => sendFriendRequest(user)}
                          >
                            <UserPlus size={16} className="mr-1" /> Add Friend
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-900 p-8 rounded-lg text-center">
                  <Search size={48} className="mx-auto text-zinc-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No users found</h3>
                  <p className="text-zinc-400">No users match your search term.</p>
                </div>
              )
            ) : (
              <div className="bg-zinc-900 p-8 rounded-lg text-center">
                <Search size={48} className="mx-auto text-zinc-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Search for friends</h3>
                <p className="text-zinc-400">Enter a name or username to find people to connect with.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Friends;
