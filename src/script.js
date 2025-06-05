import { getCurrentUser, createLoginForm, logout } from "./utils/auth.js"
import { getChats, updateChat } from "./utils/api.js"
import { showToast } from "./utils/toast.js"

let chats = []
let currentChat = null

document.addEventListener("DOMContentLoaded", () => {
  console.log("Application démarrée")
  initApp()
})

async function initApp() {
  const mainContainer = document.querySelector(".flex.h-screen")
  const loginContainer = document.getElementById("loginContainer")

  // Vérifier l'utilisateur connecté
  const currentUser = getCurrentUser()

  if (!currentUser) {
    console.log("Aucun utilisateur connecté")
    showLoginForm()
  } else {
    console.log("Utilisateur connecté:", currentUser.name)
    showMainApp()
  }

  function showLoginForm() {
    mainContainer.style.display = "none"
    loginContainer.style.display = "block"
    loginContainer.innerHTML = ""

    const loginForm = createLoginForm((user) => {
      console.log("Connexion réussie pour:", user.name)
      showMainApp()
    })

    loginContainer.appendChild(loginForm)
  }

  function showMainApp() {
    loginContainer.style.display = "none"
    mainContainer.style.display = "flex"
    initMainInterface()
  }
}

async function initMainInterface() {
  try {
    await loadChats()
    setupEventListeners()
    updateUserAvatar()
    showWelcomeMessage()
    console.log("Interface principale initialisée")
  } catch (error) {
    console.error("Erreur initialisation:", error)
    showToast("Erreur de chargement", "error")
  }
}

async function loadChats() {
  try {
    chats = await getChats()
    renderChatList()
  } catch (error) {
    console.error("Erreur chargement chats:", error)
    showToast("Impossible de charger les conversations", "error")
  }
}

function setupEventListeners() {
  // Avatar utilisateur pour ouvrir le profil
  const userAvatarButton = document.getElementById("userAvatarButton")
  if (userAvatarButton) {
    userAvatarButton.addEventListener("click", showProfile)
  }

  // Bouton retour du profil
  const backToChats = document.getElementById("backToChats")
  if (backToChats) {
    backToChats.addEventListener("click", hideProfile)
  }

  // Bouton de déconnexion dans le profil
  const logoutButton = document.getElementById("logoutButton")
  if (logoutButton) {
    logoutButton.addEventListener("click", logout)
  }

  // Bouton retour
  const backButton = document.getElementById("backButton")
  if (backButton) {
    backButton.addEventListener("click", handleBackButton)
  }

  // Input de message
  setupMessageInput()

  // Navigation
  setupNavigation()

  // Responsive
  window.addEventListener("resize", handleResize)
}

function showProfile() {
  const sidebar = document.getElementById("sidebar")
  const profilePanel = document.getElementById("profilePanel")
  const chatArea = document.getElementById("chatArea")

  // Cacher la sidebar et la zone de chat
  sidebar.style.display = "none"
  chatArea.style.display = "none"

  // Afficher le panneau de profil
  profilePanel.style.display = "flex"

  // Mettre à jour les informations du profil
  updateProfileInfo()
}

function hideProfile() {
  const sidebar = document.getElementById("sidebar")
  const profilePanel = document.getElementById("profilePanel")
  const chatArea = document.getElementById("chatArea")

  // Cacher le panneau de profil
  profilePanel.style.display = "none"

  // Réafficher la sidebar
  sidebar.style.display = "flex"

  // Réafficher la zone de chat si un chat était ouvert
  if (currentChat) {
    chatArea.style.display = "flex"
  }
}

function updateProfileInfo() {
  const currentUser = getCurrentUser()
  if (currentUser) {
    const profileImage = document.getElementById("profileImage")
    const profileName = document.getElementById("profileName")

    if (profileImage) {
      profileImage.src = currentUser.avatar
      profileImage.alt = currentUser.name
    }

    if (profileName) {
      profileName.textContent = currentUser.name
    }
  }
}

function updateUserAvatar() {
  const currentUser = getCurrentUser()
  const userAvatars = document.querySelectorAll(".user-avatar img")

  if (currentUser && userAvatars.length > 0) {
    userAvatars.forEach((avatar) => {
      avatar.src = currentUser.avatar
      avatar.alt = currentUser.name
    })
  }
}

function showWelcomeMessage() {
  const messagesArea = document.getElementById("messagesArea")
  if (messagesArea) {
    messagesArea.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <div class="text-8xl mb-4 opacity-30">
                        <i class="fab fa-whatsapp text-green-500"></i>
                    </div>
                    <h2 class="text-3xl mb-4 font-light">WhatsApp Web</h2>
                    <p class="text-gray-400 mb-2">Sélectionnez une conversation pour commencer</p>
                    <div class="mt-8 flex justify-center">
                        <div class="flex items-center text-gray-500 text-sm">
                            <i class="fas fa-lock mr-2"></i>
                            <span>Vos messages sont chiffrés de bout en bout</span>
                        </div>
                    </div>
                </div>
            </div>
        `
  }
}

function renderChatList() {
  const chatList = document.getElementById("chatList")
  if (!chatList) return

  const currentUser = getCurrentUser()
  if (!currentUser) return

  chatList.innerHTML = ""

  // Filtrer les chats (exclure l'utilisateur actuel)
  const filteredChats = chats.filter((chat) => chat.id !== currentUser.id)

  filteredChats.forEach((chat) => {
    const chatItem = createChatItem(chat)
    chatList.appendChild(chatItem)
  })
}

function createChatItem(chat) {
  const chatItem = document.createElement("div")
  chatItem.className =
    "chat-item px-4 py-3 cursor-pointer hover:bg-[#202c33] transition-colors border-b border-gray-700"
  chatItem.dataset.chatId = chat.id

  const hasUnread = chat.unread > 0

  chatItem.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="relative">
                <img src="${chat.avatar}" alt="${chat.name}" class="w-12 h-12 rounded-full object-cover">
                ${chat.isOnline ? '<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>' : ""}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                    <h3 class="font-medium text-white truncate ${hasUnread ? "font-semibold" : ""}">${chat.name}</h3>
                    <div class="flex flex-col items-end space-y-1">
                        <span class="text-xs ${hasUnread ? "text-green-400" : "text-gray-400"}">${chat.time}</span>
                        ${hasUnread ? `<span class="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">${chat.unread}</span>` : ""}
                    </div>
                </div>
                <div class="mt-1">
                    <p class="text-sm ${hasUnread ? "text-white font-medium" : "text-gray-400"} truncate">${chat.lastMessage}</p>
                </div>
            </div>
        </div>
    `

  chatItem.addEventListener("click", () => openChat(chat.id))

  return chatItem
}

function openChat(chatId) {
  // Cacher le profil s'il est ouvert
  hideProfile()

  currentChat = chats.find((chat) => chat.id === chatId)
  if (!currentChat) return

  // Marquer comme lu
  currentChat.unread = 0

  // Mise à jour visuelle
  document.querySelectorAll(".chat-item").forEach((item) => {
    item.classList.remove("bg-[#202c33]")
  })
  document.querySelector(`[data-chat-id="${chatId}"]`)?.classList.add("bg-[#202c33]")

  // Responsive
  if (isMobile()) {
    document.getElementById("sidebar").style.display = "none"
    document.getElementById("chatArea").style.display = "flex"
  } else {
    document.getElementById("chatArea").style.display = "flex"
  }

  showChatHeader()
  renderMessages()
  showMessageInput()
  renderChatList() // Mettre à jour la liste pour enlever le badge
}

function showChatHeader() {
  const chatHeader = document.getElementById("chatHeader")
  const chatAvatar = document.getElementById("chatAvatar")
  const chatName = document.getElementById("chatName")
  const chatStatus = document.getElementById("chatStatus")

  if (chatHeader && currentChat) {
    chatHeader.style.display = "flex"
    chatAvatar.innerHTML = `<img src="${currentChat.avatar}" alt="${currentChat.name}" class="w-10 h-10 rounded-full object-cover">`
    chatName.textContent = currentChat.name
    chatStatus.textContent = currentChat.status
  }
}

function renderMessages() {
  const messagesArea = document.getElementById("messagesArea")
  if (!messagesArea || !currentChat) return

  messagesArea.innerHTML = ""

  currentChat.messages.forEach((message) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = `flex mb-4 ${message.sent ? "justify-end" : "justify-start"}`

    messageDiv.innerHTML = `
            <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sent ? "bg-[#005c4b] text-white" : "bg-[#202c33] text-white"
            } shadow-md">
                <p class="text-sm">${message.text}</p>
                <div class="flex justify-end items-center mt-1 space-x-1">
                    <span class="text-xs text-gray-300">${message.time}</span>
                    ${message.sent ? '<i class="fas fa-check-double text-xs text-blue-400"></i>' : ""}
                </div>
            </div>
        `

    messagesArea.appendChild(messageDiv)
  })

  messagesArea.scrollTop = messagesArea.scrollHeight
}

function showMessageInput() {
  const messageInput = document.getElementById("messageInput")
  if (messageInput) {
    messageInput.style.display = "flex"
  }
}

function setupMessageInput() {
  const messageText = document.getElementById("messageText")
  const sendButton = document.getElementById("sendButton")

  if (!messageText || !sendButton) return

  async function sendMessage() {
    const text = messageText.value.trim()
    if (!text || !currentChat) return

    const newMessage = {
      id: currentChat.messages.length + 1,
      text: text,
      sent: true,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }

    currentChat.messages.push(newMessage)
    currentChat.lastMessage = text
    currentChat.time = newMessage.time

    try {
      await updateChat(currentChat)
      renderMessages()
      renderChatList()
      messageText.value = ""

      // Simuler une réponse
      setTimeout(() => simulateResponse(), 1000 + Math.random() * 2000)
    } catch (error) {
      console.error("Erreur envoi message:", error)
      showToast("Erreur lors de l'envoi", "error")
    }
  }

  sendButton.addEventListener("click", sendMessage)
  messageText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })
}

async function simulateResponse() {
  if (!currentChat) return

  const responses = [
    "Yeh frere mangui cool bou bax et toi naka sa journée leep diam !",
    "Damay def travail bi",
    "🔥oui nice ni ca fait un bail nka war",
    "Salut bro",
    "Merci frère",
  ]

  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

  const responseMessage = {
    id: currentChat.messages.length + 1,
    text: randomResponse,
    sent: false,
    time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  }

  currentChat.messages.push(responseMessage)
  currentChat.lastMessage = randomResponse
  currentChat.time = responseMessage.time

  try {
    await updateChat(currentChat)
    renderMessages()
    renderChatList()
  } catch (error) {
    console.error("Erreur simulation réponse:", error)
  }
}

function handleBackButton() {
  if (isMobile()) {
    document.getElementById("sidebar").style.display = "flex"
    document.getElementById("chatArea").style.display = "none"
  }

  currentChat = null
  document.getElementById("chatHeader").style.display = "none"
  document.getElementById("messageInput").style.display = "none"
  showWelcomeMessage()
}

function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const view = item.dataset.view
      console.log("Navigation vers:", view)
      // Ajouter la logique de navigation ici si nécessaire
    })
  })
}

function handleResize() {
  if (!isMobile() && currentChat) {
    document.getElementById("sidebar").style.display = "flex"
    document.getElementById("chatArea").style.display = "flex"
  }
}

function isMobile() {
  return window.innerWidth < 768
}
