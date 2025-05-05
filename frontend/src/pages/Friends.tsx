import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FriendService } from '@/services/FriendService';
import { Friend } from '@/types/friend';
import { ChatboxService } from '@/services/ChatboxService';
import { User } from '@/types/user';
import { Chatbox } from '@/types/chat';

const Friends = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFriends();
      fetchPendingRequests();
      fetchSentRequests();
    }
  }, [isAuthenticated]);

  const fetchFriends = async () => {
    const friends = await FriendService.getFriends();
    setFriends(friends);
  }

  const fetchPendingRequests = async () => {
    const pendingRequests = await FriendService.getPendingRequests();
    setPendingRequests(pendingRequests);
  }

  const fetchSentRequests = async () => {
    const sentRequests = await FriendService.getSentRequests();
    setSentRequests(sentRequests);
  }

  const fetchFilteredUsers = async () => {
    const allUsers = await FriendService.getUser(searchTerm);
    const filtered = allUsers.filter(users => users.id !== user?.id);
    setFilteredUsers(filtered);
  };

  const isFriend = (userId: number) => {
    return friends.some(friend => friend.user?.id === userId);
  };

  const isRequestPending = (userId: number) => {
    return pendingRequests.some(req => req.user.id === userId) || 
           sentRequests.some(req => req.user.id === userId);
  };

  const messageFriend = async (user: User) => {
    const chatbox = await ChatboxService.createChatbox({
      "user_ids": [user.id],
      type: 'user'
    } as unknown as Chatbox);
    navigate(`/chat/${chatbox.id}`);
  }

  const sendFriendRequest = async (user: any) => {
    await FriendService.sendFriendRequest(user.username);
    fetchSentRequests();
    
    toast({
      title: "Friend request sent",
      description: `You sent a friend request to ${user.username}.`,
    });
  };

  const acceptFriendRequest = async (friendRequestID: number) => {
    await FriendService.respondFriendRequest(friendRequestID, 'accept');
    fetchFriends();
    fetchPendingRequests();
    
    toast({
      title: "Friend request accepted"
    });
  };

  const rejectFriendRequest = async (friendRequestID: number) => {
    const response = await FriendService.respondFriendRequest(friendRequestID, 'decline');
    const updatedPendingRequests = pendingRequests.filter(req => req.id !== friendRequestID);
    setPendingRequests(updatedPendingRequests);
    localStorage.setItem('spotify_pending_requests', JSON.stringify(updatedPendingRequests));
    
    toast({
      title: "Friend request rejected",
      description: `You rejected ${response.data.user2.last_name} ${response.data.user2.first_name}'s friend request.`,
    });
  };

  const cancelFriendRequest = async (friendRequestID: number) => {
    const response = await FriendService.cancelFriendRequest(friendRequestID);
    const updatedSentRequests = sentRequests.filter(req => req.id !== friendRequestID);
    setSentRequests(updatedSentRequests);
    localStorage.setItem('spotify_sent_requests', JSON.stringify(updatedSentRequests));
    
    toast({
      title: "Friend request cancelled",
      description: `You cancelled your friend request to ${response.data.user2.last_name} ${response.data.user2.first_name}.`,
    });
  };

  const removeFriend = async (friendID: number) => {
    await FriendService.removeFriend(friendID);
    fetchFriends();
    
    toast({
      title: "Friend removed",
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
                        {friend.user?.avatar ? (
                          <img 
                            src={friend.user.avatar} 
                            alt={friend.user.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                            {friend.user.first_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {friend.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{friend.user.last_name} {friend.user.first_name}</p>
                        <p className="text-sm text-zinc-400">@{friend.user.username}</p>
                        <p className="text-xs text-zinc-500 mt-1">{friend.user.bio}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                        onClick={() => messageFriend(friend.user)}
                      >
                        <div className="flex items-center">
                          <MessageCircle size={16} className="mr-1" /> Message
                        </div>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeFriend(friend.id)}
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
                        {request.user.avatar ? (
                          <img 
                            src={request.user.avatar} 
                            alt={request.user.first_name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                            {request.user.first_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{request.user.last_name} {request.user.first_name}</p>
                        <p className="text-sm text-zinc-400">@{request.user.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="bg-green-500 hover:bg-green-600 text-black" 
                        size="sm"
                        onClick={() => acceptFriendRequest(request.id)}
                      >
                        <UserCheck size={16} className="mr-1" /> Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => rejectFriendRequest(request.id)}
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
                        {request.user?.avatar ? (
                          <img 
                            src={request.user?.avatar} 
                            alt={request.user?.first_name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                            {request.user?.first_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{request.user?.last_name} {request.user?.first_name}</p>
                        <p className="text-sm text-zinc-400">@{request.user?.username}</p>
                      </div>
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => cancelFriendRequest(request.id)}
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
                <Button
                  className="absolute right-0 top-0"
                  onClick={() => fetchFilteredUsers()}
                >
                  <Search className="mr-1" />
                </Button>
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
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.first_name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                              {user.first_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
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
