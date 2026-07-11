const mysql = require('mysql2');
require('dotenv').config();

// ========================================
// CONNEXION À MYSQL AVEC WAMP
// ========================================
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',              // ⚠️ Laissez vide si pas de mot de passe
    database: 'nexus_studio',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Tester la connexion
(async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS result');
        console.log('✅ Connecté à MySQL (Wamp)');
        console.log('📦 Base de données : nexus_studio');
    } catch (error) {
        console.error('❌ Erreur de connexion MySQL:', error.message);
        console.log('💡 Vérifiez que Wamp est lancé (icône verte)');
    }
})();

module.exports = promisePool;