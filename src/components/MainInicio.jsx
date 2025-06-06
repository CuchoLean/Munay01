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
      <main
        className="flex-fill d-flex justify-content-center align-items-center text-center bg-cover"
       
      >
        <div className="bg-morado-opacidad  p-5 rounded shadow-lg">
          <h1 className="text-white mb-4 display-4 fw-bold">Bienvenido</h1>
          <div className="d-flex gap-4 justify-content-center">
            <button className="btn btn-outline-light px-4 py-2" onClick={handleOpenModal2}>
              Iniciar sesión
            </button>
            <button className="btn btn-outline-light px-4 py-2" onClick={handleOpenModal}>
              Registrarse
            </button>
          </div>
        </div>
      </main>

      {/* Registro Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">Crear cuenta</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body px-4 pb-4">
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

      {/* Login Modal */}
      {showModal2 && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal2}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">Iniciar sesión</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal2}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body px-4 pb-4">
                <LoginForm
                  onClose={handleCloseModal2}
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
