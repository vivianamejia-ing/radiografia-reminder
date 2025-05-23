const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración mejorada del transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Solo para desarrollo, quitar en producción
  }
});

// Función mejorada para enviar correos
async function enviarCorreo(destinatario, asunto, mensaje) {
  // Validación del destinatario
  if (!destinatario || typeof destinatario !== 'string') {
    console.error('Error: Destinatario no válido');
    return { success: false, error: 'Destinatario no válido' };
  }

  const mailOptions = {
    from: `"Sistema de Citas" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    text: mensaje,
    html: `<p>${mensaje.replace(/\n/g, '<br>')}</p>` // Versión HTML
  };

  try {
    // Verificación de la conexión SMTP primero
    await transporter.verify();
    console.log('Servidor SMTP configurado correctamente');

    // Envío del correo
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    console.log('URL de vista previa:', nodemailer.getTestMessageUrl(info));
    
    return { success: true, info };
  } catch (error) {
    console.error('Error detallado al enviar correo:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    return { success: false, error };
  }
}

module.exports = enviarCorreo;