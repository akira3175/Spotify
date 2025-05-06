import { api } from '../config/api';
import { Song } from '@/types/song';

export class SongService {
    static async getSong(): Promise<Song>{
    try
    {
        const response = await api.get('songs/')
        return response.data
    }
    catch (error)
    {
        console.error('Get song error:', error)
        throw new Error('Lấy danh sách Song thất bại');
    }
    }

    static async getSongById(id: number): Promise<Song> {
        try {
            const response = await api.get(`songs/${id}/`)
            return response.data
        } catch (error) {
            console.error('Get song by id error:', error)
            throw new Error('Lấy thông tin Song thất bại');
        }
    }
}