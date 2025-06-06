import { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });

const EditarPerfil = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [tel, setTel] = useState("");
  const [bio, setBio] = useState("");
  const [foto1, setFoto1] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [previewFoto1, setPreviewFoto1] = useState(null);
  const [previewFoto2, setPreviewFoto2] = useState(null);
  const [genero, setGenero] = useState("");
  const [fumador, setFumador] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado para errores por campo
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    UsuarioService.getUsuarioDesdeToken()
      .then((res) => {
        const u = res.data;
        setEmail(u.email || "");
        setName(u.name || "");
        setAge(u.age || "");
        setTel(u.tel || "");
        setBio(u.bio || "");
        setGenero(u.genero || "");
        setFumador(Boolean(u.fumador));

        if (u.foto1) {
          setPreviewFoto1("data:image/jpeg;base64," + u.foto1);
        }
        if (u.foto2) {
          setPreviewFoto2("data:image/jpeg;base64," + u.foto2);
        }
      })
      .catch((err) => {
        console.error("Error al cargar usuario:", err);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFotoChange = (e, setFoto, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({}); // Limpiar errores antes de enviar

    if (password && password !== confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      setSaving(false);
      return;
    }

    try {
      const base64Foto1 = foto1
        ? await toBase64(foto1)
        : previewFoto1?.split(",")[1] || null;
      const base64Foto2 = foto2
        ? await toBase64(foto2)
        : previewFoto2?.split(",")[1] || null;

      // Construye el objeto para enviar
      const usuario = {
        email,
        ...(password && { password }),
        name,
        age,
        bio,
        foto1: base64Foto1,
        foto2: base64Foto2,
        genero: genero || "OTRO",
        fumador,
      };
      console.log("Usuario a enviar:", usuario);

      const response = await UsuarioService.updateUsuario(usuario);
      console.log("Respuesta del backend:", response.data);
      Swal.fire("Actualizado", "Tu perfil ha sido actualizado", "success");
      navigate("/perfil");
    } catch (error) {
      console.error("Error al actualizar:", error);
      if (error.response && error.response.data) {
        const data = error.response.data;
        // Si viene un objeto con errores por campo, asignarlo
        if (typeof data === "object") {
          setErrors(data);
        }
        // Mostrar mensaje general si existe
        Swal.fire(
          "Error",
          data.message || "No se pudo actualizar el perfil",
          "error"
        );
      } else {
        Swal.fire("Error", "Error desconocido al actualizar", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex-fill d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Datos personales */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-morado text-white">
                Datos personales
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    type="number"
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  {errors.age && (
                    <div className="invalid-feedback">{errors.age}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Género</label>
                  <select
                    className={`form-select ${
                      errors.genero ? "is-invalid" : ""
                    }`}
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                  >
                    <option value="">No especificado</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="MUJER">Mujer</option>
                    <option value="OTRO">Otro</option>
                  </select>
                  {errors.genero && (
                    <div className="invalid-feedback">{errors.genero}</div>
                  )}
                </div>

                <div className="form-check mb-3">
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

          {/* Cuenta y contraseña */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-morado text-white">
                Datos de la cuenta
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    value={email}
                    disabled
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Nueva contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dejar vacío para no cambiar"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio y fotos */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-morado text-white">
                Descripción y fotos
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className={`form-control ${errors.bio ? "is-invalid" : ""}`}
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                  {errors.bio && (
                    <div className="invalid-feedback">{errors.bio}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Foto 1</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`form-control ${
                        errors.foto1 ? "is-invalid" : ""
                      }`}
                      onChange={(e) =>
                        handleFotoChange(e, setFoto1, setPreviewFoto1)
                      }
                    />
                    {errors.foto1 && (
                      <div className="invalid-feedback">{errors.foto1}</div>
                    )}
                    {previewFoto1 && (
                      <img
                        src={previewFoto1}
                        alt="Foto 1"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Foto 2</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`form-control ${
                        errors.foto2 ? "is-invalid" : ""
                      }`}
                      onChange={(e) =>
                        handleFotoChange(e, setFoto2, setPreviewFoto2)
                      }
                    />
                    {errors.foto2 && (
                      <div className="invalid-feedback">{errors.foto2}</div>
                    )}
                    {previewFoto2 && (
                      <img
                        src={previewFoto2}
                        alt="Foto 2"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de guardar */}
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPerfil;
