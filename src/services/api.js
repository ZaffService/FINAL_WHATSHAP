const API_URL = import.meta.env.VITE_API_URL;

const fetchWithAuth = async (url, options = {}) => {
    const userId = localStorage.getItem('userId');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': userId
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        },
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const api = {
    async getChats() {
        return fetchWithAuth('/chats');
    },

    async getUser(userId) {
        return fetchWithAuth(`/chats/${userId}`);
    },

    async updateChat(chatId, data) {
        return fetchWithAuth(`/chats/${chatId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
};