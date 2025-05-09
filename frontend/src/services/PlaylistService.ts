import { api } from '../config/api';
import { Playlist } from '../types/playlist';

export class PlaylistService {
    static async getPlaylist(): Promise<Playlist[]> {
        try {
            const response = await api.get('/playlists/');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch playlists');
        }
    }

    static async searchPlaylist(query: string): Promise<Playlist[]> {
        try {
            const response = await api.get(`/playlists/?search=${query}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to search playlists');
        }
    }
    static async getPlaylistById(id: number): Promise<Playlist> {
        try {
            const response = await api.get(`/playlists/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch playlist by id');
        }
    }

    static async createPlaylist(playlist: Playlist): Promise<Playlist> {
        try {
            const response = await api.post('/playlists/', playlist);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create playlist');
        }
    }
    
    static async updatePlaylist(id: number, playlist: Playlist): Promise<Playlist> {
        try {
            const response = await api.put(`/playlists/${id}/`, playlist);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update playlist');
        }
    }
    
    static async deletePlaylist(id: number): Promise<void> {
        try {
            await api.delete(`/playlists/${id}/`);
        } catch (error) {
            throw new Error('Failed to delete playlist');
        }
    }
}
    
