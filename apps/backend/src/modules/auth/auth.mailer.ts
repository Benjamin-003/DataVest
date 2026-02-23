import { resend, FROM_EMAIL } from '../../config/mailer';

// Email de vérification envoyé après l'inscription
const sendVerifyEmail = async (email: string, token: string, firstName: string | null) => {
  const verifyUrl = `${process.env['FRONTEND_URL']}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Vérifiez votre adresse email',
    html: `
      <h2>Bonjour ${firstName || ''} 👋</h2>
      <p>Merci pour votre inscription ! Cliquez sur le lien ci-dessous pour valider votre adresse email.</p>
      <a href="${verifyUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background: #2563eb;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        margin: 16px 0;
      ">Vérifier mon email</a>
      <p>Ce lien expire dans <strong>24 heures</strong>.</p>
      <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
    `,
  });
};

// Email de réinitialisation du mot de passe
const sendResetPasswordEmail = async (email: string, token: string, firstName: string | null) => {
  const resetUrl = `${process.env['FRONTEND_URL']}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <h2>Bonjour ${firstName || ''} 👋</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous.</p>
      <a href="${resetUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background: #2563eb;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        margin: 16px 0;
      ">Réinitialiser mon mot de passe</a>
      <p>Ce lien expire dans <strong>1 heure</strong>.</p>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `,
  });
};

export const authMailer = {
  sendVerifyEmail,
  sendResetPasswordEmail,
};