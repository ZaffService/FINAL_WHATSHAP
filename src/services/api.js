const API_URL = 'https://whatshap-backend.onrender.com';

const auth = {
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    },
    
    logout() {
        localStorage.removeItem('user');
    }
};

const api = {
    async login(phone) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            if (!response.ok) throw new Error('Échec connexion');

            const user = await response.json();
            auth.setUser(user);
            return user;
        } catch (error) {
            console.error('Erreur login:', error);
            throw error;
        }
    },

    async getChats() {
        try {
            const user = auth.getUser();
            const response = await fetch(`${API_URL}/chats`, {
                headers: {
                    'Authorization': user?.id || ''
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    auth.logout();
                    window.location.href = '/login.html';
                    return;
                }
                throw new Error('Erreur chargement chats');
            }

            return response.json();
        } catch (error) {
            console.error('Erreur getChats:', error);
            throw error;
        }
    }
};

// Exportation pour utilisation dans d'autres fichiers
window.api = api;
window.auth = auth;