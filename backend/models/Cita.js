const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  fecha: String
});

module.exports = mongoose.model('Cita', citaSchema);
