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
// GESTION DU FORMULAIRE DE CONTACT
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

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const nomValid = validateField(nomInput, nomError, nomInput.value.trim().length >= 2);
    if (!nomValid) isValid = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    if (!emailValid) isValid = false;

    const messageValid = validateField(messageInput, messageError, messageInput.value.trim().length >= 10);
    if (!messageValid) isValid = false;

    if (isValid) {
        const formData = {
            nom: nomInput.value.trim(),
            email: emailInput.value.trim(),
            sujet: sujetInput.value.trim() || 'Non spécifié',
            message: messageInput.value.trim()
        };

        console.log('📩 Données du formulaire :', formData);

        contactForm.style.display = 'none';
        confirmationMessage.style.display = 'block';

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
// MODE SOMBRE - DARK MODE
// ========================================

const darkModeToggle = document.getElementById('darkModeToggle');

// Vérifier si l'utilisateur a déjà une préférence
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    icon.className = 'fas fa-sun';
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const icon = darkModeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.setAttribute('aria-label', 'Désactiver le mode sombre');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.setAttribute('aria-label', 'Activer le mode sombre');
    }
});

console.log('🌿 Nexus Studio - Bienvenue !');
console.log('📱 Projet réalisé dans le cadre du Full Stack Project 1 - DecodeLabs 2026');
console.log('🎨 Couleurs 2025 : Mocha Mousse • Ethereal Blue • Moonlit Grey');