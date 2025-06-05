import { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { Carousel, Spinner } from "react-bootstrap";
import { useAuth } from "../services/AuthContext"; // Asegúrate de importar tu contexto
import { useNavigate } from "react-router-dom"; // Solo si estás usando react-router
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Solo si estás usando react-router


const PerfilUsuario = () => {
  const { isLoggedIn, logout } = useAuth();

  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // opcional

  useEffect(() => {
    setIsLoading(true);

    UsuarioService.getUsuarioDesdeToken()
      .then((response) => {
        setUsuario(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener usuario:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div
        className="d-flex flex-fill justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!usuario) {
    return <h3 className="text-center">Usuario no encontrado</h3>;
  }

  return (
    <div className="flex-fill container my-5">
      <h1 className="text-center mb-4">Mi Perfil</h1>
      <div
        className="d-flex flex-column flex-md-row border rounded mb-4"
        style={{ overflow: "hidden", minHeight: "400px" }}
      >
        {/* Carrusel de fotos */}
        <div
          className="bg-secondary d-flex justify-content-center align-items-center"
          style={{ height: "400px", flexBasis: "45%", maxWidth: "100%" }}
        >
          <Carousel indicators controls style={{ width: "100%" }}>
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

        {/* Info del usuario */}
        <div
          className="p-4 bg-white flex-grow-1 d-flex flex-column"
          style={{ flexBasis: "55%", maxHeight: "400px", overflow: "auto" }}
        >
          <div className="mb-3">
            <h3>{usuario.name}</h3>
          </div>

          {/* Biografía y Edad: crecen según espacio disponible */}
          <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <div className="mb-3">
              <h5>Biografía</h5>
              <p>{usuario.bio}</p>
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

          {/* Botones editar y eliminar */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link
              className="btn btn-primary"
              to={"/editarPerfil"}
            >
              Editar
            </Link>

            <button
              className="btn btn-danger"
              onClick={() => {
                Swal.fire({
                  title: "¿Estás seguro?",
                  text: "Esta acción eliminará tu cuenta permanentemente.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "Sí, eliminar",
                  cancelButtonText: "Cancelar",
                }).then((result) => {
                  if (result.isConfirmed) {
                    UsuarioService.deleteUsuario()
                      .then(() => {
                        Swal.fire(
                          "Eliminado",
                          "Tu cuenta ha sido eliminada.",
                          "success"
                        );
                        logout(); // mejorar con el context
                        localStorage.removeItem("accessToken");
                        navigate("/");
                      })
                      .catch((error) => {
                        console.error("Error al eliminar usuario:", error);
                        Swal.fire(
                          "Error",
                          "Hubo un problema al eliminar tu cuenta.",
                          "error"
                        );
                      });
                  }
                });
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
