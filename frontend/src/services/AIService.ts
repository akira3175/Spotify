import axios from 'axios';

export interface AIResponse {
    jsonrpc: string;
    result: string;
    id: number;
}

export interface AIError {
    jsonrpc: string;
    error: {
        code: number;
        message: string;
    };
    id: number | null;
}

export class AIService {
    private static instance: AIService;
    private readonly baseUrl: string;
    private messageCache: Map<string, AIResponse>;

    private constructor() {
        this.baseUrl = 'http://127.0.0.1:8000/a2a/jsonrpc/';
        this.messageCache = new Map();
    }

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private getCacheKey(userId: string | number, message: string): string {
        return `${userId}:${message}`;
    }

    public async sendMessage(userId: string | number, message: string): Promise<AIResponse> {
        const cacheKey = this.getCacheKey(userId, message);

        // Check cache first
        const cachedResponse = this.messageCache.get(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }

        try {
            const formData = new FormData();
            formData.append('user_id', userId.toString());
            formData.append('input_text', message);

            const response = await axios.post<AIResponse>(this.baseUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Cache the response
            this.messageCache.set(cacheKey, response.data);
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorResponse = error.response?.data as AIError;
                throw new Error(errorResponse?.error?.message || 'Lỗi không xác định');
            }
            throw error;
        }
    }

    // Clear cache for a specific user
    public clearUserCache(userId: string | number) {
        const userPrefix = `${userId}:`;
        for (const key of this.messageCache.keys()) {
            if (key.startsWith(userPrefix)) {
                this.messageCache.delete(key);
            }
        }
    }

    // Clear all cache
    public clearAllCache() {
        this.messageCache.clear();
    }
} 