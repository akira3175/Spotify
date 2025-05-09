import { User } from "./user";
import { Song } from "./music";

export interface Order {
    id: number;
    user: User;
    song: Song;
    price: number;
    date_buy: Date;
    payment_method: PaymentMethod;
}

export interface PaymentMethod {
    id: number;
    name: string;
}

