<template>
    <div id="user">
        <div class="card card-body mt-8, align-left, col-md-15">
            <h1 class="text-center">Paso 1. Conectar cables a los motorreductores</h1>
            <br>
            <h3>Ejercicio:</h3>
            <br>
            <p class="texto-personalizado">
                Se necesita un programa en C que simule la conexión de dos cables uno rojo y otro negro a un motoreductor. 
                Cuando se haga la conexión imrpimir el mensaje: "cable rojo y negro conectados".
            </p>
            <p class="texto-personalizado"><strong>Instrucciones:</strong> Los cables deben ser variables del tipo cadena de caracter. 
                La conexión debe ser una función del tipo cadena de caracter, la cual debe imprimir el mensaje.
            </p>
            <br>
            <h3>Algoritmo:</h3>
            <ImageChecker/>
        </div>
        <div class="align-left col-md-3">
            <div class="temas">
                <NavMenu />
            </div>
        </div>
    </div>
</template>

<script>
import ImageChecker from "@/components/ImageCheckerConectarCables.vue";
import NavMenu from "../../components/MenuCarro.vue";
export default{
    components:{
        NavMenu, 
        ImageChecker
    },
}
</script >



<style>

#user {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
}

.card {
  max-width: 100%;
  margin: auto;
  padding: 20px;
}

.texto-personalizado {
    font-family: Arial, sans-serif; /* Tipo de letra */
    font-size: 18px; /* Tamaño de fuente */
    text-align: justify; /* Alineación justificada */
}

.temas {
  position: fixed;
  margin-top: -245px;
}

</style>