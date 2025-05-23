const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const enviarCorreo = require('../mailer');

// Crear una cita
router.post('/', async (req, res) => {
  // Extraer y validar datos del cuerpo de la solicitud
  const { nombrePaciente, correoPaciente, fecha } = req.body;

  // Validación exhaustiva de los datos de entrada
  if (!nombrePaciente || !nombrePaciente.trim()) {
    return res.status(400).json({ error: 'El nombre del paciente es requerido' });
  }

  if (!correoPaciente || !correoPaciente.trim()) {
    return res.status(400).json({ error: 'El correo del paciente es requerido' });
  }

  if (!fecha || !fecha.trim()) {
    return res.status(400).json({ error: 'La fecha de la cita es requerida' });
  }

  // Validación básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correoPaciente)) {
    return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
  }

  try {
    // Guardar la cita en MongoDB
    const nuevaCita = new Cita({ 
      nombrePaciente: nombrePaciente.trim(),
      correoPaciente: correoPaciente.trim(),
      fecha: fecha.trim()
    });
    
    await nuevaCita.save();

    console.log("Correo del paciente:", correoPaciente);
    
    // Enviar correo de recordatorio
    try {
      await enviarCorreo(
        correoPaciente.trim(),
        'Recordatorio de cita',
        `Hola ${nombrePaciente.trim()}, tu cita está agendada para el ${fecha.trim()}.`
      );
      console.log('✅ Correo enviado exitosamente');
      
      res.status(201).json({
        success: true,
        message: 'Cita creada y correo enviado exitosamente',
        cita: nuevaCita
      });
    } catch (emailError) {
      console.error('⚠️ Error al enviar el correo:', emailError);
      // Respondemos que la cita se creó pero el correo falló
      res.status(201).json({
        success: true,
        message: 'Cita creada pero falló el envío del correo',
        cita: nuevaCita,
        warning: 'No se pudo enviar el correo de confirmación'
      });
    }
  } catch (dbError) {
    console.error('❌ Error al guardar la cita:', dbError);
    res.status(500).json({
      success: false,
      error: 'Error al guardar la cita',
      details: dbError.message
    });
  }
});

// Resto de tus rutas...
module.exports = router;