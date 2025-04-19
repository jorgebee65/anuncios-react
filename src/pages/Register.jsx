import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const baseUrl = import.meta.env.VITE_API_URL;
// 🧠 Validación actualizada
const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  username: Yup.string()
    .min(3, "Debe tener al menos 3 caracteres")
    .required("El nombre de usuario es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

const Register = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMessage("");
    setError("");

    try {
      // Solo enviar username y password
      const response = await axios.post(`${baseUrl}/api/v1/auth/register`, {
        username: values.username,
        password: values.password,
        firstName: values.firstName,
      });
      setMessage(response.data);
      resetForm();
    } catch (err) {
      const msg =
        err.response?.data || "Ocurrió un error al registrar el usuario";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6}>
        <Typography variant="h4" gutterBottom>
          Registro de Usuario
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Nombre de usuario"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Contraseña"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                Registrarse
              </Button>
            </Form>
          )}
        </Formik>

        {message && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Register;
