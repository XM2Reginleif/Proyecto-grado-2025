import mongoose from 'mongoose';

export const SubexerciseSchema = new mongoose.Schema({
  nombre: String,
  nota: { type: Number, default: 0 },
  intentos_restantes: { type: Number, default: 3 },
  ultimo_intento: { type: Date, default: null }
}, { _id: false });
