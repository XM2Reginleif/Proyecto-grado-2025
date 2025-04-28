// scripts/resetIntentosUsuario.js
import mongoose from 'mongoose';
import { connectManual } from './config/connectManual.js';
import { User } from './models/User.js';

const EMAIL_OBJETIVO = 'aries@test.com'; // email del usuario a actualizar
const NUEVO_INTENTO = 3 // numero de intentos a asignar

async function resetearIntentos() {
  try {
    await connectManual();

    const user = await User.findOne({ email: EMAIL_OBJETIVO });
    if (!user) throw new Error('Usuario no encontrado');

    let subejerciciosActualizados = 0;

    for (const modulo of user.curso.modulos) {
      for (const submodulo of modulo.submodulos) {
        for (const ejercicio of submodulo.ejercicios) {
          for (const categoriaKey of Object.keys(ejercicio.categorias)) {
            const categoria = ejercicio.categorias[categoriaKey];
            for (const subejercicio of categoria.subejercicios) {
              subejercicio.intentos_restantes = NUEVO_INTENTO;
              subejerciciosActualizados++;
            }
          }
        }
      }
    }

    await user.save();
    console.log(`Intentos actualizados a ${NUEVO_INTENTO} para ${subejerciciosActualizados} subejercicios de ${EMAIL_OBJETIVO}`);
  } catch (error) {
    console.error('Error al actualizar intentos:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

resetearIntentos();
