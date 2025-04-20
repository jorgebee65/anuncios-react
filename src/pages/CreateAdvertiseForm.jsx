import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  InputLabel,
  MenuItem,
} from "@mui/material";

const baseUrl = window?.env?.VITE_API_URL || "http://localhost:8585";
const CreateAdvertiseForm = () => {
  const { id } = useParams();
  const zonas = ["Orizaba Norte", "Orizaba Centro", "Orizaba Sur", "Cerritos"];
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    zone: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
  });

  // Cargar categorías (se ejecuta solo una vez)
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/categories`)
      .then((res) => {
        const cats = res.data;
        setCategories(cats);
      })
      .catch((err) => console.error(err));
  }, []);

  // Cargar anuncio si estamos en modo edición (id presente)
  useEffect(() => {
    if (id) {
      axios
        .get(`${baseUrl}/api/v1/advertises/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Error al cargar anuncio", err));
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Si roles es un array:
        const roles = decoded.roles;
        if (Array.isArray(roles)) {
          setRole(roles[0]); // O muestra todos si quieres
        } else {
          setRole(roles);
        }
      } catch (e) {
        console.error("Token inválido:", e);
      }
    }
  }, [location]);

  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedCategory = categories.find((cat) => cat.id === selectedId);
    setForm((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
  };

  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !id) {
      setSnackbar({
        open: true,
        message: "Selecciona una imagen",
        severity: "warning",
      });
      return;
    }

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("data", JSON.stringify(form));

      if (id) {
        // PUT para actualizar
        await axios.put(
          `${baseUrl}/api/v1/advertises/${id}/with-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // POST para crear
        await axios.post(`${baseUrl}/api/v1/advertises/with-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      setSnackbar({
        open: true,
        message: "Anuncio creado correctamente",
        severity: "success",
      });
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        zone: "",
        phone: "",
        email: "",
        facebook: "",
        instagram: "",
      });
      setFile(null);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error al crear el anuncio",
        severity: "error",
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto", mt: 4 }}
    >
      <Typography variant="h4" mb={2}>
        Crear Anuncio
      </Typography>

      <TextField
        fullWidth
        label="Título"
        name="title"
        value={form.title}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Descripción"
        name="description"
        value={form.description}
        onChange={handleChange}
        sx={{ mb: 2 }}
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Precio"
        name="price"
        value={form.price}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        select
        label="Categoría"
        value={form.category?.id || ""}
        onChange={handleCategoryChange}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.description}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        select
        label="Zona"
        name="zone"
        value={form.zone}
        onChange={handleChange}
      >
        {zonas.map((zona) => (
          <MenuItem key={zona} value={zona}>
            {zona}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Teléfono"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Facebook"
        name="facebook"
        value={form.facebook}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Instagram"
        name="instagram"
        value={form.instagram}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <InputLabel sx={{ mb: 1 }}>Seleccionar Imagen</InputLabel>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: "16px" }}
      />
      {role === "ROLE_ADMIN" && (
        <Button type="submit" variant="contained" fullWidth>
          {id ? "Actualizar" : "Crear Nuevo"}
        </Button>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateAdvertiseForm;
