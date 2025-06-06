import React, { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { Carousel, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

const People = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsuarios, setIsFetchingUsuarios] = useState(true);
  const [generoFiltrado, setGeneroFiltrado] = useState("");

  const usuariosFiltrados = generoFiltrado
    ? usuarios.filter((u) => u.genero.toUpperCase() === generoFiltrado)
    : usuarios;

  const loggedUserId = localStorage.getItem("idUsuario");

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
        setIsFetchingUsuarios(false);
      });
  }, []);

  const handleLike = () => {
    if (!loggedUserId) {
      Swal.fire({
        icon: "warning",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para dar Me gusta",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setIsLoading(true);
    const likedUserId = usuarios[currentIndex]?.id;

    if (!likedUserId) {
      setIsLoading(false);
      return;
    }

    UsuarioService.likeUser(likedUserId)
      .then((res) => {
        const mensaje = res.data;

        if (mensaje.includes("Match")) {
          Swal.fire({
            title: "¡Felicidades!",
            text: mensaje,
            imageUrl: "/img/corazon.gif",
            imageWidth: 300,
            imageHeight: 200,
            imageAlt: "Imagen de Match",
            confirmButtonText: "Cerrar",
          });
        } else {
          Swal.fire({
            title: "Like enviado",
            text: mensaje,
            icon: "success",
            confirmButtonText: "Cerrar",
          });
        }

        const nuevosUsuarios = [...usuarios];
        nuevosUsuarios.splice(currentIndex, 1);
        setUsuarios(nuevosUsuarios);
        setCurrentIndex((prev) => (prev >= nuevosUsuarios.length ? 0 : prev));
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error enviando like",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleNo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < usuariosFiltrados.length ? prevIndex + 1 : 0
      );
      setIsLoading(false);
    }, 100);
  };

  const usuario = usuariosFiltrados[currentIndex];

  if (isFetchingUsuarios) {
    return (
      <div
        className="flex-fill container d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <h2 className="text-center m-0">Cargando usuarios &nbsp;</h2>
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  }

  return (
    <div className="flex-fill container my-3 justify-content-center">
      <h1 className="text-center">USUARIOS</h1>
      <div className="mb-4 text-center">
        <label htmlFor="genero" className="form-label me-2 fw-bold">
          Mostrar usuarios del género:
        </label>
        <select
          id="genero"
          className="form-select d-inline-block w-auto"
          value={generoFiltrado}
          onChange={(e) => setGeneroFiltrado(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="HOMBRE">Hombres</option>
          <option value="MUJER">Mujeres</option>
          <option value="OTRO">Otro</option>
        </select>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <h3 className="text-center">No hay más usuarios.</h3>
      ) : (
        <div
          key={usuario.id}
          className="position-relative d-flex flex-column flex-md-row border rounded mb-4 mt-3"
          style={{ overflow: "auto", minHeight: "400px" }}
        >
          {isLoading && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
              style={{ zIndex: 10 }}
            >
              <Spinner animation="border" role="status" variant="primary" />
            </div>
          )}

          <div
            className="bg-morado-card d-flex justify-content-center align-items-center"
            style={{
              height: "400px",
              flexBasis: "45%",
              maxWidth: "100%",
            }}
          >
            <Carousel indicators controls style={{ width: "100%" }}>
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
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  </div>
                </Carousel.Item>
              )}
            </Carousel>
          </div>

          <div
            className="p-4 bg-white flex-grow-1 d-flex flex-column"
            style={{ flexBasis: "55%", maxHeight: "400px" }}
          >
            <div className="mb-3">
              <h2>{usuario.name}</h2>
            </div>

            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <div className="mb-3">
                <h5>Descripción</h5>
                <p
                  style={{
                    maxHeight: "100px",
                    overflow: "auto",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {usuario.bio}
                </p>
              </div>

              <div className="d-flex gap-5 mb-3">
                <div className="flex-fill text-center">
                  <h5>Edad</h5>
                  <p>{usuario.age}</p>
                </div>
                <div className="flex-fill text-center">
                  <h5>Fuma</h5>
                  <p>{usuario.fumador ? "Sí, fuma" : "No fumador"}</p>
                </div>
                <div className="flex-fill text-center">
                  <h5>Género</h5>
                  <p>{usuario.genero.toLowerCase()}</p>
                </div>
              </div>
            </div>

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
      )}
    </div>
  );
};

export default People;
