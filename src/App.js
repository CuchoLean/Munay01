import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainInicio from "./components/MainInicio";
import People from "./components/People";
import PeopleMatches from "./components/PeopleMatches";


function App() {
  return (
    <BrowserRouter>
      <div className="app d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<MainInicio />}></Route>
          <Route path="/people" element={<People />} />
          <Route path="/matches" element={<PeopleMatches />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
