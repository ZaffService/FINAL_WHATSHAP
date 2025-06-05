const API_URL = 'https://whatshap-backend.onrender.com';
const USER_KEY = 'whatsapp_user';

export const api = {
    async login(phone) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            if (!response.ok) {
                throw new Error('Échec connexion');
            }

            const user = await response.json();
            // Stocker l'utilisateur après connexion réussie
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Erreur login:', error);
            throw error;
        }
    },

    async getChats() {
        try {
            const userStr = localStorage.getItem(USER_KEY);
            if (!userStr) {
                throw new Error('Utilisateur non connecté');
            }

            const user = JSON.parse(userStr);
            const response = await fetch(`${API_URL}/chats`, {
                headers: {
                    'Authorization': user.id,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                // Si non autorisé, nettoyer le stockage local
                localStorage.removeItem(USER_KEY);
                window.location.href = '/login.html';
                throw new Error('Session expirée');
            }

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur getChats:', error);
            throw error;
        }
    },

    isAuthenticated() {
        const user = localStorage.getItem(USER_KEY);
        return !!user;
    },

    getUser() {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }
};