const express = require('express');
const router = express.Router();
const enviarCorreo = require('../mailer'); // Importamos la función de correo
const Cita = require('../models/Cita');

router.post('/crear', async (req, res) => {
  const { nombrePaciente, correoPaciente, fecha } = req.body;

  try {
    const nuevaCita = new Cita({ nombrePaciente, correoPaciente, fecha });
    await nuevaCita.save(); // Guarda la cita en MongoDB

    // Enviar el correo de recordatorio
    const asunto = 'Recordatorio de cita de radiografía';
    const mensaje = `Hola ${nombrePaciente}, te recordamos que tienes una cita de radiografía el día ${fecha}.`;

    await enviarCorreo(correoPaciente, asunto, mensaje); // ENVÍA el correo

    res.status(200).json({ mensaje: 'Cita creada y correo enviado.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la cita o enviar el correo.', error });
  }
});

module.exports = router;

