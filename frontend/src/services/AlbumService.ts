import { api } from '../config/api';
import { Album } from '@/types/album';
export class AlbumService{
    static async getAlbum():Promise<Album>{
        try {
            const response = await api.post('albums/');
            return response.data
        } catch (error) {
            throw new Error("No data")
        }
    }
}