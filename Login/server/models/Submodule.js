import mongoose from 'mongoose';
import { ExerciseSchema } from './Exercise.js';

export const SubmoduleSchema = new mongoose.Schema({
    nombre: String,
    nota: { type: Number, default: 0 }, // Promedio de ejercicios
    ejercicios: [ExerciseSchema]
  }, { _id: false });
  