import React, { useState } from "react";
import UsuarioService from "../services/UsuarioService";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const RegistroForm = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [foto1, setFoto1] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [genero, setGenero] = useState("");
  const [fumador, setFumador] = useState(false);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const saveUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base64Foto1 = foto1 ? await toBase64(foto1) : null;
      const base64Foto2 = foto2 ? await toBase64(foto2) : null;

      const usuario = {
        email,
        password,
        confirmPassword,
        name,
        age,
        bio,
        foto1: base64Foto1,
        foto2: base64Foto2,
        genero: genero || "OTRO",
        fumador,
      };

      const response = await UsuarioService.saveUsuario(usuario);
      console.log(response.data);
      setErrores({});
      onSuccess("Usuario registrado, puede loguearse.");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrores(error.response.data);
      } else {
        console.error("Error inesperado:", error);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <form onSubmit={saveUsuario} className="container mt-4">
      <div className="row g-4">
        {/* Datos personales */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-morado text-white">
              <h5 className="mb-0">Datos personales</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  placeholder="Digite su nombre"
                  className={`form-control ${errores.name ? "is-invalid" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errores.name && (
                  <div className="invalid-feedback">{errores.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Edad</label>
                <input
                  type="number"
                  placeholder="Digite su edad"
                  className={`form-control ${errores.age ? "is-invalid" : ""}`}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                {errores.age && (
                  <div className="invalid-feedback">{errores.age}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Género</label>
                <select
                  className="form-select"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                >
                  <option value="">No quiero decirlo</option>
                  <option value="HOMBRE">Hombre</option>
                  <option value="MUJER">Mujer</option>
                </select>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="fumador"
                  checked={fumador}
                  onChange={(e) => setFumador(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="fumador">
                  ¿Fumas?
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Datos para la cuenta */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-morado text-white">
              <h5 className="mb-0">Datos de la cuenta</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="Digite su correo"
                  className={`form-control ${
                    errores.email ? "is-invalid" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errores.email && (
                  <div className="invalid-feedback">{errores.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  placeholder="Digite su contraseña"
                  className={`form-control ${
                    errores.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errores.password && (
                  <div className="invalid-feedback">{errores.password}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="Repite su contraseña"
                  className={`form-control ${
                    errores.confirmPassword ? "is-invalid" : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errores.confirmPassword && (
                  <div className="invalid-feedback">
                    {errores.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-morado text-white">
              <h5 className="mb-0">Descripción y fotos</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label">Descripción</label>
                <textarea
                  rows="3"
                  placeholder="Háblanos sobre ti"
                  className={`form-control ${errores.bio ? "is-invalid" : ""}`}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                {errores.bio && (
                  <div className="invalid-feedback">{errores.bio}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Fotos</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control ${
                    errores.foto1 ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setFoto1(e.target.files[0])}
                />
                {errores.foto1 && (
                  <div className="invalid-feedback">{errores.foto1}</div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control ${
                    errores.foto2 ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setFoto2(e.target.files[0])}
                />
                {errores.foto2 && (
                  <div className="invalid-feedback">{errores.foto2}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="d-flex justify-content-end mt-4">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
          disabled={loading}
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
