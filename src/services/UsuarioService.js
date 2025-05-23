import axios from "axios";

const REGISTER_API_URL = "http://localhost:8080/auth/register";
const LOGIN_API_URL = "http://localhost:8080/auth/login";

class UsuarioService {
  saveUsuario(usuario) {
    return axios.post(REGISTER_API_URL, usuario);
  }
  login(credentials) {
    return axios.post(LOGIN_API_URL, credentials).then((response) => {
      // Asumiendo que el token viene en response.data.token
      const token = response.data.token;
      if (token) {
        // Guardar el token en localStorage para usarlo después
        localStorage.setItem("token", token);
      }
      return response;
    });
  }

  logout() {
    // Para cerrar sesión, simplemente elimina el token
    localStorage.removeItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }
}

export default new UsuarioService();
