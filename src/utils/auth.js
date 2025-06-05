import { showToast } from "./toast.js"
import { getChats, updateUserStatus } from "./api.js"

let currentUser = null

function checkSession() {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      return user
    } catch (error) {
      console.error("Erreur parsing user:", error)
      localStorage.removeItem("currentUser")
    }
  }
  return null
}

// export function getCurrentUser() {
// const API_URL = "https://whatshap-backend.onrender.com";
//   try {
//     const userStr = localStorage.getItem('user');
//     if (!userStr) return null;
//     return JSON.parse(userStr);
// } catch (error) {
//     console.error("Erreur lors de la récupération de l'utilisateur:", error);
//     return null;
// }
// }

const API_URL = "https://whatshap-backend.onrender.com";

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_URL}/currentUser`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}


export function loginUser(userData) {
    try {
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return false;
    }
}

// Test de connexion avec un utilisateur par défaut
loginUser({
    id: 1,
    name: "Utilisateur Test",
    email: "test@example.com"
});

export function setCurrentUser(user) {
  currentUser = user
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
    updateUserStatus(user.id, "en ligne").catch(console.error)
  } else {
    localStorage.removeItem("currentUser")
  }
}

export async function logout() {
  try {
    console.log("Déconnexion en cours...")
    const user = getCurrentUser()

    if (user) {
      await updateUserStatus(user.id, "hors ligne")
    }

    // Nettoyage
    setCurrentUser(null)

    // Redirection vers login
    window.location.reload()
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    // Forcer la déconnexion même en cas d'erreur
    setCurrentUser(null)
    window.location.reload()
  }
}

export async function login(name, phone) {
  try {
    // Validation
    if (!name || !phone) {
      showToast("Veuillez remplir tous les champs", "error")
      return null
    }

    if (phone.length !== 9 || !/^\d+$/.test(phone)) {
      showToast("Le numéro doit contenir exactement 9 chiffres", "error")
      return null
    }

    // Récupération des utilisateurs
    const users = await getChats()
    const user = users.find(
      (u) => u.name.toLowerCase().trim() === name.toLowerCase().trim() && u.phone.trim() === phone.trim(),
    )

    if (user) {
      setCurrentUser(user)
      showToast(`Bienvenue ${user.name}!`, "success")
      return user
    } else {
      showToast("Nom ou téléphone incorrect", "error")
      return null
    }
  } catch (error) {
    console.error("Erreur de connexion:", error)
    showToast("Erreur de connexion au serveur", "error")
    return null
  }
}

export function createLoginForm(onSuccess) {
  const container = document.createElement("div")
  container.className = "min-h-screen flex items-center justify-center bg-[#111b21] px-4"

  container.innerHTML = `
        <div class="max-w-md w-full bg-[#222e35] rounded-lg shadow-xl p-8">
            <div class="text-center mb-8">
                <div class="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fab fa-whatsapp text-3xl text-white"></i>
                </div>
                <h1 class="text-2xl font-bold text-white mb-2">WhatsApp Web</h1>
                <p class="text-gray-400">Connectez-vous pour continuer</p>
            </div>
            
            <form id="loginForm" class="space-y-4">
                <div>
                    <input 
                        type="text" 
                        id="nameInput"
                        placeholder="Votre nom" 
                        class="w-full px-4 py-3 bg-[#2a3942] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all"
                        required
                    >
                </div>
                
                <div>
                    <input 
                        type="tel" 
                        id="phoneInput"
                        placeholder="Numéro de téléphone (9 chiffres)" 
                        class="w-full px-4 py-3 bg-[#2a3942] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all"
                        maxlength="9"
                        required
                    >
                </div>
                
                <button 
                    type="submit"
                    id="loginButton"
                    class="w-full py-3 bg-[#25D366] hover:bg-[#1ea952] text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Se connecter
                </button>
            </form>
            
            <div class="mt-6 p-4 bg-[#2a3942] rounded-lg">
                <p class="text-sm text-gray-400 mb-2">Comptes de test :</p>
                <div class="space-y-1 text-xs text-gray-500">
                    <div>Zafe - 777867740</div>
                    <div>Abdallah - 778123456</div>
                    <div>Ousmane Marra - 776543210</div>
                </div>
            </div>
        </div>
    `

  // Gestionnaires d'événements
  const form = container.querySelector("#loginForm")
  const nameInput = container.querySelector("#nameInput")
  const phoneInput = container.querySelector("#phoneInput")
  const loginButton = container.querySelector("#loginButton")

  // Validation du téléphone
  phoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "")
  })

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = nameInput.value.trim()
    const phone = phoneInput.value.trim()

    if (!name || !phone) {
      showToast("Veuillez remplir tous les champs", "error")
      return
    }

    loginButton.disabled = true
    loginButton.innerHTML = `
            <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connexion...
            </div>
        `

    try {
      const user = await login(name, phone)

      if (user && onSuccess) {
        onSuccess(user)
      }
    } finally {
      loginButton.disabled = false
      loginButton.textContent = "Se connecter"
    }
  })

  return container
}
