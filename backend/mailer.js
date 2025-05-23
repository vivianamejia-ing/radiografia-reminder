// backend/mailer.js
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('nodemailer/lib/xoauth2');
require('dotenv').config(); // Para usar variables de entorno

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar esto si usas otro correo (hotmail, outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER=cuno3235@gmail.com, // Se lee de tus variables de entorno
    pass: process.env.EMAIL_PASS=fbvpjnjleborlfug
  }
});

function enviarCorreo(destinatario, asunto, mensaje) {
  console.log('Enviando correo a:', destinatario); // <-- Agrega esto

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: mensaje
  };

  return transporter.sendMail(mailOptions);
}


module.exports = enviarCorreo;
