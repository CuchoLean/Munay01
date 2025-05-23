import "./App.css";
import Navbar from "./components/Navbar"; // 👈 importa el componente
import Footer from "./components/Footer"; // 👈 importa el componente
import MainInicio from "./components/MainInicio";

import React, { useState } from "react";


function App() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
  

       <div className="app d-flex flex-column min-vh-100">
      <Navbar />
      <MainInicio />
      <Footer />
    </div>
    
  );
}


export default App;
