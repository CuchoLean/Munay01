import React, { useState } from "react";
import UsuarioService from "../services/UsuarioService";

const LoginForm = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

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
      await UsuarioService.login({ email, password });
      onSuccess("Usuario logueado correctamente");
      onClose();
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

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Cargando..." : "Iniciar sesión"}
      </button>
    </form>
  );
};

export default LoginForm;
