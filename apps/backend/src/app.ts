import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes         from './modules/auth/auth.routes';
import currencyRoutes     from './modules/currencies/currency.routes';
import languageRoutes     from './modules/languages/language.routes';
import subscriptionRoutes from './modules/subscriptions/subscription.routes';
import articleRoutes      from './modules/articles/article.routes';
import watchlistRoutes from './modules/watchlist/watchlist.routes';

const app = express();

app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth (JWT + 2FA + reset password...)
app.use('/api/auth', authRoutes);

// Données de référence — publiques
app.use('/api/currencies',    currencyRoutes);
app.use('/api/languages',     languageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Flux RSS — protégé
app.use('/api/articles', articleRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use(errorHandler);

export default app;
