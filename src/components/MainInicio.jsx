import React, { useState } from "react";
import RegistroForm from "./RegistroForm";

function MainInicio() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <main className="flex-fill d-flex justify-content-center align-items-center text-center bg-cover">
        <div>
          <h1 className="text-white mb-4">Bienvenido</h1>
          <div className="d-flex gap-4 justify-content-center">
            <button className="btn btn-light px-4">Inicio de sesión</button>
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
            <div className="modal-content">
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
                <RegistroForm onClose={handleCloseModal} /> {/* ✅ se pasa aquí */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainInicio;
