import React, { useState } from "react";
import UsuarioService from "../services/UsuarioService";

export const RegistroForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [tel, setTel] = useState("");
  const [bio, setBio] = useState("");
  const [foto1, setFoto1] = useState(null);
  const [foto2, setFoto2] = useState(null);

  const [errores, setErrores] = useState({});

  const [loading, setLoading] = useState(false);

  const saveUsuario = (e) => {
    e.preventDefault();
    setLoading(true);
    const usuario = { email, password, confirmPassword, name, age, tel, bio };

    UsuarioService.saveUsuario(usuario)
      .then((response) => {
        console.log(response.data);
        setErrores({}); // Limpia errores si la petición fue exitosa
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrores(error.response.data); // Guarda los mensajes de error para mostrar
        } else {
          // Puedes manejar otros errores genéricos aquí
          console.error("Error inesperado:", error);
        }
      })
      .finally(() => {
        // Después de la petición, espera medio segundo antes de quitar loading
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });

    console.log(usuario);
    console.log(confirmPassword);
  };

  return (
    <form onSubmit={saveUsuario}>
      <div className="row">
        {/* Columna izquierda */}
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              placeholder="Digite su nombre"
              name="name"
              className={`form-control ${errores.name ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errores.name && (
              <div className="invalid-feedback">{errores.name}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Correo electrónico</label>
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

          <div className="form-group mb-3">
            <label className="form-label">Confirmar contraseña:</label>
            <input
              type="password"
              placeholder="Repite su contraseña"
              name="confirmPassword"
              className={`form-control ${
                errores.confirmPassword ? "is-invalid" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errores.confirmPassword && (
              <div className="invalid-feedback">{errores.confirmPassword}</div>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label className="form-label">Edad</label>
            <input
              type="number"
              placeholder="Digite su edad"
              name="age"
              className={`form-control ${errores.age ? "is-invalid" : ""}`}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            {errores.age && (
              <div className="invalid-feedback">{errores.age}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              placeholder="Digite su número"
              name="tel"
              className={`form-control ${errores.tel ? "is-invalid" : ""}`}
              value={tel}
              onChange={(e) => setTel(e.target.value)}
            />
            {errores.tel && (
              <div className="invalid-feedback">{errores.tel}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Bio</label>
            <textarea
              rows="3"
              name="bio"
              placeholder="Háblanos sobre ti"
              className={`form-control ${errores.bio ? "is-invalid" : ""}`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            {errores.bio && (
              <div className="invalid-feedback">{errores.bio}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Foto 1</label>
            <input
              type="file"
              accept="image/*"
              className={`form-control ${errores.foto1 ? "is-invalid" : ""}`}
              onChange={(e) => setFoto1(e.target.files[0])}
            />
            {errores.foto1 && (
              <div className="invalid-feedback">{errores.foto1}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Foto 2</label>
            <input
              type="file"
              accept="image/*"
              className={`form-control ${errores.foto2 ? "is-invalid" : ""}`}
              onChange={(e) => setFoto2(e.target.files[0])}
            />
            {errores.foto2 && (
              <div className="invalid-feedback">{errores.foto2}</div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
          Cerrar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cargando..." : "Registrar"}
        </button>
      </div>
    </form>
  );
};
export default RegistroForm;
