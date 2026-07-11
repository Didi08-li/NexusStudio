const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ========================================
// DONNÉES (stockage en mémoire)
// ========================================
let messages = [
    {
        id: 1,
        nom: 'Christine TEKO-AGBO',
        email: 'christine@exemple.com',
        message: 'Super projet !',
        date: new Date().toISOString()
    },
    {
        id: 2,
        nom: 'Damien AGBASSAH',
        email: 'damien@exemple.com',
        message: 'Je recommande cette agence !',
        date: new Date().toISOString()
    }
];

// ========================================
// ROUTES
// ========================================

// GET - Récupérer tous les messages
app.get('/api/messages', (req, res) => {
    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

// GET - Récupérer un message par ID
app.get('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const message = messages.find(m => m.id === id);
    
    if (!message) {
        return res.status(404).json({
            success: false,
            error: 'Message non trouvé'
        });
    }
    
    res.status(200).json({
        success: true,
        data: message
    });
});

// POST - Ajouter un nouveau message
app.post('/api/messages', (req, res) => {
    const { nom, email, message } = req.body;
    
    // Validation
    if (!nom || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Tous les champs sont obligatoires (nom, email, message)'
        });
    }
    
    if (nom.length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Le nom doit contenir au moins 2 caractères'
        });
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({
            success: false,
            error: 'Email invalide'
        });
    }
    
    if (message.length < 10) {
        return res.status(400).json({
            success: false,
            error: 'Le message doit contenir au moins 10 caractères'
        });
    }
    
    // Créer un nouveau message
    const newMessage = {
        id: messages.length + 1,
        nom,
        email,
        message,
        date: new Date().toISOString()
    };
    
    messages.push(newMessage);
    
    res.status(201).json({
        success: true,
        data: newMessage
    });
});

// DELETE - Supprimer un message
app.delete('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = messages.findIndex(m => m.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Message non trouvé'
        });
    }
    
    messages.splice(index, 1);
    
    res.status(200).json({
        success: true,
        message: 'Message supprimé'
    });
});

// ========================================
// ROUTE 404 - Page non trouvée
// ========================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée'
    });
});

// ========================================
// DÉMARRER LE SERVEUR
// ========================================
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📝 API Messages : http://localhost:${PORT}/api/messages`);
});