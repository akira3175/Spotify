import { promises } from 'dns';
import { api } from '../config/api';
import { Artist } from '@/types/artist';

export class ArtistService {
    static async getArtists(): Promise <Artist> {
        try
        {
            const response = await api.get('artists/')
            return response.data
        }
        catch (error)
        {
            console.error('Get artist error:', error)
            throw new Error('Lấy danh sách Artist thất bại');
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
}