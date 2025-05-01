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
      const response = await api.post('/users/send-request/', { username });
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }

  static async respondFriendRequest(username: string, status: string) {
    try {
      const response = await api.post('/users/respond-request/', { username, status });
      return response.data;
    } catch (error) {
      console.error('Error responding friend request:', error);
      throw error;
    }
  }

  static async removeFriend(username: string) {
    try {
      const response = await api.delete(`/users/remove-friend/${username}/`);
      return response.data;
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }
}
  
