// src/service/userService.ts
import apiClient from "../api/apiClient";
import type { User } from "../types";

const BASE = "/api/v1/users";

// GET all users
export const getAllUsers = async (): Promise<User[]> => {
    try {
        console.log(`Fetching users from: ${BASE}`);
        const res = await apiClient.get(BASE);
        console.log('Response data:', res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

// GET by ID
export const getUserById = async (id: string): Promise<User> => {
    try {
        const res = await apiClient.get(`${BASE}/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
};

// CREATE user
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    try {
        const res = await apiClient.post(BASE, user);
        return res.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// UPDATE user
export const updateUser = async (id: string, user: Omit<User, 'id'>): Promise<User> => {
    try {
        const res = await apiClient.put(`${BASE}/${id}`, user);
        return res.data;
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
    }
};

// DELETE user
export const deleteUser = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`${BASE}/${id}`);
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }
};