const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://karolamejia08:828k505@cluster0.m0tsh8c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const citaRoutes = require('./routes/citas');
app.use('/citas', citaRoutes);

app.get('/', (req, res) => res.send('API funcionando'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto ' + PORT);
});
