import axios from "axios";

const BASE_URL = "http://munayaws.duckdns.org:8080";
const MENSAJES_API = `${BASE_URL}/mensajes`;

class MensajeService {
  constructor() {
    this.token = localStorage.getItem("accessToken");
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  fetchHistorial(user1, user2) {
    return axios.get(`${MENSAJES_API}/historial`, {
      params: { user1, user2 },
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  crearMensaje(mensaje) {
    return axios.post(`${MENSAJES_API}/crear`, mensaje, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }
}

export default new MensajeService();
