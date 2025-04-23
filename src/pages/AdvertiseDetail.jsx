import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  Box,
  Typography,
  Button,
} from "@mui/material";

const AdvertiseDetail = () => {
  const baseUrl = window?.env?.VITE_API_URL || "http://localhost:8585";
  const { id } = useParams(); // <- ID dinámico desde la URL
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const openDeleteDialog = () => setOpenDialog(true);
  const closeDeleteDialog = () => setOpenDialog(false);
  const [role, setRole] = useState(null);
  const [showButton, setShowButton] = useState(false);

  const handleEditClick = () => {
    navigate(`/nuevo-anuncio/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/api/v1/advertises/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSnackbar({
        open: true,
        message: "Anuncio eliminado correctamente",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 1500); // redirige después de 1.5s
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar el anuncio",
        severity: "error",
      });
    } finally {
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    let decodedUser = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        decodedUser = decoded.sub;
        const roles = decoded.roles;
        setRole(Array.isArray(roles) ? roles[0] : roles);
      } catch (e) {
        console.error("Token inválido:", e);
      }
    }

    const fetchAdvertise = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/advertises/${id}`);
        setAd(data);

        if (decodedUser && data.user === decodedUser) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      } catch (error) {
        console.error("Error loading ad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertise();
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!ad) return <Typography variant="h6">Anuncio no encontrado</Typography>;

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <CardMedia
        component="img"
        image={ad.image}
        title={ad.title}
        sx={{
          width: {
            xs: "100%", // móvil: ocupa todo el ancho disponible
            md: "60%", // escritorio: 60% del contenedor padre
          },
          maxWidth: "800px", // no exceder en pantallas muy grandes
          height: "auto", // mantener proporción de la imagen
          display: "block",
          mx: "auto", // centra horizontalmente
          borderRadius: 2, // opcional: bordes redondeados
        }}
      />
      <Box p={3}>
        <Typography variant="h4">{ad.title}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {ad.description}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Precio: ${ad.price}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Categoría: {ad.category.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Publicado por: {ad.user}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Zona: {ad.zone}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Contacto: {ad.phone} / {ad.email}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Redes: <a href={ad.facebook}>Facebook</a> |{" "}
          <a href={ad.instagram}>Instagram</a>
        </Typography>

        {showButton && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={openDeleteDialog}
              sx={{ mt: 2, mr: 1 }}
            >
              Eliminar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
              sx={{ mt: 2 }}
            >
              Editar
            </Button>
          </>
        )}
      </Box>
      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AdvertiseDetail;
