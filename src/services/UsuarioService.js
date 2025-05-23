import axios from "axios";

const REGISTER_API_URL = "http://localhost:8080/auth/register";
const LOGIN_API_URL = "http://localhost:8080/auth/login";

class UsuarioService{
    
    saveUsuario(usuario){
        return axios.post(REGISTER_API_URL,usuario);
    }
}
export default new UsuarioService();