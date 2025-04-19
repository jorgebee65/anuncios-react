import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

const NewAdForm = () => {
  const zonas = ["Orizaba Norte", "Orizaba Centro", "Orizaba Sur", "Cerritos"];

  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const input = e.target.value;

    setFormData((prev) => ({
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

  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const input = e.target.value;

    // Eliminar cualquier carácter que no sea número
    const numeric = input.replace(/\D/g, "");

    // Solo permitir hasta 10 dígitos
    if (numeric.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: numeric,
      }));

      // Validar longitud exacta
      if (numeric.length === 10) {
        setPhoneError("");
      } else {
        setPhoneError("El teléfono debe tener exactamente 10 dígitos");
      }
    }
  };

  const [priceDisplay, setPriceDisplay] = useState("");
  const [priceError, setPriceError] = useState("");

  // Maneja el cambio del campo 'price'
  const handlePriceChange = (e) => {
    const input = e.target.value;

    // Permitir solo números y hasta 2 decimales
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(input) || input === "") {
      const parsed = parseFloat(input);

      // Validaciones de rango
      if (parsed < 0.01 || parsed > 100000) {
        setPriceError("El precio debe estar entre $0.01 y $100,000.00");
      } else {
        setPriceError("");
      }

      setFormData((prev) => ({
        ...prev,
        price: input === "" ? "" : parsed,
      }));

      setPriceDisplay(input);
    }
  };

  // Formatea el número al salir del input (onBlur)
  const handlePriceBlur = () => {
    const price = formData.price;
    if (price !== "" && !priceError) {
      const formatted = Number(price).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
      });
      setPriceDisplay(formatted);
    }
  };

  // Quita el formato al entrar al input (onFocus)
  const handlePriceFocus = () => {
    if (formData.price !== "") {
      setPriceDisplay(formData.price.toString());
    }
  };

  const [formData, setFormData] = useState({
    shareLink: "",
    title: "",
    description: "",
    price: "",
    image: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    zone: "",
    category: null,
  });

  const [categories, setCategories] = useState([]);

  const generateRandomAd = (categories, zonas) => {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomZona = zonas[Math.floor(Math.random() * zonas.length)];

    return {
      shareLink: `https://mianuncio.com/a/${Math.random()
        .toString(36)
        .substring(7)}`,
      title: "Producto misterioso " + Math.floor(Math.random() * 1000),
      description:
        "Este es un producto increíble que no puedes perderte. ¡Edición limitada!",
      price: (Math.random() * 1000 + 100).toFixed(2),
      image: "https://images.unsplash.com/photo-1592496001020-5c0b6a8309f3",
      phone: "55" + Math.floor(10000000 + Math.random() * 89999999).toString(),
      email: `user${Math.floor(Math.random() * 1000)}@example.com`,
      facebook: "https://facebook.com/exampleprofile",
      instagram: "https://instagram.com/exampleprofile",
      zone: randomZona,
      category: randomCategory,
    };
  };

  useEffect(() => {
    axios
      .get("http://localhost:8585/api/v1/categories")
      .then((res) => {
        const cats = res.data;
        setCategories(cats);
        const randomData = generateRandomAd(cats, zonas);
        setFormData(randomData);
        setPriceDisplay(randomData.price);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedCategory = categories.find((cat) => cat.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8585/api/v1/advertises", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSnackbar({
        open: true,
        message: "Anuncio creado correctamente",
        severity: "success",
      });
      // Opcional: resetear el formulario
      setFormData({
        shareLink: "",
        title: "",
        description: "",
        price: "",
        image: "",
        phone: "",
        email: "",
        facebook: "",
        instagram: "",
        zone: "",
        category: null,
      });
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Crear nuevo anuncio
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={3}>
            <TextField
              fullWidth
              select
              label="Zona"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
            >
              {zonas.map((zona) => (
                <MenuItem key={zona} value={zona}>
                  {zona}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={8}>
            <TextField
              fullWidth
              select
              label="Categoría"
              value={formData.category?.id || ""}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.description}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              helperText={`${formData.description.length}/500 caracteres`}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Precio"
              name="price"
              value={priceDisplay}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              onFocus={handlePriceFocus}
              error={!!priceError}
              helperText={priceError}
            />
          </Grid>

          <Grid size={8}>
            <TextField
              fullWidth
              label="Imagen (URL)"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={8}>
            <TextField
              fullWidth
              label="Link para compartir"
              name="shareLink"
              value={formData.shareLink}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              error={!!phoneError}
              helperText={phoneError}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="Instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={8}>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Publicar anuncio
            </Button>
          </Grid>
        </Grid>
      </form>
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
    </Container>
  );
};

export default NewAdForm;
