import { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { Spinner, Carousel } from "react-bootstrap";
import Swal from "sweetalert2";

const ListaUsuariosSinAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    setIsLoading(true);
    UsuarioService.getUsuariosSinAdmin()
      .then((response) => {
        setUsuarios(response.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios sin admin:", err);
        setError("No se pudieron cargar los usuarios.");
      })
      .finally(() => setIsLoading(false));
  };

  const eliminarUsuario = (idUsuario) => {
    UsuarioService.deleteUsuarioById(idUsuario)
      .then(() => {
        setUsuarios(usuarios.filter((u) => u.id !== idUsuario));
        Swal.fire("Eliminado", "La cuenta ha sido eliminada.", "success");
      })
      .catch((err) => {
        console.error("Error al eliminar usuario:", err);
        Swal.fire(
          "Error",
          "Hubo un problema al eliminar la cuenta.",
          "error"
        );
      });
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  if (usuarios.length === 0) {
    return <p className="text-center">No hay usuarios para mostrar.</p>;
  }

  return (
    <div className="container flex-fill my-5">
      <h2 className="mb-4 text-center">Usuarios </h2>

      {usuarios.map((usuario) => (
        <div
          key={usuario.id}
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
            className="p-4 bg-white flex-grow-1 d-flex flex-column justify-content-between"
            style={{ flexBasis: "55%", maxHeight: "400px", overflow: "auto" }}
          >
            <div>
              <h3>{usuario.name}</h3>

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

            {/* Botón de eliminar */}
            <div className="d-flex justify-content-center mt-4 gap-2">
              <button
                className="btn btn-danger px-4"
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
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaUsuariosSinAdmin;
