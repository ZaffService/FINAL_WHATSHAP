const API_URL = import.meta.env.VITE_API_URL;

export const config = {
    API_URL,
    defaultHeaders: {
        'Content-Type': 'application/json'
    }
};