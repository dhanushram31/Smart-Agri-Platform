// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\client\src\services\userService.js

import axios from 'axios';
import { getExpressURL } from '../config/apiConfig';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(getExpressURL('/api/users/signup'), userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (userData) => {
    try {
        console.log('Sending login request...');
        console.log(userData);
        const response = await axios.post(getExpressURL('/api/users/login'), userData);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Login failed' };
    }
};



// Function to get user data by ID
export const getUserData = async (userId) => {
    const response = await axios.get(getExpressURL(`/api/users/${userId}`));
    return response.data;
};

// Function to update user data
export const updateUserData = async (userId, userData) => {
    const response = await axios.put(getExpressURL(`/api/users/${userId}`), userData);
    return response.data;
};
