export interface User {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    imageUrl?: string;
}

export interface Rental {
    rentalId: number;
    userId: string;
    bookId: number;
    date: string;
    status: string;
    user?: User;
    book?: Book;
}