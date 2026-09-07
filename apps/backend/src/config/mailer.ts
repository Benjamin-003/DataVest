import { Resend } from 'resend';

// Initialise le client Resend avec la clé API
export const resend = new Resend(process.env['RESEND_API_KEY']);

// Email expéditeur — en développement on utilise celui fourni par Resend
export const FROM_EMAIL = 'onboarding@resend.dev';