import React, { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { Carousel, Spinner, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const People = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsuarios, setIsFetchingUsuarios] = useState(true);

  const loggedUserId = localStorage.getItem("idUsuario"); // Debes guardar el userId al hacer login

  useEffect(() => {
    UsuarioService.getUsuariosNoLikeados()
      .then((response) => {
        setUsuarios(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetchingUsuarios(false); // Ya terminó la carga inicial
      });
  }, []);

  const handleLike = () => {
    if (!loggedUserId) {
      alert("Debes iniciar sesión para dar Me gusta");
      return;
    }
    setIsLoading(true);

    const likedUserId = usuarios[currentIndex]?.id;

    if (!likedUserId) {
      setIsLoading(false);
      return;
    }

    UsuarioService.likeUser(loggedUserId, likedUserId)
      .then((res) => {
        const mensaje = res.data;

        if (mensaje.includes("Match")) {
          // Mostrar una imagen personalizada
          Swal.fire({
            title: "¡Felicidades!",
            text: mensaje,
            imageUrl: "/img/corazon.gif", // Cambia esta URL si quieres otra imagen

            imageWidth: 300,
            imageHeight: 200,
            imageAlt: "Imagen de Match",
            confirmButtonText: "Cerrar",
          });
        } else {
          // Mostrar alerta tipo success
          Swal.fire({
            title: "Like enviado",
            text: mensaje,
            icon: "success",
            confirmButtonText: "Cerrar",
          });
        }

        // Actualizar usuarios (después de cualquier alerta)
        const nuevosUsuarios = [...usuarios];
        nuevosUsuarios.splice(currentIndex, 1);
        setUsuarios(nuevosUsuarios);
        setCurrentIndex((prev) => (prev >= nuevosUsuarios.length ? 0 : prev));
      })

      .catch((err) => {
        console.error(err);
        alert("Error enviando like");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleNo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < usuarios.length ? prevIndex + 1 : 0
      );
      setIsLoading(false);
    }, 100);
  };

  const usuario = usuarios[currentIndex];

  // Validación para evitar errores
  if (isFetchingUsuarios) {
    return (
      <div
        className="flex-fill container d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <h2 className="text-center">Cargando usuarios...</h2>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div
        className="flex-fill container d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <h2 className="text-center">No hay más usuarios disponibles</h2>
      </div>
    );
  }

  return (
    <div className="flex-fill container my-5 justify-content-center">
      <h1 className="text-center">USUARIOS</h1>
      <div
        key={usuario.id}
        className="position-relative d-flex flex-column flex-md-row border rounded mb-4 mt-3"
        style={{ overflow: "hidden", minHeight: "400px" }}
      >
        {/* Overlay de carga */}
        {isLoading && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
            style={{ zIndex: 10 }}
          >
            <Spinner animation="border" role="status" variant="primary" />
          </div>
        )}

        {/* Mitad izquierda: Carrusel de fotos */}
        <div
          className="bg-secondary bg-gradient d-flex justify-content-center align-items-center"
          style={{
            height: "400px",
            flexBasis: "45%",
            maxWidth: "100%",
          }}
        >
          <Carousel indicators={true} controls={true} style={{ width: "100%" }}>
            {usuario.foto1 && (
              <Carousel.Item>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "400px", width: "100%" }}
                >
                  <img
                    src={`data:image/jpeg;base64,${usuario.foto1}`}
                    alt="Foto 1"
                    className="img-fluid"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </Carousel.Item>
            )}
            {usuario.foto2 && (
              <Carousel.Item>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "400px", width: "100%" }}
                >
                  <img
                    src={`data:image/jpeg;base64,${usuario.foto2}`}
                    alt="Foto 2"
                    className="img-fluid"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                  />
                </div>
              </Carousel.Item>
            )}
          </Carousel>
        </div>

        {/* Mitad derecha: Información */}
        <div
          className="p-4 bg-white flex-grow-1 d-flex flex-column "
          style={{
            flexBasis: "55%",
          }}
        >
          {/* Nombre siempre arriba */}
          <div className="mb-3">
            <h3>{usuario.name}</h3>
          </div>

          {/* Biografía y Edad: crecen según espacio disponible */}
          <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <p>
              <strong>Biografía:</strong> {usuario.bio}
            </p>
            <p>
              <strong>Edad:</strong> {usuario.age}
            </p>
            <p>
              <strong>Genero:</strong> {usuario.genero}
            </p>
            <p>
              <strong>Fuma:</strong>{" "}
              {usuario.fumador ? "Sí, fuma" : "No fumador"}
            </p>
          </div>

          {/* Botones siempre abajo */}
          <div className="d-flex justify-content-center gap-3 mt-auto">
            <button
              className="btn btn-lg btn-success"
              onClick={handleLike}
              disabled={isLoading}
            >
              Me gusta
            </button>
            <button
              className="btn btn-lg btn-danger"
              onClick={handleNo}
              disabled={isLoading}
            >
              NO!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;
