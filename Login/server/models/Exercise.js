import mongoose from 'mongoose';
import { EvaluationCategorySchema } from './EvaluationCategory.js';

export const ExerciseSchema = new mongoose.Schema({
  nombre: String,
  categorias: {
    descomposicion: EvaluationCategorySchema,
    algoritmo: EvaluationCategorySchema,
    abstraccion: EvaluationCategorySchema,
    generalizacion: EvaluationCategorySchema
  }
}, { _id: false });
