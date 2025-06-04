import axios from "axios";
import { jwtDecode } from "jwt-decode";

const REGISTER_API_URL = "http://localhost:8080/auth/register";
const LOGIN_API_URL = "http://localhost:8080/auth/login";
const USUARIOS_API_URL = "http://localhost:8080/usuarios/todos";
const POSTS_API_URL = "http://localhost:8080/posts";

class UsuarioService {
  saveUsuario(usuario) {
    return axios.post(REGISTER_API_URL, usuario);
  }
  getAllUsuarios() {
    const token = localStorage.getItem("accessToken"); // o sessionStorage.getItem()
    return axios.get(USUARIOS_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  login(credentials) {
    return axios.post(LOGIN_API_URL, credentials).then((response) => {
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const decoded = jwtDecode(accessToken);

        const userId = decoded.id;
        const userGenero = decoded.genero;
        console.log(userId);

        // Guardar el ID en localStorage para usar en React
        localStorage.setItem("idUsuario", userId);
        localStorage.setItem("generoUsuario", userGenero);
      }
      return response;
    });
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("idUsuario");
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  likeUser(likedUserId) {
    const token = localStorage.getItem("accessToken");
    return axios.post(
      `http://localhost:8080/usuarios/like/${likedUserId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getUsuariosNoLikeados() {
    const token = this.getToken();
    return axios.get("http://localhost:8080/usuarios/todosL", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getUsuariosConMatch() {
    const token = this.getToken();
    return axios.get("http://localhost:8080/usuarios/usuarios-match", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateUsuario(datosActualizados) {
    const token = this.getToken();
    return axios.put(
      "http://localhost:8080/usuarios/actualizar",
      datosActualizados,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getUsuarioDesdeToken() {
    const token = this.getToken();
    return axios.get("http://localhost:8080/usuarios/buscarUsuarioToken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteUsuario() {
    const token = this.getToken();
    return axios.delete("http://localhost:8080/usuarios/eliminar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  crearPost(postData) {
    const token = this.getToken();
    return axios.post(POSTS_API_URL, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 📌 Obtener todos los posts
  getTodosLosPosts() {
    const token = this.getToken();
    return axios.get(POSTS_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 📌 Obtener posts del usuario autenticado
  getMisPosts() {
    const token = this.getToken();
    return axios.get(`${POSTS_API_URL}/usuario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 📌 Editar un post
  editarPost(idPost, postActualizado) {
    const token = this.getToken();
    return axios.put(`${POSTS_API_URL}/${idPost}`, postActualizado, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 📌 Eliminar un post
  eliminarPost(idPost) {
    const token = this.getToken();
    return axios.delete(`${POSTS_API_URL}/${idPost}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // En UsuarioService.js
  getPostById(idPost) {
    const token = this.getToken();
    return axios.get(`${POSTS_API_URL}/${idPost}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getUsuariosSinAdmin() {
    const token = this.getToken();
    return axios.get("http://localhost:8080/usuarios/usuarios-sin-admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteUsuarioById(idUsuario) {
    const token = this.getToken();
    return axios.delete(
      `http://localhost:8080/usuarios/eliminar/${idUsuario}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new UsuarioService();
