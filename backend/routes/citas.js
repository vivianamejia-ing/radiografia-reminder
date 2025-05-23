const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const enviarCorreo = require('../mailer'); // :apuntando_hacia_la_izquierda: Importamos la función
// Crear una cita
router.post('/', async (req, res) => {
  const { nombrePaciente, correoPaciente, fecha } = req.body;
  try {
    // Guardar la cita en MongoDB
    const nuevaCita = new Cita({ nombrePaciente, correoPaciente, fecha });
    await nuevaCita.save();
    // Enviar correo de recordatorio
    console.log("correo del paciente:", correoPaciente)
    await enviarCorreo(
      correoPaciente,
      'Recordatorio de cita',
      `Hola ${nombrePaciente}, tu cita está agendada para el ${fecha}.`
    );
    console.log(':marca_de_verificación_blanca: Cita guardada y correo enviado');
    res.send('Cita guardada y correo enviado');
  } catch (error) {
    console.error(':x: Error al guardar cita o enviar correo:', error);
    res.status(500).send('Error al guardar cita o enviar correo');
  }
});
// Obtener todas las citas
router.get('/', async (req, res) => {
  const citas = await Cita.find();
  res.json(citas);
});
module.exports = router;