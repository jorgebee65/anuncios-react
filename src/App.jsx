import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AdvertiseDetail from "./pages/AdvertiseDetail";
import CreateAdvertiseForm from "./pages/CreateAdvertiseForm";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

const App = () => (
  <Router>
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anuncio/:id" element={<AdvertiseDetail />} />
          <Route
            path="/nuevo-anuncio"
            element={
              <PrivateRoute>
                <CreateAdvertiseForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/nuevo-anuncio/:id"
            element={
              <PrivateRoute>
                <CreateAdvertiseForm />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  </Router>
);

export default App;
