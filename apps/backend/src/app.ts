import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import conversionRouter from './modules/conversion/conversion.routes';

const app = express();

// Middleware CORS — autorise le frontend à communiquer avec le backend
// credentials: true permet d'envoyer les cookies et headers d'autorisation
app.use(cors({ origin: config.cors.origin, credentials: true }));

// Middleware qui permet de lire le body des requêtes en JSON
// Sans ça, req.body serait undefined
app.use(express.json());

// Middleware qui permet de lire les données de formulaire HTML
app.use(express.urlencoded({ extended: true }));

// Route de vérification que le serveur tourne
// Utile pour les outils de monitoring et les tests
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Branchement des routes auth sur le préfixe /api/auth
// Toutes les routes de auth.routes.ts seront préfixées par /api/auth
// Ex: /register devient /api/auth/register
app.use('/api/auth', authRoutes);

app.use('/api/conversions', conversionRouter);

// Handler 404 — si aucune route ne correspond à l'URL demandée
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handler d'erreurs global — DOIT être en dernier
// Express le reconnaît grâce aux 4 paramètres
app.use(errorHandler);

export default app;