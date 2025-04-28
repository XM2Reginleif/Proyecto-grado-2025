import mongoose from 'mongoose';
import { connectManual } from './config/connectManual.js';
import { User } from './models/User.js';
import CourseTemplate from './models/CourseTemplate.js';

async function sincronizarUsuarios() {
  try {
    await connectManual(); // Conexión a la base de datos

    // Obtener la plantilla actualizada
    const plantilla = await CourseTemplate.findOne();
    if (!plantilla) throw new Error('No se encontró una plantilla de curso');

    const cursoClonado = JSON.parse(JSON.stringify(plantilla.toObject()));

    // Actualizar el curso para todos los usuarios
    const usuarios = await User.find();

    for (const user of usuarios) {
      user.curso = cursoClonado;
      await user.save();
      console.log(`Curso actualizado para ${user.email}`);
    }

    console.log(`Sincronización completa. Usuarios actualizados: ${usuarios.length}`);
  } catch (error) {
    console.error('Error al sincronizar:', error.message);
  } finally {
    await mongoose.disconnect(); // Cierra la conexión correctamente
  }
}

sincronizarUsuarios();
