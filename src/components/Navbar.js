import React from "react";
import { useAuth } from "../services/AuthContext"; // Asegúrate de importar tu contexto
import { useNavigate } from "react-router-dom"; // Solo si estás usando react-router

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate(); // opcional

  const navbarStyle = {
    backgroundColor: "#563d7c",
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // o redirige a donde quieras
  };

  return (
    <nav className="navbar navbar-expand-lg " style={navbarStyle}>
      <div className="container-fluid px-3">
        {" "}
        {/* px-3 = padding horizontal 1rem aprox */}
        <a className="navbar-brand">Navbar</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="ww.gogle.com">Más información</a>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Posts
                  </a>
                  <div
                    className="dropdown-menu mb-3 mb-md-0"
                    aria-labelledby="navbarDropdown"
                  >
                    <a className="dropdown-item">Ver post</a>
                    <a className="dropdown-item">Ver mis posts</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item">Something else here</a>
                  </div>
                </li>
              </>
            )}
          </ul>

          {isLoggedIn && (
            <>
              <div
                className="d-flex flex-column flex-lg-row ms-auto gap-2"
              >
                <button
                  className="btn btn-outline-light  "
                >
                  Editar perfil
                </button>
                <button
                  className="btn btn-outline-light "
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
