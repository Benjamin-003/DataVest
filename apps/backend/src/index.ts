import { config } from './config/env';
import app from './app';
import { prisma } from './prisma/client';

// Fonction principale qui démarre le serveur
const startServer = async () => {
  try {
    // Vérifie que la connexion à la base de données fonctionne
    await prisma.$connect();
    console.log('✅ Database connected');

    // Démarre le serveur Express sur le port défini dans .env
    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📌 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    // Ferme la connexion Prisma proprement avant de quitter
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Gère l'arrêt propre du serveur (ex: Ctrl+C)
// Evite de laisser des connexions ouvertes à la base de données
process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();