import React from "react";
import { useAuth } from "../services/AuthContext"; 
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const navbarStyle = {
    backgroundColor: "#563d7c",
  };

  // Leer el rol de usuario desde localStorage
  const generoUsuario = localStorage.getItem("generoUsuario");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg " style={navbarStyle}>
      <div className="container-fluid px-3">
        <a className="navbar-brand text-white">MUNAY</a>
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
              <a className="nav-link text-white">Inicio</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/informacion">
                Mas informacion
              </Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/people">
                    Conocer
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
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
                    <Link className="dropdown-item" to="/posts">Ver posts</Link>
                    <Link className="dropdown-item" to="/misPosts">Ver mis posts</Link>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/crearPost">Crear post</Link>
                  </div>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/matches">
                    Matches
                  </Link>
                </li>

                {/* Dropdown Administrador solo para ADMIN */}
                {generoUsuario === "ADMIN" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle text-white"
                      id="adminDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Administrador
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="adminDropdown"
                    >
                      <Link className="dropdown-item" to="/admin-posts">Posts</Link>
                      <Link className="dropdown-item" to="/admin-perfiles">Perfiles</Link>
                    </div>
                  </li>
                )}
              </>
            )}
          </ul>

          {isLoggedIn && (
            <div className="d-flex flex-column flex-lg-row ms-auto gap-2">
              <Link to="/perfil" className="btn btn-outline-light">
                Mostrar perfil
              </Link>
              <button
                className="btn btn-outline-light "
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
