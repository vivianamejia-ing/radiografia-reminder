const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const enviarCorreo = require('../mailer'); // 👈 Importamos la función

// Crear una cita
router.post('/', async (req, res) => {
  console.log('📥 Datos recibidos en POST /api/citas:', req.body); // 👈 AÑADE ESTA LÍNEA
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();

    const destinatario = req.body.email;
    const asunto = 'Confirmación de cita';
    const mensaje = `Hola ${req.body.nombre}, tu cita ha sido agendada para el ${req.body.fecha}.`;

    await enviarCorreo(destinatario, asunto, mensaje);

    res.status(200).send('Cita guardada y correo enviado');
  } catch (error) {
    console.error('❌ Error al guardar cita o enviar correo:', error);
    res.status(500).send('Error al guardar cita o enviar correo');
  }
});


module.exports = router;
