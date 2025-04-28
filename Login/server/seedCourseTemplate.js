import mongoose from 'mongoose';
import CourseTemplate from './models/CourseTemplate.js';
import { connectManual } from './config/connectManual.js'; // IMPORTAR CONEXIÓN MANUAL

function generarCategoria(subejerciciosCount = 1) {
  const subejercicios = Array.from({ length: subejerciciosCount }, (_, i) => ({
    nombre: `Subejercicio ${i + 1}`,
    nota: 0,
    intentos_restantes: 3,
    ultimo_intento: null
  }));

  return {
    subejercicios,
    nota: 0,
    ultimo_intento: null
  };
}

function generarEjercicio(nombre, config = {}) {
  return {
    nombre,
    categorias: {
      descomposicion: generarCategoria(config.descomposicion || 1),
      algoritmo: generarCategoria(config.algoritmo || 1),
      abstraccion: generarCategoria(config.abstraccion || 1),
      generalizacion: generarCategoria(config.generalizacion || 1)
    }
  };
}

const plantillaCurso = {
  nombre: 'Guía Construcción Carro Arduino',
  modulos: [
    {
      nombre: '1. Fase de ensamblaje',
      nota: 0,
      submodulos: [
        {
          nombre: '1.1 Conectar cables a los motorreductores',
          nota: 0,
          ejercicios: [
            generarEjercicio('Ejercicio 1', { descomposicion: 2 }), // Descomposición con 2 subejercicios
            generarEjercicio('Ejercicio 2') // Todas las categorías con 1 subejercicio
          ]
        }
      ]
    }
  ]
};

async function runSeed() {
  try {
    await connectManual(); //
    await CourseTemplate.deleteMany();
    const creada = await CourseTemplate.create(plantillaCurso);
    console.log('Plantilla creada con éxito. ID:', creada._id);
  } catch (error) {
    console.error('Error al crear plantilla:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

runSeed();
