import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PriceInput from "../components/form/PriceInput";
import EmailInput from "../components/form/EmailInput";
import PhoneInput from "../components/form/PhoneInput";
import CategorySelect from "../components/form/CategorySelect";
import ZoneSelect from "../components/form/ZoneSelect";

import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import ImageUpload from "../components/ImageUpload";

const baseUrl = window?.env?.VITE_API_URL || "http://localhost:8585";
const zonas = ["Orizaba Norte", "Orizaba Centro", "Orizaba Sur", "Cerritos"];
const CreateAdvertiseForm = () => {
  const { id } = useParams();
  const [displayPrice, setDisplayPrice] = useState("");
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
        const roles = decoded.roles;
        if (Array.isArray(roles)) {
          setRole(roles[0]);
        } else {
          setRole(roles);
        }
      } catch (e) {
        console.error("Token inválido:", e);
      }
    }
  }, []);

  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !id) {
      showSnackbar("Selecciona una imagen", "warning");
      return;
    }

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("data", JSON.stringify(form));

      if (id) {
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
        await axios.post(`${baseUrl}/api/v1/advertises/with-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      showSnackbar("Anuncio creado correctamente");
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
      showSnackbar("Error al crear el anuncio", "error");
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
      <PriceInput
        displayPrice={displayPrice}
        setDisplayPrice={setDisplayPrice}
        form={form}
        handleChange={handleChange}
      />
      <CategorySelect
        value={form.category}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            category: e.target.category,
          }));
          console.log(form);
        }}
      />
      <ZoneSelect
        zonas={zonas}
        value={form.zone}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            zone: e.target.value,
          }))
        }
      />
      <PhoneInput form={form} setForm={setForm} />
      <EmailInput form={form} setForm={setForm} />
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
