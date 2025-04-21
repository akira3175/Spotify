
import { User } from '../types/user';

// Sample user data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Music enthusiast and vinyl collector. Love discovering new artists and genres.'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    bio: 'Passionate about rock music and electric guitar. Been to over 50 concerts!'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    bio: 'Classical pianist and music theory teacher. Love Mozart and Beethoven.'
  },
  {
    id: '4',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    bio: 'Hip-hop producer and DJ. Always looking for new sounds and beats.'
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    bio: 'Folk singer and songwriter. Inspired by nature and human emotions.'
  }
];

export const TOKEN_KEY = 'spotify_auth_token';
export const USER_KEY = 'spotify_user';

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    // Giả lập API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Tìm user theo email
    const foundUser = sampleUsers.find(u => u.email === email);
    
    if (foundUser) {
      // Lưu thông tin user và token giả
      const token = `mock-jwt-token-${Date.now()}`;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(foundUser));
      return foundUser;
    }
    
    // Nếu không tìm thấy, dùng demo user
    const demoUser = sampleUsers[0];
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    return demoUser;
  }
  
  static async register(name: string, email: string, password: string): Promise<User> {
    // Giả lập API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Tạo user mới
    const newUser: User = {
      id: `${sampleUsers.length + 1}`,
      name: name,
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
      bio: 'New music lover on Spotify. Exploring my favorite tracks!'
    };
    
    // Lưu thông tin user và token giả
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return newUser;
  }
  
  static logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  
  static getCurrentUser(): User | null {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  }
  
  static isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
