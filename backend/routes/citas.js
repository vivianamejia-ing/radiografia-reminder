const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const enviarCorreo = require('../mailer');

// Middleware para loggear las solicitudes entrantes
router.use((req, res, next) => {
  console.log('Body recibido:', req.body);
  console.log('Headers:', req.headers);
  next();
});

// Crear una cita
router.post('/', async (req, res) => {
  // Extraer datos del cuerpo de la solicitud
  const { nombrePaciente, correoPaciente, fecha } = req.body;

  console.log('Datos recibidos:', { nombrePaciente, correoPaciente, fecha });

  // Validaciones
  if (!nombrePaciente || typeof nombrePaciente !== 'string') {
    return res.status(400).json({ error: 'Nombre del paciente es requerido y debe ser texto' });
  }

  if (!correoPaciente || typeof correoPaciente !== 'string') {
    return res.status(400).json({ 
      error: 'Correo electrónico es requerido y debe ser texto',
      receivedData: req.body // Para debug
    });
  }

  if (!fecha || typeof fecha !== 'string') {
    return res.status(400).json({ error: 'Fecha es requerida y debe ser texto' });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correoPaciente)) {
    return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
  }

  try {
    // Crear y guardar la cita
    const nuevaCita = new Cita({
      nombrePaciente: nombrePaciente.trim(),
      correoPaciente: correoPaciente.trim(),
      fecha: fecha.trim()
    });

    await nuevaCita.save();

    // Respuesta inmediata y envío de correo en segundo plano
    res.status(201).json({
      success: true,
      message: 'Cita agendada exitosamente',
      cita: nuevaCita
    });

    // Intentar enviar el correo después de responder (no bloqueante)
    enviarCorreo(
      correoPaciente.trim(),
      'Confirmación de Cita',
      `Hola ${nombrePaciente.trim()},\n\nTu cita ha sido agendada para el ${fecha.trim()}.\n\nGracias por confiar en nosotros.`
    )
    .then(() => console.log('Correo enviado exitosamente'))
    .catch(emailError => console.warn('El correo no pudo ser enviado:', emailError));

  } catch (error) {
    console.error('Error completo al agendar cita:', {
      message: error.message,
      stack: error.stack,
      receivedBody: req.body
    });
    
    res.status(500).json({
      success: false,
      error: 'Error interno al agendar la cita',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Contacte al administrador'
    });
  }
});

// Resto del código...
module.exports = router;