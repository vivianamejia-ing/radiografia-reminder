// backend/mailer.js
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('nodemailer/lib/xoauth2');
require('dotenv').config(); // Para usar variables de entorno

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar esto si usas otro correo (hotmail, outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Se lee de tus variables de entorno
    pass: process.env.EMAIL_PASS
  }
});

async function enviarCorreo(destinatario, asunto, mensaje) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: mensaje
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error };
  }
}


module.exports = enviarCorreo;
