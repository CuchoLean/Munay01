import { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Solo base64 sin el prefijo
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
        setFumador(u.fumador || false);

        if (u.foto1) {
          setPreviewFoto1("data:image/jpeg;base64," + u.foto1);
          setFoto1(null);
        }
        if (u.foto2) {
          setPreviewFoto2("data:image/jpeg;base64," + u.foto2);
          setFoto2(null);
        }
      })
      .catch((err) => {
        console.error("Error al cargar usuario:", err);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFoto1Change = (e) => {
    if (e.target.files.length > 0) {
      setFoto1(e.target.files[0]);
      setPreviewFoto1(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFoto2Change = (e) => {
    if (e.target.files.length > 0) {
      setFoto2(e.target.files[0]);
      setPreviewFoto2(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (password && password !== confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      setSaving(false);
      return;
    }

    try {
      const base64Foto1 = foto1 ? await toBase64(foto1) : previewFoto1 ? previewFoto1.split(",")[1] : null;
      const base64Foto2 = foto2 ? await toBase64(foto2) : previewFoto2 ? previewFoto2.split(",")[1] : null;

      const usuario = {
        email,
        password,
        confirmPassword,
        name,
        age,
        tel,
        bio,
        foto1: base64Foto1,
        foto2: base64Foto2,
        genero: genero || "OTRO",
        fumador,
      };

      await UsuarioService.updateUsuario(usuario);
      Swal.fire("Actualizado", "Tu perfil ha sido actualizado", "success");
      navigate("/perfil");
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit}>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" value={email} disabled />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar vacío para no cambiar"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="age" className="form-label">Edad</label>
            <input
              type="number"
              className="form-control"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="tel" className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              id="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="genero" className="form-label">Género</label>
            <select
              className="form-select"
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="">No especificado</option>
              <option value="HOMBRE">Hombre</option>
              <option value="MUJER">Mujer</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="fumador"
                checked={fumador}
                onChange={(e) => setFumador(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="fumador">Fumo</label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label">Biografía</label>
          <textarea
            className="form-control"
            id="bio"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="foto1" className="form-label">Foto 1</label>
            <input
              type="file"
              className="form-control"
              id="foto1"
              accept="image/*"
              onChange={handleFoto1Change}
            />
            {previewFoto1 && (
              <img
                src={previewFoto1}
                alt="Foto 1 preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: "150px" }}
              />
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="foto2" className="form-label">Foto 2</label>
            <input
              type="file"
              className="form-control"
              id="foto2"
              accept="image/*"
              onChange={handleFoto2Change}
            />
            {previewFoto2 && (
              <img
                src={previewFoto2}
                alt="Foto 2 preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: "150px" }}
              />
            )}
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPerfil;
