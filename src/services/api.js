import { auth } from './auth';

const API_URL = import.meta.env.VITE_API_URL;

async function fetchApi(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...auth.getAuthHeaders(),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        mode: 'cors'
    });

    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return response.json();
}

export const api = {
    getChats: () => fetchApi('/chats'),
    getUser: (id) => fetchApi(`/users/${id}`),
    updateChat: (id, data) => fetchApi(`/chats/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    })
};