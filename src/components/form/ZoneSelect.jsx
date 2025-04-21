import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";

const ZoneSelect = ({ zonas = [], value, onChange }) => {
  const [selectedZone, setSelectedZone] = useState("");

  useEffect(() => {
    if (zonas.length > 0 && !value) {
      setSelectedZone(zonas[0]);
      onChange?.({ target: { value: zonas[0] } });
    }
  }, [zonas, value, onChange]);

  useEffect(() => {
    if (value) {
      setSelectedZone(value);
    }
  }, [value]);

  const handleChange = (e) => {
    setSelectedZone(e.target.value);
    onChange?.(e);
  };

  return (
    <TextField
      fullWidth
      select
      label="Zona"
      value={selectedZone}
      onChange={handleChange}
      sx={{ mb: 2 }}
    >
      {zonas.map((zona) => (
        <MenuItem key={zona} value={zona}>
          {zona}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ZoneSelect;
