<template>
  <div>
    <!-- Mostrar intentos disponibles -->
    <p v-if="intentosDisponiblesAlgorithm !== null" class="alert alert-info">
      Intentos restantes: {{ intentosDisponiblesAlgorithm }}
    </p>

    <!-- Imagenes para ordenar -->
    <div class="image-container">
      <div class="image-item" v-for="(image, index) in puzzle" :key="image.id">
        <p>{{ index + 1 }}</p>
        <img :src="image.src" />
      </div>
    </div>

    <!-- Instrucciones -->
    <p class="texto-personalizado">
      <strong>Instrucciones:</strong> {{ instruccion }}
    </p>

    <!-- Inputs -->
    <div class="input-container">
      <div class="input-item" v-for="(input, index) in inputs" :key="input.key">
        <p>{{ index + 1 }}</p>
        <input
          type="number"
          v-model.number="input.value"
          :ref="input.name"
          min="1"
          :max="numSteps"
          required
        />
      </div>
    </div>

    <!-- Boton para enviar -->
    <div class="button-container mt-3">
      <button
        @click="validateInputs"
        :disabled="isButtonDisabled || intentosDisponiblesAlgorithm <= 0"
        class="btn btn-primary"
      >
        Enviar respuesta
      </button>
    </div>

    <!-- Mensaje de error si las entradas no son válidas -->
    <div class="message mt-2" v-if="showErrorMessage">
      <p class="alert alert-warning">¡Verifica los datos ingresados!</p>
    </div>

    <!-- Retroalimentación -->
    <div v-if="feedbackMessage" class="mt-3">
      <p :class="feedbackClass">{{ feedbackMessage }}</p>
    </div>

    <!-- Nota obtenida -->
    <div v-if="evaluacion !== null" class="correcto mt-3">
      <p
        class="alert"
        :class="{
          'alert-danger': evaluacion === 1,
          'alert-success': evaluacion >= 3
        }"
      >
        Tu evaluación (algoritmo): {{ evaluacion }}
      </p>
    </div>

    <!-- Nota global del store -->
    <p class="alert alert-primary mt-3">
      Evaluación Algoritmo (global): {{ evaluacionAlgorithmStore.evaluacion.toFixed(1) }}
    </p>

    <!-- Botón avanzar (solo si completó o ya no hay intentos) -->
    <button
      class="bt-validate mt-3"
      @click="finish"
      :disabled="evaluacion === null || (intentosDisponiblesAlgorithm > 0 && !isCorrect)"
    >
      Avanzar
    </button>
  </div>
</template>



<script>
import router from '@/router';
import image1 from '@/assets/ConectarCablesImages/Conectar 1.png';
import image2 from '@/assets/ConectarCablesImages/Conectar 2.png';
import image3 from '@/assets/ConectarCablesImages/Conectar 3.png';
import image4 from '@/assets/ConectarCablesImages/Conectar 4.png';
import image5 from '@/assets/ConectarCablesImages/Conectar 5.png';
import image6 from '@/assets/ConectarCablesImages/Conectar 6.png';
import image7 from '@/assets/ConectarCablesImages/Conectar 7.png';
import image8 from '@/assets/ConectarCablesImages/Conectar 8.png';
import image9 from '@/assets/ConectarCablesImages/Conectar 9.png';
import { onMounted, reactive, toRefs } from 'vue';
import { useEvaluacionAlgorithmStore } from '@/stores/evaluation';
import { useEvaluacionSubejercicio } from '@/composables/useEvaluacionSubejercicio';

export default {
  name: 'ImageOrderingModule',

  setup() {
    const evaluacionAlgorithmStore = useEvaluacionAlgorithmStore();

    const evaluacionAlgorithmRaw = reactive(
      useEvaluacionSubejercicio({
        modulo: '1. Fase de ensamblaje',
        submodulo: '1.1 Conectar cables a los motorreductores',
        ejercicio: 'Ejercicio 1',
        categoria: 'algoritmo',
        subejercicio: 'Subejercicio 1'
      })
    );

    const evaluacionAlgorithm = {
      ...toRefs(evaluacionAlgorithmRaw),
      registrarEvaluacion: evaluacionAlgorithmRaw.registrarEvaluacion,
      obtenerIntentos: evaluacionAlgorithmRaw.obtenerIntentos
    };

    onMounted(() => {
      evaluacionAlgorithm.obtenerIntentos();
    });

    return {
      evaluacionAlgorithmStore,
      intentosDisponiblesAlgorithm: evaluacionAlgorithm.intentosRestantes,
      obtenerIntentosAlgorithm: evaluacionAlgorithm.obtenerIntentos,
      registrarEvaluacionAlgorithm: evaluacionAlgorithm.registrarEvaluacion,
      notaActualAlgorithm: evaluacionAlgorithm.notaActual
    };
  },

  data() {
    return {
      instruccion: 'Ingrese el orden correcto del algoritmo',
      puzzle: [],
      evaluacion: null,
      correct: [
        { id: 1, src: image1 },
        { id: 2, src: image2 },
        { id: 3, src: image3 },
        { id: 4, src: image4 },
        { id: 5, src: image5 },
        { id: 6, src: image6 },
        { id: 7, src: image7 },
        { id: 8, src: image8 }
      ],
      bad: [{ id: 9, src: image9 }],
      inputs: Array(8).fill().map((_, index) => ({
        key: index,
        value: null,
        name: `input-${index + 1}`
      })),
      numSteps: 8,
      feedbackMessage: '',
      feedbackClass: '',
      isCorrect: false,
      showPrincipal: true,
      showResult: false,
      showErrorMessage: false
    };
  },

  created() {
    this.puzzle = this.puzzle.concat(this.getImages(this.correct, 1), this.correct);
    this.shuffleImages();
  },

  computed: {
    isButtonDisabled() {
      return !this.inputs.every(
        (input) =>
          Number.isInteger(input.value) &&
          input.value >= 1 &&
          input.value <= 9
      );
    },
    isFinishEnabled() {
      return this.isCorrect || this.intentosDisponiblesAlgorithm <= 0;
    }
  },

  methods: {
    shuffleImages() {
      for (let i = this.puzzle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.puzzle[i], this.puzzle[j]] = [this.puzzle[j], this.puzzle[i]];
      }
    },

    getImages(images, n) {
      const allImages = this.getUniqueImages([...images, ...this.bad]);
      return allImages.slice(allImages.length - n);
    },

    getUniqueImages(images) {
      return images.filter((image, index) => {
        return images.indexOf(images.find((i) => i.id === image.id)) === index;
      });
    },

    async validateInputs() {
  if (this.isButtonDisabled || this.intentosDisponiblesAlgorithm <= 0) {
    return;
  }

  this.showErrorMessage = false;
  this.showResult = false;
  this.isCorrect = false;

  // Validar entradas
  const entradasValidas = this.inputs.every((input) => {
    const inputValue = Number.parseInt(input.value, 10);
    return !Number.isNaN(inputValue) && inputValue >= 1 && inputValue <= this.puzzle.length;
  });

  if (!entradasValidas) {
    this.showErrorMessage = true;
    return;
  }

  // Verificar si es correcta la respuesta
  this.isCorrect = this.inputs.every((input, index) => {
    const inputValue = Number.parseInt(input.value, 10);
    return this.puzzle[inputValue - 1].id === this.correct[index].id;
  });

  // Calcular evaluación SOLO si es correcta o si se acabaron los intentos
  const intentosAntesDeRegistrar = this.intentosDisponiblesAlgorithm;

  if (this.isCorrect) {
    this.evaluacion = intentosAntesDeRegistrar === 3 ? 5 :
                      intentosAntesDeRegistrar === 2 ? 4 : 3;
  } else if (this.intentosDisponiblesAlgorithm <= 1) { 
    // Si es el último intento y falló, poner la nota mínima
    this.evaluacion = 1;
  } else {
    // Si no es el último intento y falló, no se guarda nota aún
    this.evaluacion = 1;
  }

  try {
    await this.registrarEvaluacionAlgorithm(this.evaluacion);
    await this.obtenerIntentosAlgorithm(); // Esto refresca los intentos visibles siempre
    console.log("✔ Evaluación de algoritmo registrada y estado actualizado.");
  } catch (err) {
    console.error("Error registrando evaluación del algoritmo:", err);
    alert("Hubo un problema al guardar la evaluación.");
  }

  this.showResult = true;
  this.showPrincipal = false;
},

    finish() {
      if (this.isFinishEnabled) {
        this.evaluacionAlgorithmStore.evaluacion = this.evaluacion;
        router.push('/AbstraccionConectarCables').then(() => {
          window.scrollTo(0, 0);
        });
      }
    }
  }
};
</script>



    
    <style scoped>
    input {
      font-size: large;
      margin-left: 10px;
      border-radius: 5px;
      text-align: center;
    }
    
    button {
      margin: auto;
      width: calc(100% / 3);
      padding: 10px;
      font-size: 1em;
      margin-top: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .algoritmos {
      margin: 0 auto;
      width: 70%;
    }
    
    .image-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    .image-item {
      position: relative;
      width: calc(33.333% - 20px);
      margin-bottom: 30px;
      z-index: 0;
    }
    
    .image-item img {
      width: 100%;
      height: auto;
      border-radius: 5px 5px 0 0;
    }
    
    .image-item p {
      font-weight: bold;
      position: absolute;
      z-index: 1;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      margin-bottom: -14px;
      padding: 0px;
      border-radius: 0 0 5px 5px;
      color: rgb(27, 27, 27);
      background-color: rgb(119, 119, 119);
    }
    
    .message p {
      margin-top: 20px;
      text-align: center;
      font-size: 1em;
      font-weight: bold;
    }
    
    .text {
      font-size: 1.2em;
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    .description {
      text-align: center;
      font-size: 1em;
      margin-top: -15px;
      margin-bottom: 20px;
    }
    
    .input-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .input-item {
      display: flex;
      flex-wrap: wrap;
      margin-right: 10px;
      border-radius: 5px;
      border: none;
      margin-left: 0;
    }
    
    .input-item p {
      font-size: 1.2em;
      margin-top: 0;
      margin-bottom: 0;
      margin-right: 10 px;
      margin-left: 10px;
    }
    
    .button-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1%;
    }
    
    .validate-msg {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1%;
      font-size: 200%;
      margin: 0 auto;
      text-align: center;
    }
    
    .bt-validate {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1%;
    }
    
    .texto-personalizado {
        font-family: Arial, sans-serif; /* Tipo de letra */
        font-size: 18px; /* Tamaño de fuente */
        text-align: justify; /* Alineación justificada */
    }
    
    @media (max-width: 768px) {
      .image-item {
        width: 100%;
      }
    
      .text {
        font-size: 1em;
      }
    
      .description {
        font-size: 0.5em;
      }
    
      .message {
        font-size: 0.75em;
      }
    
      .button {
        font-size: 0.75em;
      }
    
      .step {
        font-size: 1.1em;
      }
    }
    </style>
    