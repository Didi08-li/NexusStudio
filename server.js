const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

const corsOptions = {
    origin: '*',  // Autorise toutes les origines (pour le test)
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// ========================================
// CONNEXION À POSTGRESQL
// ========================================
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nexusstudio',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Tester la connexion
(async () => {
    try {
        await pool.query('SELECT 1 + 1 AS result');
        console.log('✅ Connecté à PostgreSQL');
    } catch (error) {
        console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    }
})();

// ========================================
// CRÉER LA TABLE SI ELLE N'EXISTE PAS
// ========================================
(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                sujet VARCHAR(200) DEFAULT 'Non spécifié',
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table messages créée/vérifiée');
    } catch (error) {
        console.error('❌ Erreur création table:', error.message);
    }
})();

// ========================================
// ROUTES
// ========================================

// GET - Récupérer tous les messages
app.get('/api/messages', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM messages ORDER BY date_creation DESC'
        );
        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
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
        const result = await pool.query(
            'SELECT * FROM messages WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Message non trouvé'
            });
        }
        res.status(200).json({
            success: true,
            data: result.rows[0]
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
        
        const result = await pool.query(
            'INSERT INTO messages (nom, email, message, sujet) VALUES ($1, $2, $3, $4) RETURNING *',
            [nom, email, message, sujet || 'Non spécifié']
        );
        
        res.status(201).json({
            success: true,
            data: result.rows[0]
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
        const result = await pool.query(
            'DELETE FROM messages WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
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

// Route 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée'
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📝 API Messages : http://localhost:${PORT}/api/messages`);
    console.log(`🐬 Base de données : PostgreSQL`);
});