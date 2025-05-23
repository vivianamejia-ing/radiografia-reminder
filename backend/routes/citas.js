const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const enviarCorreo = require('../mailer');

// Crear una cita
router.post('/', async (req, res) => {
  // Extraer datos del cuerpo de la solicitud
  const { nombrePaciente, correoPaciente, fecha } = req.body;

  // Validaciones
  if (!nombrePaciente || typeof nombrePaciente !== 'string') {
    return res.status(400).json({ error: 'Nombre del paciente es requerido y debe ser texto' });
  }

  if (!correoPaciente || typeof correoPaciente !== 'string') {
    return res.status(400).json({ error: 'Correo electrónico es requerido y debe ser texto' });
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

    // Intentar enviar el correo (pero no fallar si hay error)
    try {
      await enviarCorreo(
        correoPaciente.trim(),
        'Confirmación de Cita',
        `Hola ${nombrePaciente.trim()},\n\nTu cita ha sido agendada para el ${fecha.trim()}.\n\nGracias por confiar en nosotros.`
      );
      console.log('Correo enviado exitosamente');
    } catch (emailError) {
      console.warn('El correo no pudo ser enviado:', emailError);
    }

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Cita agendada exitosamente',
      cita: nuevaCita
    });

  } catch (error) {
    console.error('Error al agendar la cita:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno al agendar la cita',
      details: error.message
    });
  }
});

// Obtener todas las citas
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.find().sort({ fecha: 1 }); // Ordenar por fecha
    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

module.exports = router;