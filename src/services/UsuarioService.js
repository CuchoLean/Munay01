import axios from "axios";
import { jwtDecode } from "jwt-decode";

const REGISTER_API_URL = "http://localhost:8080/auth/register";
const LOGIN_API_URL = "http://localhost:8080/auth/login";
const USUARIOS_API_URL = "http://localhost:8080/usuarios/todos";

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
        console.log(userId);

        // Guardar el ID en localStorage para usar en React
        localStorage.setItem("idUsuario", userId);
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

  likeUser(userId, likedUserId) {
    const token = localStorage.getItem("accessToken");
    return axios.post(
      `http://localhost:8080/usuarios/${userId}/like/${likedUserId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getUsuariosNoLikeados() {
    const token = localStorage.getItem("accessToken");
    return axios.get("http://localhost:8080/usuarios/todosL", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getUsuariosConMatch(userId) {
    const token = localStorage.getItem("accessToken");
    return axios.get(
      `http://localhost:8080/usuarios/${userId}/usuarios-match`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  updateUsuario(datosActualizados) {
    const token = localStorage.getItem("accessToken");
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
    const token = localStorage.getItem("accessToken");
    return axios.get("http://localhost:8080/usuarios/buscarUsuarioToken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteUsuario() {
  const token = localStorage.getItem("accessToken");
  return axios.delete("http://localhost:8080/usuarios/eliminar", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



}

export default new UsuarioService();
