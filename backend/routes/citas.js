const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const enviarCorreo = require('../mailer');

// Crear una cita
router.post('/', async (req, res) => {
  const { nombrePaciente, correoPaciente, fecha } = req.body;

  // Validación básica de los datos de entrada
  if (!nombrePaciente || !correoPaciente || !fecha) {
    return res.status(400).send('Faltan datos requeridos');
  }

  try {
    // Guardar la cita en MongoDB
    const nuevaCita = new Cita({ nombrePaciente, correoPaciente, fecha });
    await nuevaCita.save();

    console.log("Correo del paciente:", correoPaciente);
    
    // Enviar correo de recordatorio con manejo de errores específico
    try {
      await enviarCorreo(
        correoPaciente,
        'Recordatorio de cita',
        `Hola ${nombrePaciente}, tu cita está agendada para el ${fecha}.`
      );
      console.log('✅ Correo enviado exitosamente');
    } catch (emailError) {
      console.error('⚠️ Cita guardada pero falló el envío de correo:', emailError);
      // No detenemos el proceso aunque falle el correo
    }

    console.log('✅ Cita guardada exitosamente');
    res.status(201).json({
      message: 'Cita creada exitosamente',
      cita: nuevaCita,
      emailEnviado: !emailError
    });
  } catch (error) {
    console.error('❌ Error al procesar la cita:', error);
    res.status(500).json({
      error: 'Error al procesar la cita',
      details: error.message
    });
  }
});

// Obtener todas las citas
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json(citas);
  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

module.exports = router;


