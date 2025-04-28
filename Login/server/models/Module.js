import mongoose from 'mongoose';
import { SubmoduleSchema } from './Submodule.js';

export const ModuleSchema = new mongoose.Schema({
    nombre: String,
    nota: { type: Number, default: 0 }, // Promedio de submódulos
    submodulos: [SubmoduleSchema]
  }, { _id: false });
  