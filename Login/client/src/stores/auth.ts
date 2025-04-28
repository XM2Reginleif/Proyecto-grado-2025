import {defineStore} from "pinia";
import {useApi, useApiPrivate} from "../composables/useApi"

export interface User{
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
}

export interface State{
    user: User,
    accessToken: string,
}

export interface LoginData{
    email: string, 
    password: string,
}

export interface RegisterData{
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    password_confirm: string
}

export interface NewPassword{
    email: string,
    currentPassword : string,
    NewPassword : string,
    NewPasswordConfirm : string,
}

export const useAuthStore = defineStore("auth", {
    state: (): State => {
        return {
            user: {} as User,
            accessToken: "" as string,
        }
    },

    getters: {
        userDetail: (state: State) => state.user,
        isAuthenticated: (state: State) => state.user?.id? true : false
    },

    actions: {

        async attempt(){
            try {
              await this.refresh()
              await this.getUser()
            } catch (error) {
              return
            }
            return
          },

          async login(payload: LoginData) {
            try {
              const { data } = await useApi().post("/api/auth/login", payload);
              this.accessToken = data?.access_token;
          
              // Guardamos el token en localStorage para acceder desde cualquier lugar
              localStorage.setItem("token", this.accessToken);
          
              await this.getUser();
              return data;
            } catch (error: Error | any) {
              if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
              } else {
                throw new Error("Error inesperado. Por favor, intente más tarde.");
              }
            }
          }
          ,

        async register(payload: RegisterData){
            try {
                const {data} = await useApi().post("/api/auth/register", payload);
                return data;
            } catch (error: Error | any) {
                throw error.message
            }
        },

        async getUser(){
            try {
                const {data} = await useApiPrivate().get("/api/auth/profile");
                this.user = data
                return data;
            } catch (error: Error | any) {
                if (error.response && error.response.message) {
                    // Manejar el error cuando hay un mensaje en la respuesta
                    throw error.response.message;
                  } else if (error.message) {
                    // Manejar otros casos de error
                    throw error.message;
                  } else {
                    // Manejar cualquier otro caso de error desconocido
                    throw "Error desconocido al obtener el usuario";
                }
            }
        },

        async logout(){
            try {
                const {data} = await useApiPrivate().post("/api/auth/logout");
                this.accessToken = ""
                this.user = {} as User
                return data;
            } catch (error: Error | any) {
                throw error.response.message
            }
        },

        async refresh(){
            try {
                const {data} = await useApi().post("/api/auth/refresh");
                this.accessToken = data?.access_token
                return data;
            } catch (error: Error | any) {
                throw error.response.message
            }
        },

        async changePassword(payload: NewPassword) {
            try {
              const { data } = await useApi().post("/api/auth/changePassword", payload);
              return data; // Mensaje de éxito
            } catch (error: Error | any) {
              if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message); // Mensaje desde el backend
              } else {
                throw new Error("Error inesperado. Por favor, intente más tarde."); // Mensaje genérico
              }
            }
        }
    }
})