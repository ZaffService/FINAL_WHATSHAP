const API_URL = import.meta.env.VITE_API_URL || "https://whatshap-backend.onrender.com";

export async function getChats() {
  try {
    const response = await fetch(`${API_URL}/chats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors"
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur getChats:", error);
    throw error;
  }
}

export async function updateUserStatus(userId, status) {
  try {
    const response = await fetch(`${API_URL}/chats/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, isOnline: status === "en ligne" }),
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur updateUserStatus:", error)
    throw error
  }
}

export async function updateChat(chat) {
  try {
    const response = await fetch(`${API_URL}/chats/${chat.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chat),
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la mise à jour du chat:", error)
    throw error
  }
}
