const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');

// Crear una cita
router.post('/', async (req, res) => {
  const nuevaCita = new Cita(req.body);
  await nuevaCita.save();
  res.send('Cita guardada');
});

// Obtener todas las citas
router.get('/', async (req, res) => {
  const citas = await Cita.find();
  res.json(citas);
});

module.exports = router;

