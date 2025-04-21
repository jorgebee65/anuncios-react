import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const PageSizeSelector = ({ value, onChange }) => (
  <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 }, flex: 1 }}>
    <InputLabel id="size-select-label">Anuncios por página</InputLabel>
    <Select
      labelId="size-select-label"
      value={value}
      label="Anuncios por página"
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {[3, 6, 9].map((num) => (
        <MenuItem key={num} value={num}>
          {num}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default PageSizeSelector;
