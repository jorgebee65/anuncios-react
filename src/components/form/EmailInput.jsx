import { TextField } from "@mui/material";
import { useState, useEffect } from "react";

const EmailInput = ({ form, setForm }) => {
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const input = e.target.value;

    setForm((prev) => ({ ...prev, email: input }));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(input)) {
      setEmailError("Correo electrónico no válido");
    } else {
      setEmailError("");
    }
  };

  return (
    <TextField
      fullWidth
      label="Email"
      name="email"
      value={form.email}
      onChange={handleEmailChange}
      error={!!emailError}
      helperText={emailError}
      sx={{ mb: 2 }}
    />
  );
};

export default EmailInput;
