// src/services/authService.ts
import { api } from '../config/api';
import { TokenService } from './TokenService';
import { User } from '../types/user';

export class AuthService {
  static async login(username: string, password: string): Promise<User> {
    try {
      const response = await api.post('/users/login/', {
        username,
        password,
      });

      const token = response.data.access;
      TokenService.saveToken(token);

      const userRes = await api.get('/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userRes.data;
      TokenService.saveUser(user);

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Đăng nhập thất bại');
    }
  }

  static async refreshToken(): Promise<string> {
    const refreshToken = TokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Không tìm thấy refresh token');
    }

    try {
      const response = await api.post('/token/refresh/', {
        refresh: refreshToken,
      });

      const token = response.data.access;
      TokenService.saveToken(token);
      return token;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new Error('Làm mới token thất bại');
    }
  }

  static logout() {
    TokenService.clear();
  }

  static getCurrentUser(): User | null {
    return TokenService.getUser();
  }

  static isAuthenticated(): boolean {
    return !!TokenService.getToken();
  }

  static 
}
