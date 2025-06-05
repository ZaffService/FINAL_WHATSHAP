const USER_KEY = 'whatsapp_user';

export const auth = {
    getUser() {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getAuthHeaders() {
        const user = this.getUser();
        return user ? { 'Authorization': user.id } : {};
    },

    logout() {
        localStorage.removeItem(USER_KEY);
    }
};