export const TOKEN_KEY = 'spotify_auth_token';
export const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
export const USER_KEY = 'spotify_user';

export const TokenService = {
  saveToken(access: string) {
    localStorage.setItem(TOKEN_KEY, access);
  },
  saveRefreshToken(refresh: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  saveUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser(): any | null {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
