import React, { useEffect, useState } from "react";
import UsuarioService from "../services/UsuarioService";

const PostCard = ({ post }) => (
  <div className="col-12 col-sm-6 col-lg-4">
    <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden">
    <div
  className="overflow-hidden"
  style={{
    height: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3b2a72", // morado oscuro un poco más claro

  }}
>
  <img
    src={`data:image/jpeg;base64,${post.imagen}`}
    alt="Post"
    className="card-img-top img-fluid"
    style={{
      maxHeight: "100%",
      width: "auto",
      transition: "transform 0.4s ease",
      
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
  />
</div>

      <div className="card-body">
        <h5
          className="card-title  fw-semibold mb-2"
          style={{ color: "#5e2b97"  }} // morado oscuro
        >
          {post.nombreUsuario}
        </h5>
        <p className="card-text text-secondary" style={{ fontSize: "0.95rem" }}>
          {post.texto}
        </p>
      </div>
    </div>
  </div>
);

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UsuarioService.getTodosLosPosts()
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error al cargar los posts:", error))
      .finally(() => setLoading(false));
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-muted">Cargando posts...</p>;
    }

    if (posts.length === 0) {
      return (
        <p className="text-center fst-italic text-muted">
          No hay posts subidos
        </p>
      );
    }

    return (
      <div className="row g-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-fill container py-4">
      <h1 className="text-center mb-5 fw-bold text-dark">
        Posts de la comunidad
      </h1>
      {renderContent()}
    </div>
  );
};

export default Posts;
