import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Forma correcta en Vite

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // importante para detectar navegación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);

        // Si roles es un array:
        const roles = decoded.roles;
        if (Array.isArray(roles)) {
          setRole(roles[0]); // O muestra todos si quieres
        } else {
          setRole(roles);
        }
      } catch (e) {
        console.error("Token inválido:", e);
        setIsAuthenticated(false);
      }
    }
  }, [location]);

  const goToHome = () => {
    navigate("/");
  };

  const goToCreateAd = () => {
    navigate("/nuevo-anuncio");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" startIcon={<HomeIcon />} onClick={goToHome}>
          Inicio
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated && role && (
          <Typography variant="body1" sx={{ mr: 2 }}>
            Rol: <strong>{role}</strong>
          </Typography>
        )}
        {isAuthenticated ? (
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ mr: 2 }}
          >
            Cerrar Sesión
          </Button>
        ) : (
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={goToLogin}
            sx={{ mr: 2 }}
          >
            Iniciar Sesión
          </Button>
        )}

        <Button color="secondary" variant="contained" onClick={goToCreateAd}>
          Crear Anuncio
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
