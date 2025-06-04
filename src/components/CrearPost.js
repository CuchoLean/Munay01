import React, { useState } from "react";
import UsuarioService from "../services/UsuarioService";

const CrearPost = () => {
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState({});  // Cambiado de error (string) a errores (objeto)
  const [exito, setExito] = useState(false);

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

    // No hacer validación manual aquí porque la API te devolverá errores

    try {
      const imagenBase64 = imagen ? await toBase64(imagen) : null;

      const postData = {
        texto,
        imagen: imagenBase64,
      };

      await UsuarioService.crearPost(postData);

      setExito(true);
      setTexto("");
      setImagen(null);
      setPreview(null);
      setErrores({});
    } catch (err) {
      // Si la API responde con errores 400, mostramos los errores debajo de cada input
      if (err.response && err.response.status === 400) {
        setErrores(err.response.data);
      } else {
        setErrores({ general: "Error al crear el post. Intenta de nuevo." });
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5 flex-fill" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Crear Nuevo Post</h2>

      {/* Mostrar error general si existe */}
      {errores.general && (
        <div className="alert alert-danger" role="alert">
          {errores.general}
        </div>
      )}
      {exito && (
        <div className="alert alert-success" role="alert">
          Post creado con éxito!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="textoPost" className="form-label">
            Texto del post
          </label>
          <textarea
            id="textoPost"
            className={`form-control ${errores.texto ? "is-invalid" : ""}`}
            rows="3"
            placeholder="Escribe algo..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
          {errores.texto && (
            <div className="invalid-feedback">{errores.texto}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="imagenPost" className="form-label">
            Imagen
          </label>
          <input
            type="file"
            className={`form-control ${errores.imagen ? "is-invalid" : ""}`}
            id="imagenPost"
            accept="image/*"
            onChange={handleImagenChange}
            disabled={isSubmitting}
          />
          {errores.imagen && (
            <div className="invalid-feedback">{errores.imagen}</div>
          )}
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
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Creando...
            </>
          ) : (
            "Crear Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default CrearPost;
