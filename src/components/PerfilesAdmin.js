import React, { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { Carousel, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

const PeopleMatches = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const userId = localStorage.getItem("idUsuario");
    if (!userId) return;

    UsuarioService.getUsuariosSinAdmin()
      .then((response) => {
        setUsuarios(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener perfiles:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const eliminarUsuario = (idUsuario) => {
    UsuarioService.deleteUsuarioById(idUsuario)
      .then(() => {
        setUsuarios(usuarios.filter((u) => u.id !== idUsuario));
        Swal.fire("Eliminado", "La cuenta ha sido eliminada.", "success");
      })
      .catch((err) => {
        console.error("Error al eliminar usuario:", err);
        Swal.fire("Error", "Hubo un problema al eliminar la cuenta.", "error");
      });
  };

  if (isLoading) {
    return (
      <div
        className="flex-fill d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="flex-fill container my-5">
      <h1 className="text-center mb-4">Administrar Usuarios</h1>
      {usuarios.length === 0 ? (
        <h3 className="text-center">No hay usuarios.</h3>
      ) : (
        usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="d-flex flex-column flex-md-row border rounded mb-4"
            style={{ overflow: "hidden", minHeight: "400px" }}
          >
            {/* Carrusel de fotos */}
            <div
              className="bg-morado-card d-flex justify-content-center align-items-center"
              style={{ height: "400px", flexBasis: "45%", maxWidth: "100%" }}
            >
              <Carousel
                indicators={true}
                controls={true}
                style={{ width: "100%" }}
              >
                {usuario.foto1 && (
                  <Carousel.Item>
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "400px" }}
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
                      style={{ height: "400px" }}
                    >
                      <img
                        src={`data:image/jpeg;base64,${usuario.foto2}`}
                        alt="Foto 2"
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
              </Carousel>
            </div>

            <div
              className="p-4 bg-white flex-grow-1 d-flex flex-column justify-content-between"
              style={{ flexBasis: "55%", maxHeight: "400px" }}
            >
              <div className="mb-3">
                <h2>{usuario.name}</h2>
              </div>

              {/* Biografía y Edad: crecen según espacio disponible */}
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

              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-danger btn-lg w-100"
                  onClick={() => {
                    Swal.fire({
                      title: "¿Estás seguro?",
                      text: "Esta acción eliminará la cuenta permanentemente.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      confirmButtonText: "Sí, eliminar",
                      cancelButtonText: "Cancelar",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        eliminarUsuario(usuario.id);
                      }
                    });
                  }}
                >
                  Eliminar
                </button>{" "}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PeopleMatches;
