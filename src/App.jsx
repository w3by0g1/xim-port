import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import WorksPage from "./pages/WorksPage";
import WorksOverviewPage from "./pages/WorksOverviewPage";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works" element={<WorksOverviewPage />} />
        <Route path="/works/:category" element={<WorksPage />} />
        <Route path="/works/:category/:slug?" element={<WorksPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
