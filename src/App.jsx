import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AdvertiseDetail from "./pages/AdvertiseDetail";
import CreateAdvertiseForm from "./pages/CreateAdvertiseForm";
import Register from "./pages/Register"; // ← importa tu componente de registro
import LoginPage from "./pages/LoginPage";

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anuncio/:id" element={<AdvertiseDetail />} />
        <Route path="/nuevo-anuncio/:id" element={<CreateAdvertiseForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
