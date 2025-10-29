// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\client\src\services\cropService.js

import axios from 'axios';
import { getFlaskURL } from '../config/apiConfig';

export const predictCrop = async (data) => {
    try {
        console.log("Sending data to API:", data);
        const response = await axios.post(getFlaskURL('/api/crops/predict'), data);
        console.log("Received prediction response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error predicting crop:', error);
        console.error('Error details:', error.response?.data || error.message);
        throw error; // Re-throw the error so the component can handle it
    }
};
