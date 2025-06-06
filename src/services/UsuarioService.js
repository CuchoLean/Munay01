import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8080";
const AUTH_API = `${BASE_URL}/auth`;
const USUARIOS_API = `${BASE_URL}/usuarios`;
const POSTS_API = `${BASE_URL}/posts`;

class UsuarioService {
  saveUsuario(usuario) {
    return axios.post(`${AUTH_API}/register`, usuario);
  }

  login(credentials) {
    return axios.post(`${AUTH_API}/login`, credentials).then((response) => {
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const decoded = jwtDecode(accessToken);
        localStorage.setItem("idUsuario", decoded.id);
        localStorage.setItem("generoUsuario", decoded.genero);
      }
      return response;
    });
  }

  logout() {
    localStorage.clear();
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getAllUsuarios() {
    return axios.get(`${USUARIOS_API}/todos`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  likeUser(likedUserId) {
    return axios.post(`${USUARIOS_API}/like/${likedUserId}`, null, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getUsuariosNoLikeados() {
    return axios.get(`${USUARIOS_API}/todosL`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getUsuariosConMatch() {
    return axios.get(`${USUARIOS_API}/usuarios-match`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  updateUsuario(datosActualizados) {
    return axios.put(`${USUARIOS_API}/actualizar`, datosActualizados, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getUsuarioDesdeToken() {
    return axios.get(`${USUARIOS_API}/buscarUsuarioToken`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  deleteUsuario() {
    return axios.delete(`${USUARIOS_API}/eliminar`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  deleteUsuarioById(idUsuario) {
    return axios.delete(`${USUARIOS_API}/eliminar/${idUsuario}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getUsuariosSinAdmin() {
    return axios.get(`${USUARIOS_API}/usuarios-sin-admin`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  crearPost(postData) {
    return axios.post(POSTS_API, postData, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getTodosLosPosts() {
    return axios.get(POSTS_API, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getMisPosts() {
    return axios.get(`${POSTS_API}/usuario`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  editarPost(idPost, postActualizado) {
    return axios.put(`${POSTS_API}/${idPost}`, postActualizado, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  eliminarPost(idPost) {
    return axios.delete(`${POSTS_API}/${idPost}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getPostById(idPost) {
    return axios.get(`${POSTS_API}/${idPost}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }
}

export default new UsuarioService();
