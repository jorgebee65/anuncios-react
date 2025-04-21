import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setFirstName(decoded.firstName);
        const roles = decoded.roles;
        setRole(Array.isArray(roles) ? roles[0] : roles);
      } catch (e) {
        console.error("Token inválido:", e);
        setIsAuthenticated(false);
      }
    }
  }, [location]);

  const goTo = (path) => {
    setAnchorEl(null);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAnchorEl(null);
    navigate("/");
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const renderMenuItems = () => {
    const items = [
      <MenuItem key="home" onClick={() => goTo("/")}>
        Inicio
      </MenuItem>,
      !isAuthenticated && (
        <MenuItem key="register" onClick={() => goTo("/register")}>
          Registrarse
        </MenuItem>
      ),
      !isAuthenticated && (
        <MenuItem key="login" onClick={() => goTo("/login")}>
          Iniciar Sesión
        </MenuItem>
      ),
      isAuthenticated && (
        <MenuItem key="logout" onClick={handleLogout}>
          Cerrar Sesión
        </MenuItem>
      ),
      <MenuItem key="create" onClick={() => goTo("/nuevo-anuncio")}>
        Crear Anuncio
      </MenuItem>,
    ];

    // Filtramos los `false` o `null` de los condicionales
    return items.filter(Boolean);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              onClick={openMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
              {renderMenuItems()}
            </Menu>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                cursor: isMobile ? "pointer" : "default", // cambia el cursor solo en móvil
              }}
              onClick={isMobile ? () => goTo("/") : undefined} // solo clickeable en móvil
            >
              Anuncios Orizaba
            </Typography>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => goTo("/")}
            >
              Inicio
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {isAuthenticated && (
              <Typography variant="body1" sx={{ mr: 2 }}>
                <strong>{firstName}</strong>
              </Typography>
            )}
            {!isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => goTo("/register")}
                  sx={{ mr: 2 }}
                >
                  Registrarse
                </Button>
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  onClick={() => goTo("/login")}
                  sx={{ mr: 2 }}
                >
                  Iniciar Sesión
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ mr: 2 }}
              >
                Cerrar Sesión
              </Button>
            )}
            <Button
              color="secondary"
              variant="contained"
              onClick={() => goTo("/nuevo-anuncio")}
            >
              Crear Anuncio
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
