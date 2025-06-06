import React from "react";
import { useAuth } from "../services/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const generoUsuario = localStorage.getItem("generoUsuario");

  const handleInicioClick = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Si vas a Inicio, se cerrará tu sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow"
      style={{
        background: "linear-gradient(90deg, #4b1d84, #2c0d5f)",
        padding: "0.75rem 1.5rem",
        fontWeight: "600",
      }}
    >
      <div className="container-fluid">
        {/* MUNAY logo */}
        <span
          onClick={handleInicioClick}
          className="navbar-brand d-flex align-items-center text-light"
          style={{ cursor: "pointer" }}
        >
          <span className="d-flex align-items-center">
            MUNAY{" "}
            <FaHeart
              style={{
                color: "#d3b9ff",
                marginLeft: "8px",
                fontSize: "1.2rem",
              }}
            />
          </span>
        </span>

        <button
          className="navbar-toggler border-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Inicio */}
            <li className="nav-item">
              <span
                onClick={handleInicioClick}
                className="nav-link text-light"
                style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
              >
                Inicio
              </span>
            </li>

            {/* Más información */}
            <li className="nav-item">
              <NavLink
                to="/informacion"
                className={({ isActive }) =>
                  "nav-link text-light" + (isActive ? " active fw-bold" : "")
                }
                style={{ padding: "0.5rem 1rem" }}
              >
                Más información
              </NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/people"
                    className={({ isActive }) =>
                      "nav-link text-light" + (isActive ? " active fw-bold" : "")
                    }
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    Conocer
                  </NavLink>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-light"
                    href="#!"
                    id="postsDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer", padding: "0.5rem 1rem" }}
                  >
                    Posts
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-dark"
                    aria-labelledby="postsDropdown"
                  >
                    <li>
                      <NavLink to="/posts" className="dropdown-item">
                        Ver posts
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/misPosts" className="dropdown-item">
                        Ver mis posts
                      </NavLink>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <NavLink to="/crearPost" className="dropdown-item">
                        Crear post
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/matches"
                    className={({ isActive }) =>
                      "nav-link text-light" + (isActive ? " active fw-bold" : "")
                    }
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    Matches
                  </NavLink>
                </li>

                {generoUsuario === "ADMIN" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle text-light"
                      href="#!"
                      id="adminDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ cursor: "pointer", padding: "0.5rem 1rem" }}
                    >
                      Administrador
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-dark"
                      aria-labelledby="adminDropdown"
                    >
                      <li>
                        <NavLink to="/admin-posts" className="dropdown-item">
                          Posts
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/admin-perfiles" className="dropdown-item">
                          Usuarios
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                )}
              </>
            )}
          </ul>

          {isLoggedIn && (
            <div className="d-flex flex-column flex-lg-row ms-auto gap-3">
              <NavLink
                to="/perfil"
                className="btn btn-outline-light rounded-pill px-5"
                style={{ fontWeight: "600" }}
              >
                Mi perfil
              </NavLink>
              <button
                className="btn btn-outline-light rounded-pill px-5 text-purple fw-semibold"
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
