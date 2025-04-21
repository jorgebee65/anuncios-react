import { TextField } from "@mui/material";
import { useState } from "react";

const PhoneInput = ({ form, setForm }) => {
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const numeric = input.replace(/\D/g, ""); // solo números

    if (numeric.length <= 10) {
      setForm((prev) => ({ ...prev, phone: numeric }));

      if (numeric.length === 10) {
        setPhoneError("");
      } else {
        setPhoneError("El teléfono debe tener exactamente 10 dígitos");
      }
    }
  };

  return (
    <TextField
      fullWidth
      label="Teléfono"
      name="phone"
      value={form.phone}
      onChange={handlePhoneChange}
      error={!!phoneError}
      helperText={phoneError}
      sx={{ mb: 2 }}
    />
  );
};

export default PhoneInput;
