const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = 3000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(express.json());

// ========================================
// ROUTES
// ========================================

// GET - Récupérer tous les messages
app.get('/api/messages', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM messages ORDER BY date_creation DESC'
        );
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('❌ Erreur GET:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// GET - Récupérer un message par ID
app.get('/api/messages/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM messages WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Message non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('❌ Erreur GET by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// POST - Ajouter un nouveau message
app.post('/api/messages', async (req, res) => {
    try {
        const { nom, email, message, sujet } = req.body;
        
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
        
        // Insertion dans la base
        const [result] = await db.query(
            'INSERT INTO messages (nom, email, message, sujet) VALUES (?, ?, ?, ?)',
            [nom, email, message, sujet || 'Non spécifié']
        );
        
        // Récupérer le message créé
        const [rows] = await db.query(
            'SELECT * FROM messages WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('❌ Erreur POST:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// DELETE - Supprimer un message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM messages WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Message non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Message supprimé'
        });
    } catch (error) {
        console.error('❌ Erreur DELETE:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// ========================================
// ROUTE 404
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
    console.log(`🐬 Base de données : MySQL (Wamp)`);
});