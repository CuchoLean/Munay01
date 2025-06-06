import React, { useState } from "react";
//import UsuarioService from "../services/UsuarioService";
import { useNavigate } from "react-router-dom"; // 👈 Importamos el hook
import { useAuth } from "../services/AuthContext"; // 👈 Importa el contexto


const LoginForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 Instanciamos el hook
    const { login } = useAuth(); // 👈 Usa el login del contexto


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setError("");
    setErrores({});

    const nuevosErrores = {};
    if (!email.trim()) nuevosErrores.email = "Ingrese su email";
    if (!password.trim()) nuevosErrores.password = "Ingrese su contraseña";

    if (Object.keys(nuevosErrores).length > 0) {
      setTimeout(() => {
        setLoading(false);
      }, 500);

      setErrores(nuevosErrores);
      return;
    }

    try {
      await login({ email, password }); // 👈 Usamos login del contexto
      onClose();
      navigate("/people");
    } catch (err) {
      setError("Credenciales incorrectas");
      setEmail("");
      setPassword("");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label className="form-label">Correo</label>
        <input
          type="email"
          placeholder="Digite su correo"
          name="email"
          className={`form-control ${errores.email ? "is-invalid" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errores.email && (
          <div className="invalid-feedback">{errores.email}</div>
        )}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          placeholder="Digite su contraseña"
          name="password"
          className={`form-control ${errores.password ? "is-invalid" : ""}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errores.password && (
          <div className="invalid-feedback">{errores.password}</div>
        )}
      </div>

      {error && <div className="text-danger mb-3">{error}</div>}

      <div className="d-flex justify-content-end mt-3">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
          Cerrar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
