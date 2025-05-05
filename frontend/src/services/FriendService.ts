import { User } from '@/types/user';
import { api } from '../config/api';
import { Friend } from '@/types/friend';
export class FriendService {
  static async getFriends(): Promise<Friend[]> {
    try {
      const response = await api.get('/users/friends/');
      return response.data;
    } catch (error) {
      console.error('Error getting friends:', error);
      throw error;
    }
  }

  static async getPendingRequests(): Promise<Friend[]> {
    try {
      const response = await api.get('/users/pending-requests/');
      return response.data;
    } catch (error) {
      console.error('Error getting pending requests:', error);
      throw error;
    }
  }

  static async getSentRequests(): Promise<Friend[]> {
    try {
      const response = await api.get('/users/sent-requests/');
      return response.data;
    } catch (error) {
      console.error('Error getting sent requests:', error);
      throw error;
    }
  }
  

  static async sendFriendRequest(username: string) {
    try {
      const response = await api.post('/users/send-request/', { user2: username });
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }

  static async respondFriendRequest(friendRequestID: number, action: string) {
    console.log(friendRequestID, action);
    try {
      const response = await api.put(`/users/respond-request/${friendRequestID}/`, { action: action });
      return response.data;
    } catch (error) {
      console.error('Error responding friend request:', error);
      throw error;
    }
  }

  static async cancelFriendRequest(friendRequestID: number) {
    try {
      const response = await api.delete(`/users/cancel-request/${friendRequestID}/`);
      return response.data;
    } catch (error) {
      console.error('Error canceling friend request:', error);
      throw error;
    }
  }

  static async removeFriend(friendRequestID: number) {
    try {
      const response = await api.delete(`/users/remove-friend/${friendRequestID}/`);
      return response.data;
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }

  static async getUser(keyword: string): Promise<User[]> {
    try {
      const response = await api.get(`/users/?search=${keyword}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
}