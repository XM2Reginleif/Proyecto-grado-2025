import { ref } from "vue";
import { useApiPrivate } from "@/composables/useApi";

interface EvaluacionConfig {
  modulo: string;
  submodulo: string;
  ejercicio: string;
  categoria: string;
  subejercicio: string;
}

export function useEvaluacion(config: EvaluacionConfig) {
  const intentos = ref<number>(0);
  const ultimoIntento = ref<Date | null>(null);
  const nota = ref<number>(0);
  const error = ref<string | null>(null);
  const cargando = ref<boolean>(false);

  const obtenerIntentos = async () => {
    cargando.value = true;
    error.value = null;
    try {
      const { data } = await useApiPrivate().post("/curso/evaluar", {
        ...config,
        nota: null,
      });
      intentos.value = data.intentos_restantes;
      nota.value = data.nota;
      ultimoIntento.value = data.ultimo_intento;
    } catch (err: any) {
      console.error("Error al obtener intentos:", err);
      error.value = "No se pudieron obtener los intentos";
    } finally {
      cargando.value = false;
    }
  };

  const registrarEvaluacion = async (nuevaNota: number) => {
    cargando.value = true;
    error.value = null;
    try {
      const { data } = await useApiPrivate().post("/curso/evaluar", {
        ...config,
        nota: nuevaNota,
      });
      intentos.value = data.intentos_restantes;
      nota.value = data.nota;
      ultimoIntento.value = data.ultimo_intento;
    } catch (err: any) {
      console.error("Error al registrar evaluación:", err);
      error.value = "No se pudo registrar la evaluación";
    } finally {
      cargando.value = false;
    }
  };

  return {
    intentos,
    nota,
    ultimoIntento,
    error,
    cargando,
    obtenerIntentos,
    registrarEvaluacion,
  };
}
