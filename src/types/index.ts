export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    imageUrl?: string;
}

export interface Rental {
    id: number;
    userId: number;
    bookId: string;
    rentDate: string;
    returnDate?: string;
    status?: 'active' | 'returned';
}