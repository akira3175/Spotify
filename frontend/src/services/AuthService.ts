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

  static async register(first_name: string, last_name: string, username: string, password: string): Promise<User> {
    try {
      const response = await api.post('/users/register/', {
        first_name,
        last_name,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Đăng ký thất bại');
    }
  }

  static async refreshToken(): Promise<string> {
    const refreshToken = TokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Không tìm thấy refresh token');
    }

    try {
      const response = await api.post('/users/token/refresh/', {
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

  static async updateUserProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await api.put('/users/update-user/', profileData); // Không set headers
      return response.data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw new Error('Cập nhật thông tin người dùng thất bại');
    }
  }  
}
