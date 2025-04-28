import { ref } from "vue";
import { useApiPrivate } from "@/composables/useApi";

interface EvaluacionParams {
  modulo: string;
  submodulo: string;
  ejercicio: string;
  categoria: string;
  subejercicio: string;
}

export function useEvaluacionSubejercicio(params: EvaluacionParams) {
  const intentosRestantes = ref<number | null>(null);
  const notaActual = ref<number | null>(null);
  const ultimoIntento = ref<string | null>(null);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  const api = useApiPrivate();

  async function obtenerEstado() {
    cargando.value = true;
    error.value = null;

    try {
      const { data } = await api.post("/api/curso/evaluar", {
        ...params,
        nota: null
      });

      if (data?.subejercicio) {
        intentosRestantes.value = data.subejercicio.intentos_restantes;
        notaActual.value = data.subejercicio.nota;
        ultimoIntento.value = data.subejercicio.ultimo_intento;
      } else {
        error.value = "No se encontró el estado del subejercicio.";
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Error al consultar el estado";
    } finally {
      cargando.value = false;
    }
  }

  async function registrarNota(nota: number) {
    cargando.value = true;
    error.value = null;
  
    try {
      const { data } = await api.post("/api/curso/evaluar", {
        ...params,
        nota
      });
  
      intentosRestantes.value = data.intentos_restantes;
      notaActual.value = data.nota;
      ultimoIntento.value = data.ultimo_intento;
  
      return data; // <-- esto es lo que necesitas agregar
    } catch (err: any) {
      error.value = err.response?.data?.message || "Error al registrar la nota";
      throw err; // <-- opcional, para poder capturar errores en el componente
    } finally {
      cargando.value = false;
    }
  }
  

  return {
    // Estado
    intentosRestantes,
    notaActual,
    ultimoIntento,
    cargando,
    error,

    // Alias para uso en componentes
    obtenerIntentos: obtenerEstado,
    registrarEvaluacion: registrarNota
  };
}
