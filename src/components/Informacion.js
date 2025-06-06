import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Informacion = () => {
  return (
    <section className="bg-light py-5">
      <div className="container text-center">
        <img
          src="/img/info.jpg"
          alt="Pareja feliz"
          className="img-fluid rounded mb-4 shadow"
          style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
        />

        <h1 className="display-4 fw-bold text-primary">
          Bienvenido a Munay ❤️
        </h1>
        <p className="lead mt-3 mb-4">
          Tu nueva web de citas para conectar con personas reales, afines a ti,
          y construir relaciones significativas. ¡Descubre el amor de forma
          sencilla, segura y auténtica!
        </p>

        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-heart-fill text-danger fs-1"></i>
                <h5 className="card-title mt-3">Conecta con personas reales</h5>
                <p className="card-text">
                  Gracias a nuestro sistema de matches mutuos, solo conversas
                  con quienes también están interesados en ti.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-chat-dots-fill text-primary fs-1"></i>
                <h5 className="card-title mt-3">Chatea al instante</h5>
                <p className="card-text">
                  Envía mensajes y comienza conversaciones
                  interesantes con tus coincidencias.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-shield-lock-fill text-success fs-1"></i>
                <h5 className="card-title mt-3">Seguridad y privacidad</h5>
                <p className="card-text">
                  Toda tu información está protegida. Tú decides qué compartir y
                  cuándo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Link to="/" className="btn btn-primary btn-lg px-4 py-2">
            ¡Empieza ahora!
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Informacion;
