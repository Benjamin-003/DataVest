import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar as keyof NodeJS.ProcessEnv]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const config = {
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  jwt: {
    secret: process.env['JWT_SECRET'] as string,
    expiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] as string,
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '30d',
  },
  cors: {
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
  },
};