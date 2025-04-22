import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Requerido"),
  password: Yup.string().required("Requerido"),
});

const LoginPage = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    setError("");
    try {
      await login(values);
      navigate("/");
    } catch (err) {
      setError("Credenciales inválidas o error de servidor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="username"
                label="Usuario"
                fullWidth
                margin="normal"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />
              <Field
                as={TextField}
                name="password"
                label="Contraseña"
                type="password"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ingresando..." : "Ingresar"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default LoginPage;
