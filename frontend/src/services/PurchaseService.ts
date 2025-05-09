import { Song } from '@/types/music';
import { api } from '../config/api';
import { Order } from '@/types/purchase';

export class PurchaseService {
    static async getOrders(): Promise<Order[]> {
        try {
            const response = await api.get('/orders/');
            return response.data;
        } catch (error) {
            console.error('Get orders error:', error);
            throw new Error('Lấy danh sách đơn hàng thất bại');
        }
    }

    static async getOrder(id: number): Promise<Order> {
        try {
            const response = await api.get(`/orders/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Get order error:', error);
            throw new Error('Lấy thông tin đơn hàng thất bại');
        }
    }

    static async createOrder(song: Song): Promise<Order> {
        try {
            const order = {
                song: song.id,
                date_buy: new Date().toISOString(),
                price: song.price,
                has_paid: false
            }
            const response = await api.post('/orders/', order);
            return response.data;
        } catch (error) {
            console.error('Create order error:', error);
            throw new Error('Tạo đơn hàng thất bại');
        }
    }   

    static async checkSongPaid(songId: number): Promise<boolean> {
        try {
            const response = await api.get(`/orders/check-song-paid/${songId}/`);
            return response.data.has_paid === true;  
        } catch (error) {
            console.error('Check song paid error:', error);
            new Error('Kiểm tra đơn hàng thất bại');
            return false;
        }
    }
}


