import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const baseUrl = window?.env?.VITE_API_URL || "http://localhost:8585";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(20, "El nombre no debe exceder los 20 caracteres")
    .required("El nombre es obligatorio"),
  username: Yup.string()
    .min(3, "Debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no debe exceder los 20 caracteres")
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
            isValid,
          }) => (
            <Form>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                name="firstName"
                placeholder="Ej: Juan Perez"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={
                  touched.firstName && errors.firstName
                    ? errors.firstName
                    : `${values.firstName.length}/20`
                }
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
                helperText={
                  touched.username && errors.username
                    ? errors.username
                    : `${values.username.length}/20 - Puede ser cualquier nombre, no tiene que ser un email.`
                }
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
                disabled={isSubmitting || !isValid}
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
