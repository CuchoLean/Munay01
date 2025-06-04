import React, { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const MyPostCard = ({ post, onEdit, onDelete }) => (
  <div className="col-12 col-sm-6 col-lg-4">
    <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden d-flex flex-column">
      <div className="overflow-hidden" style={{ height: "220px" }}>
        <img
          src={`data:image/jpeg;base64,${post.imagen}`}
          alt="Post"
          className="card-img-top img-fluid"
          style={{
            maxHeight: "220px",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
      <div className="card-body flex-grow-1">
        <h5
          className="card-title fw-semibold mb-2"
          style={{ color: "#5e2b97" }} // morado oscuro
        >
          {post.nombreUsuario}
        </h5>
        <p className="card-text text-secondary" style={{ fontSize: "0.95rem" }}>
          {post.texto}
        </p>
      </div>
      <div className="card-footer bg-transparent border-0 d-flex justify-content-center gap-4">
        <button className="btn btn-primary" onClick={() => onEdit(post)}>
          Editar
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(post.id)}>
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

const MisPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    UsuarioService.getMisPosts()
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error al cargar mis posts:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (post) => {
    navigate(`/editar-post/${post.id}`);
  };

  const handleDelete = (idPost) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        UsuarioService.eliminarPost(idPost)
          .then(() => {
            setPosts(posts.filter((post) => post.id !== idPost));
            Swal.fire("Eliminado", "Tu post ha sido eliminado.", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar el post:", error);
            Swal.fire(
              "Error",
              "No se pudo eliminar el post. Intenta de nuevo.",
              "error"
            );
          });
      }
    });
  };

  if (loading) {
    return <p className="text-center text-muted">Cargando tus posts...</p>;
  }



return (
  <div className="container py-4 flex-fill">
    <h1 className="text-center mb-5 fw-bold text-dark">Mis Posts</h1>
    {posts.length === 0 ? (
      <p className="text-center fst-italic text-muted">No has subido posts aún.</p>
    ) : (
      <div className="row g-4">
        {posts.map((post) => (
          <MyPostCard
            key={post.id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    )}
  </div>
);

};

export default MisPosts;
