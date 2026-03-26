import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});


apiClient.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`❌ API Error: ${error.response.status} - ${error.response.data?.message || error.message}`);
        } else if (error.request) {
            console.error('❌ No response from server. Make sure backend is running on port 7000');
        } else {
            console.error('❌ Request error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;