import mongoose from 'mongoose';

// Subestructura para cada subejercicio dentro de una categoría
const SubexerciseSchema = new mongoose.Schema({
  nombre: String,
  nota: { type: Number, default: 0 },
  intentos_restantes: { type: Number, default: 3 },
  ultimo_intento: { type: Date, default: null }
}, { _id: false });

// Estructura para la categoría completa (descomposición, algoritmo, otros...)
export const EvaluationCategorySchema = new mongoose.Schema({
  nota: { type: Number, default: 0 }, // Nota promedio de los subejercicios
  ultimo_intento: { type: Date, default: null },
  subejercicios: [SubexerciseSchema]
}, { _id: false });
