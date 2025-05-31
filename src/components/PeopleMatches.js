import React, { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import { Carousel, Spinner } from "react-bootstrap";
import ChatModal from "./ChatModal";

const PeopleMatches = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const currentUser = localStorage.getItem("idUsuario"); // o email/nombre según tu modelo
  const [chatHistories, setChatHistories] = useState({});

  const [receiverName, setReceiverName] = useState({});

  useEffect(() => {
    setIsLoading(true);
    const userId = localStorage.getItem("idUsuario");
    if (!userId) return;

    UsuarioService.getUsuariosConMatch(userId)
      .then((response) => {
        setUsuarios(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener matches:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
      <h1 className="text-center mb-4">MATCHES</h1>
      {usuarios.length === 0 ? (
        <h3 className="text-center">No hay matches. Lo siento</h3>
      ) : (
        usuarios.map((usuario) => (
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

            {/* Info y botón de chat */}
            <div
              className="p-4 bg-white flex-grow-1 d-flex flex-column justify-content-between"
              style={{ flexBasis: "55%" }}
            >
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
              </div>

              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={() => {
                    setReceiver(usuario.id);
                    setReceiverName(usuario.name); // o el identificador correcto
                    setShowModal(true);
                  }}
                >
                  Chat
                </button>{" "}
              </div>
            </div>
          </div>
        ))
      )}
      {receiver && (
        <ChatModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setReceiver(null);
          }}
          currentUser={currentUser}
          receiverUser={receiver}
          receiverName={receiverName}
          onUpdateMessages={(receiverId, newMessages) => {
            setChatHistories((prev) => ({
              ...prev,
              [receiverId]: newMessages,
            }));
          }}
        />
      )}
    </div>
  );
};

export default PeopleMatches;
