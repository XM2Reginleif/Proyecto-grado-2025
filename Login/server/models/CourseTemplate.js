import mongoose from 'mongoose';
import { ModuleSchema } from './Module.js';

const CourseTemplateSchema = new mongoose.Schema({
  nombre: String,
  modulos: [ModuleSchema]
});

export default mongoose.model("CourseTemplate", CourseTemplateSchema);
