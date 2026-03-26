import apiClient from "../api/apiClient";
import type { Rental } from "../types";

const BASE = "/api/v1/rentals";

// GET all rentals
export const getAllRentals = async (): Promise<Rental[]> => {
    try {
        console.log(`Fetching rentals from: ${BASE}`);
        const res = await apiClient.get(BASE);
        console.log('Rentals response:', res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching all rentals:", error);
        throw error;
    }
};

// GET by ID
export const getRentalById = async (id: number): Promise<Rental> => {
    try {
        const res = await apiClient.get(`${BASE}/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching rental with id ${id}:`, error);
        throw error;
    }
};

// CREATE rental - Send full data with status and date
export const createRental = async (rental: {
    userId: string;
    bookId: number;
    date?: string;
    status?: string;
}): Promise<Rental> => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const rentalData = {
            userId: rental.userId,
            bookId: rental.bookId,
            date: rental.date || today,
            status: rental.status || "RENTED"
        };

        console.log('Creating rental with data:', rentalData);
        const res = await apiClient.post(BASE, rentalData);
        return res.data;
    } catch (error) {
        console.error("Error creating rental:", error);
        throw error;
    }
};

// UPDATE rental - Send full data with userId, bookId, date, status
export const updateRental = async (id: number, rental: {
    userId: string;
    bookId: number;
    date: string;
    status: string
}): Promise<Rental> => {
    try {
        console.log(`Updating rental ${id} with data:`, rental);
        const res = await apiClient.put(`${BASE}/${id}`, rental);
        return res.data;
    } catch (error) {
        console.error(`Error updating rental with id ${id}:`, error);
        throw error;
    }
};

// DELETE rental
export const deleteRental = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`${BASE}/${id}`);
    } catch (error) {
        console.error(`Error deleting rental with id ${id}:`, error);
        throw error;
    }
};