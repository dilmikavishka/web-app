import apiClient from "../api/apiClient";
import type { Book } from "../types";

const BASE = "/api/v1/books";

// GET all books
export const getAllBooks = async (): Promise<Book[]> => {
    try {
        console.log(`Fetching books from: ${BASE}`);
        const res = await apiClient.get(BASE);
        console.log('Books response:', res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching all books:", error);
        throw error;
    }
};

// GET by ID
export const getBookById = async (id: number): Promise<Book> => {
    try {
        const res = await apiClient.get(`${BASE}/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching book with id ${id}:`, error);
        throw error;
    }
};

// CREATE book
export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
    try {
        const res = await apiClient.post(BASE, book);
        return res.data;
    } catch (error) {
        console.error("Error creating book:", error);
        throw error;
    }
};

// UPDATE book
export const updateBook = async (id: number, book: Omit<Book, 'id'>): Promise<Book> => {
    try {
        const res = await apiClient.put(`${BASE}/${id}`, book);
        return res.data;
    } catch (error) {
        console.error(`Error updating book with id ${id}:`, error);
        throw error;
    }
};

// DELETE book
export const deleteBook = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`${BASE}/${id}`);
    } catch (error) {
        console.error(`Error deleting book with id ${id}:`, error);
        throw error;
    }
};