declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN?: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN?: string;
    CORS_ORIGIN?: string;
    RESEND_API_KEY: string;
    FRONTEND_URL: string;
  }
}