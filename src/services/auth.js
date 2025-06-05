const USER_KEY = 'whatsapp_user';

export const auth = {
    getUser() {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.updateUI(user);
    },

    logout() {
        localStorage.removeItem(USER_KEY);
        window.location.reload();
    },

    updateUI(user) {
        const mainContainer = document.querySelector('.flex.h-screen');
        const loginContainer = document.getElementById('loginContainer');
        
        if (user) {
            loginContainer.style.display = 'none';
            mainContainer.style.display = 'flex';
            this.updateAvatar(user);
        } else {
            loginContainer.style.display = 'block';
            mainContainer.style.display = 'none';
        }
    },

    updateAvatar(user) {
        const avatars = document.querySelectorAll('.user-avatar img');
        avatars.forEach(avatar => {
            if (avatar && user.avatar) {
                avatar.src = user.avatar;
                avatar.alt = user.name;
            }
        });
    }
};