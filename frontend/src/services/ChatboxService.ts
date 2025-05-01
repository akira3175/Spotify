import { Chatbox, Message } from '@/types/chat';
import { api } from '../config/api';

export class ChatboxService {
  static async getChatboxes() {
    const response = await api.get('/chatbox/');
    return response.data;
  }

  static async createChatbox(chatbox: Chatbox) {
    try {
      const response = await api.post('/chatbox/', chatbox);
      return response.data;
    } catch (error) {
      console.error('Error creating chatbox:', error);
      throw error;
    }
  }

  static async getMessages(id: number) {
    try {
      const response = await api.get(`/chatbox/${id}/messages/`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  static async sendMessage(id: number, message: Message) {
    try {
      const response = await api.post(`/chatbox/${id}/messages/`, message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
