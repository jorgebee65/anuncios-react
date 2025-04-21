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
import ImageUpload from "../components/ImageUpload";

const baseUrl = window?.env?.VITE_API_URL || "http://localhost:8585";
const CreateAdvertiseForm = () => {
  const { id } = useParams();
  const zonas = ["Orizaba Norte", "Orizaba Centro", "Orizaba Sur", "Cerritos"];
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState(null);
  const [displayPrice, setDisplayPrice] = useState("");
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

  useEffect(() => {
    if (!form.zone) {
      setForm((prev) => ({ ...prev, zone: zonas[0] }));
    }
  }, []);

  // Cargar categorías (se ejecuta solo una vez)
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/categories`)
      .then((res) => {
        const cats = res.data;
        setCategories(cats);
        const varios = cats.find((cat) => cat.description === "VARIOS");
        if (varios && !form.category) {
          setForm((prev) => ({ ...prev, category: varios }));
        }
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

  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const input = e.target.value;

    const numeric = input.replace(/\D/g, "");

    if (numeric.length <= 10) {
      setForm((prev) => ({
        ...prev,
        phone: numeric,
      }));

      if (numeric.length === 10) {
        setPhoneError("");
      } else {
        setPhoneError("El teléfono debe tener exactamente 10 dígitos");
      }
    }
  };

  const [emailError, setEmailError] = useState("");
  const handleEmailChange = (e) => {
    const input = e.target.value;

    setForm((prev) => ({
      ...prev,
      email: input,
    }));

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(input)) {
      setEmailError("Correo electrónico no válido");
    } else {
      setEmailError("");
    }
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
        slotProps={{
          htmlInput: {
            maxLength: 100, // Limitar a 250 caracteres
          },
        }}
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
        slotProps={{
          htmlInput: {
            maxLength: 250, // Limitar a 250 caracteres
          },
        }}
      />
      <Typography variant="body2" color="textSecondary" align="right">
        {form.description.length} / 250 caracteres
      </Typography>
      <TextField
        fullWidth
        label="Precio"
        name="price"
        value={displayPrice}
        onChange={(e) => {
          const rawValue = e.target.value;
          const numericValue = rawValue.replace(/[^0-9.]/g, "");

          setDisplayPrice(numericValue);
          handleChange({
            target: {
              name: "price",
              value: numericValue,
            },
          });
        }}
        onBlur={() => {
          const value = parseFloat(form.price);
          if (!isNaN(value)) {
            const formatted = new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              minimumFractionDigits: 2,
            }).format(value);

            setDisplayPrice(formatted);
          }
        }}
        onFocus={() => {
          setDisplayPrice(form.price);
        }}
        sx={{ mb: 2 }}
        slotProps={{
          htmlInput: {
            inputMode: "decimal",
          },
        }}
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
        onChange={handlePhoneChange}
        error={!!phoneError}
        helperText={phoneError}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleEmailChange}
        error={!!emailError}
        helperText={emailError}
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

      <ImageUpload file={file} setFile={setFile} />
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
