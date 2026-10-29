// Configuración leída de las variables VITE_*. Sin backend configurado se trabaja con datos simulados.
export const env = {
  apiUrl: import.meta.env.VITE_URL_API_BACKEND ?? "",
  useMocks: import.meta.env.VITE_USE_MOCKS !== "false",
}

if (!env.useMocks && !env.apiUrl) {
  throw new Error("Falta la variable VITE_URL_API_BACKEND en el archivo .env")
}
