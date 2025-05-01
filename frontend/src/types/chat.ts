import { User } from "./user";

export interface Chatbox {
    id: number;
    name: string;
    members: User[];
    created_at: string;
    type: string;
}

export interface Message {
    id: number;
    message: string;
    created_at: string;
    user: User;
    [key: string]: any;
}

export interface ChatboxMember {
    id: number;
    chatbox: Chatbox;
    user: User;
    is_admin: boolean;
}

