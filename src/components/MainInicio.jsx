import React, { useState } from "react";
import RegistroForm from "./RegistroForm";
import LoginForm from "./LoginForm";
import Swal from "sweetalert2";

function MainInicio() {
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [showModal2, setShowModal2] = useState(false);
  const handleOpenModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const showSuccessMessage = (msg) => {
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: msg,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  return (
    <>
      <main className="flex-fill d-flex justify-content-center align-items-center text-center bg-cover">
        <div>
          <h1 className="text-white mb-4">Bienvenido</h1>
          <div className="d-flex gap-4 justify-content-center">
            <button className="btn btn-light px-4" onClick={handleOpenModal2}>
              Inicio de sesión
            </button>
            <button className="btn btn-light px-4" onClick={handleOpenModal}>
              Registro
            </button>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal} // Cierra modal al clicar fuera
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()} // Evita cierre al clicar dentro
          >
            <div className="modal-content bg-light">
              <div className="modal-header">
                <h5 className="modal-title">Creación de la cuenta</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <RegistroForm
                  onClose={handleCloseModal}
                  onSuccess={(msg) => {
                    handleCloseModal();
                    showSuccessMessage(msg);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal2 && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal2} // Cierra modal al clicar fuera
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()} // Evita cierre al clicar dentro
          >
            <div className="modal-content bg-light">
              <div className="modal-header">
                <h5 className="modal-title">Creación de la cuenta</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal2}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <LoginForm
                  onClose={handleCloseModal2}
                  onSuccess={(msg) => {
                    handleCloseModal2();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainInicio;
