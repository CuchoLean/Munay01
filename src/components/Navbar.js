import React from 'react';

const Navbar = () => {
   const navbarStyle = {
    backgroundColor: '#563d7c',
  };
  return (
    <nav className="navbar navbar-expand-lg  text-white py-3" style={navbarStyle}>
      <div className="container d-flex justify-content-between align-items-center">
        <span className="navbar-brand text-white">Mi Sitio</span>
        <div className="ms-auto d-flex gap-3">
          <a href="#info" className="nav-link text-white">Más información</a>
          <a href="#posts" className="nav-link text-white">Posts</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
