import { api } from '../config/api';
import { Artist } from '@/types/artist';

export class ArtistService {
    static async getArtists(): Promise<Artist[]> {
        try
        {
            const response = await api.get('artists/')
            console.log('ArtistService.getArtists response:', response.data);
            // Đảm bảo trả về một mảng
            const artists = Array.isArray(response.data) ? response.data : 
                          (response.data.results ? response.data.results : []);
            return artists;
        }
        catch (error)
        {
            console.error('Get artist error:', error)
            throw new Error('Lấy danh sách Artist thất bại');
        }
    }

    static async searchArtist(query: string): Promise<Artist[]> {
        try {
            const response = await api.get(`artists/?search=${query}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to search artists');
        }
    }

    static async getArtistById(id: number): Promise<Artist> {
        try {
            const response = await api.get(`artists/${id}/`)
            return response.data
        } catch (error) {
            console.error('Get artist by id error:', error)
            throw new Error('Lấy thông tin Artist thất bại');
        }
    }

    static async followedArtist(): Promise<Artist[]> {
        try {
            const response = await api.get('artists/followed/')
            return response.data
        }
        catch (error) {
            console.error('Followed artist error:', error)
            throw new Error('Lỗi khi theo dõi Artist');
        }
    }
    
    static async followArtist(artistId: number): Promise<void> {
        try {
            await api.post(`artists/${artistId}/follow/`)
        } catch (error) {
            console.error('Follow artist error:', error)
            throw new Error('Lỗi khi theo dõi Artist');
        }
    }

    static async unfollowArtist(artistId: number): Promise<void> {
        try {
            await api.delete(`artists/${artistId}/unfollow/`)
        } catch (error) {
            console.error('Unfollow artist error:', error)
            throw new Error('Lỗi khi bỏ theo dõi Artist');
        }
    }

    static async isFollowingArtist(artistId: number): Promise<boolean> {
        try {
            const response = await api.get(`artists/${artistId}/is-following/`)
            return response.data.isFollowing
        } catch (error) {
            console.error('Is following artist error:', error)
            throw new Error('Lỗi khi kiểm tra đã theo dõi Artist');
        }
    }
}