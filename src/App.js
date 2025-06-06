import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainInicio from "./components/MainInicio";
import People from "./components/People";
import PeopleMatches from "./components/PeopleMatches";
import PerfilUsuario from "./components/PerfilUsuario";
import EditarPerfil from "./components/EditarPerfil";
import Informacion from "./components/Informacion";
import CrearPost from "./components/CrearPost";
import Posts from "./components/Posts";
import MisPosts from "./components/misPosts";
import EditarPost from "./components/EditarPost";
import PerfilesAdmin from "./components/PerfilesAdmin";
import PostsAdmin from "./components/PostsAdmin";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="app d-flex flex-column min-vh-100 bg-morado-suave">
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<MainInicio />} />
          <Route path="/informacion" element={<Informacion />} />

          {/* Rutas privadas */}
          <Route
            path="/people"
            element={
              <PrivateRoute>
                <People />
              </PrivateRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <PeopleMatches />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <PerfilUsuario />
              </PrivateRoute>
            }
          />
          <Route
            path="/editarPerfil"
            element={
              <PrivateRoute>
                <EditarPerfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/crearPost"
            element={
              <PrivateRoute>
                <CrearPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/misPosts"
            element={
              <PrivateRoute>
                <MisPosts />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <Posts />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar-post/:id"
            element={
              <PrivateRoute>
                <EditarPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-perfiles"
            element={
              <PrivateRoute requireAdmin={true}>
                <PerfilesAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-posts"
            element={
              <PrivateRoute requireAdmin={true}>
                <PostsAdmin />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
