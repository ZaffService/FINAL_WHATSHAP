const API_URL = import.meta.env.VITE_API_URL;

const fetchWithAuth = async (url, options = {}) => {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userId || '',
                ...options.headers
            },
            mode: 'cors',
            credentials: 'omit'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const api = {
    async login(phone) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        if (!response.ok) {
            throw new Error('Erreur de connexion');
        }

        const user = await response.json();
        localStorage.setItem('userId', user.id);
        return user;
    },

    async getChats() {
        return fetchWithAuth('/chats');
    },

    async getUser(userId) {
        return fetchWithAuth(`/users/${userId}`);
    },

    async updateChat(chatId, data) {
        return fetchWithAuth(`/chats/${chatId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    async logout() {
        localStorage.removeItem('userId');
    }
};