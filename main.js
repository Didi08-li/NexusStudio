// ========================================
// MENU BURGER - MOBILE
// ========================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('open')) {
        icon.className = 'fas fa-times';
        menuToggle.setAttribute('aria-expanded', 'true');
    } else {
        icon.className = 'fas fa-bars';
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        icon.className = 'fas fa-bars';
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// ========================================
// SCROLL DOUX POUR LES LIENS ANCRES
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// BOUTON "RETOUR EN HAUT"
// ========================================
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollBtn.setAttribute('aria-label', 'Retour en haut');
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--mocha-mousse, #A67B5B);
    color: var(--moonlit-grey, #F2F0EA);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(62, 45, 30, 0.15);
    z-index: 999;
`;
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.visibility = 'visible';
    } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// ANIMATION D'APPARITION AU SCROLL
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .projet-card, .temoignage').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ========================================
// PROJECT 4 - INTÉGRATION FRONTEND/BACKEND
// ========================================

// Configuration de l'API
const API_URL = 'https://nexusstudio-wo7o.onrender.com/api/messages';

// ========================================
// FONCTIONS API
// ========================================

// 1. Récupérer tous les messages
async function loadMessages() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📩 Messages récupérés:', data);
        return data;
    } catch (error) {
        console.error('❌ Erreur chargement messages:', error);
        return null;
    }
}

// 2. Envoyer un message
async function sendMessage(messageData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Message envoyé:', data);
        return data;
    } catch (error) {
        console.error('❌ Erreur envoi message:', error);
        throw error;
    }
}

// 3. Supprimer un message
async function deleteMessage(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🗑️ Message supprimé:', data);
        return data;
    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        throw error;
    }
}

// ========================================
// AFFICHAGE DES MESSAGES
// ========================================

function displayMessages(messagesData) {
    let messageContainer = document.getElementById('messagesContainer');
    
    if (!messageContainer) {
        messageContainer = document.createElement('section');
        messageContainer.id = 'messagesContainer';
        messageContainer.className = 'messages-section';
        messageContainer.innerHTML = `
            <div class="section-header">
                <span class="badge">Messages reçus</span>
                <h2>💌 Ils nous ont contactés</h2>
                <p>Découvrez les derniers messages envoyés via le formulaire.</p>
            </div>
            <div id="messagesList" class="messages-list"></div>
        `;
        
        const temoignages = document.getElementById('temoignages');
        if (temoignages) {
            temoignages.parentNode.insertBefore(messageContainer, temoignages.nextSibling);
        } else {
            document.querySelector('main').appendChild(messageContainer);
        }
    }
    
    const messagesList = document.getElementById('messagesList');
    
    if (!messagesData || !messagesData.data || messagesData.data.length === 0) {
        messagesList.innerHTML = `
            <div class="empty-messages">
                <div class="empty-icon">📭</div>
                <h3>Aucun message pour le moment</h3>
                <p>Les messages envoyés via le formulaire apparaîtront ici.</p>
                <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.5rem;">
                    Soyez le premier à nous contacter !
                </p>
            </div>
        `;
        return;
    }
    
    messagesList.innerHTML = messagesData.data.map((msg, index) => `
        <div class="message-card" data-id="${msg.id}" style="animation-delay: ${index * 0.1}s">
            <div class="message-card-header">
                <div class="message-user">
                    <div class="message-avatar">
                        ${getInitials(msg.nom)}
                    </div>
                    <div>
                        <strong>${escapeHtml(msg.nom)}</strong>
                        <span class="message-email">${escapeHtml(msg.email)}</span>
                    </div>
                </div>
                <div class="message-actions">
                    <span class="message-date">${formatDate(msg.date_creation)}</span>
                    <button class="delete-btn" onclick="handleDeleteMessage(${msg.id})" aria-label="Supprimer le message" title="Supprimer">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="message-card-body">
                <p>${escapeHtml(msg.message)}</p>
                ${msg.sujet && msg.sujet !== 'Non spécifié' ? `<div class="message-sujet">📌 ${escapeHtml(msg.sujet)}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// ========================================
// UTILITAIRES
// ========================================

function getInitials(nom) {
    if (!nom) return '?';
    const parts = nom.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ========================================
// GESTION DES MESSAGES
// ========================================

async function handleDeleteMessage(id) {
    if (!confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    
    try {
        await deleteMessage(id);
        const messages = await loadMessages();
        if (messages) {
            displayMessages(messages);
        }
    } catch (error) {
        alert('❌ Erreur lors de la suppression du message.');
    }
}

// ========================================
// CONTACT FORM - AVEC API
// ========================================

const contactForm = document.getElementById('contactForm');
const confirmationMessage = document.getElementById('confirmationMessage');
const sendAnotherBtn = document.getElementById('sendAnotherBtn');

const nomInput = document.getElementById('nom');
const emailInput = document.getElementById('email');
const sujetInput = document.getElementById('sujet');
const messageInput = document.getElementById('message');

const nomError = document.getElementById('nomError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// Validation
function validateField(input, errorElement, condition) {
    if (!condition) {
        input.closest('.form-group').classList.add('error');
        errorElement.classList.add('visible');
        return false;
    } else {
        input.closest('.form-group').classList.remove('error');
        errorElement.classList.remove('visible');
        return true;
    }
}

nomInput.addEventListener('blur', () => {
    validateField(nomInput, nomError, nomInput.value.trim().length >= 2);
});

emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
});

messageInput.addEventListener('blur', () => {
    validateField(messageInput, messageError, messageInput.value.trim().length >= 10);
});

// Soumission du formulaire
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    const nomValid = validateField(nomInput, nomError, nomInput.value.trim().length >= 2);
    if (!nomValid) isValid = false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    if (!emailValid) isValid = false;
    
    const messageValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10);
    if (!messageValid) isValid = false;
    
    if (!isValid) return;
    
    const formData = {
        nom: nomInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        sujet: sujetInput.value.trim() || 'Non spécifié'
    };
    
    const submitBtn = contactForm.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
        const result = await sendMessage(formData);
        contactForm.style.display = 'none';
        confirmationMessage.style.display = 'block';
        contactForm.reset();
        
        const messages = await loadMessages();
        if (messages) {
            displayMessages(messages);
        }
        
        console.log('✅ Message envoyé avec succès !');
    } catch (error) {
        alert(`❌ Erreur: ${error.message || 'Impossible d\'envoyer le message.'}`);
        console.error('❌ Erreur:', error);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

sendAnotherBtn.addEventListener('click', () => {
    confirmationMessage.style.display = 'none';
    contactForm.style.display = 'block';
    contactForm.reset();
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.classList.remove('visible');
    });
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// ========================================
// CHARGEMENT INITIAL DES MESSAGES
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📦 Chargement des messages...');
    const messages = await loadMessages();
    if (messages) {
        displayMessages(messages);
    }
});

console.log('🚀 Project 4 - Frontend connecté à l\'API !');
console.log(`📡 API URL: ${API_URL}`);
console.log('🌿 Nexus Studio - Bienvenue !');