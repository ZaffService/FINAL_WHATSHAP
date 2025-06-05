const API_URL = import.meta.env.VITE_API_URL;

export const auth = {
    user: null,

    async login(phone) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            if (!response.ok) throw new Error('Erreur de connexion');

            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            this.user = user;
            return user;

        } catch (error) {
            console.error('Erreur login:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('user');
        this.user = null;
    },

    getCurrentUser() {
        if (!this.user) {
            const stored = localStorage.getItem('user');
            if (stored) this.user = JSON.parse(stored);
        }
        return this.user;
    },

    getAuthHeaders() {
        const user = this.getCurrentUser();
        return user ? { 'Authorization': user.id } : {};
    }
};