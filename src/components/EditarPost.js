import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UsuarioService from "../services/UsuarioService";

const EditarPost = () => {
  const { id } = useParams(); // obtener id del post desde la URL
  const navigate = useNavigate();

  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  useEffect(() => {
    // Cargar datos del post al montar
    UsuarioService.getPostById(id)
      .then((response) => {
        const post = response.data;
        setTexto(post.texto);
        if (post.imagen) {
          setPreview(`data:image/jpeg;base64,${post.imagen}`);
          setImagen(null); // Por defecto no cambiar la imagen hasta que el usuario cargue una nueva
        }
      })
      .catch(() => {
        alert("No se encontró el post");
        navigate("/misPosts"); // redirigir si no se encuentra
      });
  }, [id, navigate]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImagen(null);
      setPreview(null);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrores({});
    setExito(false);

    try {
      const imagenBase64 = imagen ? await toBase64(imagen) : preview ? preview.split(",")[1] : null;

      const postData = {
        texto,
        imagen: imagenBase64,
      };

      await UsuarioService.editarPost(id, postData);

      setExito(true);
      setTimeout(() => {
        navigate("/misPosts"); // Redirigir después del éxito
      }, 1500);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrores(err.response.data);
      } else {
        setErrores({ general: "Error al editar el post. Intenta de nuevo." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5 flex-fill" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Editar Post</h2>

      {errores.general && <div className="alert alert-danger">{errores.general}</div>}
      {exito && <div className="alert alert-success">Post actualizado con éxito!</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="textoPost" className="form-label">Texto del post</label>
          <textarea
            id="textoPost"
            className={`form-control ${errores.texto ? "is-invalid" : ""}`}
            rows="3"
            placeholder="Escribe algo..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
          {errores.texto && <div className="invalid-feedback">{errores.texto}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="imagenPost" className="form-label">Imagen</label>
          <input
            type="file"
            className={`form-control ${errores.imagen ? "is-invalid" : ""}`}
            id="imagenPost"
            accept="image/*"
            onChange={handleImagenChange}
            disabled={isSubmitting}
          />
          {errores.imagen && <div className="invalid-feedback">{errores.imagen}</div>}
        </div>

        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxHeight: "300px", objectFit: "contain" }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditarPost;
