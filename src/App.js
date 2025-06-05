import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter >
      <div className="app d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<MainInicio />}></Route>
          <Route path="/people" element={<People />} />
          <Route path="/matches" element={<PeopleMatches />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
          <Route path="/editarPerfil" element={<EditarPerfil />} />
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/crearPost" element={<CrearPost />} />
          <Route path="/misPosts" element={<MisPosts />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/editar-post/:id" element={<EditarPost />} />
          <Route path="/admin-perfiles" element={<PerfilesAdmin />} />
          <Route path="/admin-posts" element={<PostsAdmin />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
