import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CategoryFilter = ({ value, onChange, categories, disabled }) => (
  <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 }, flex: 1 }}>
    <InputLabel id="category-select-label">Categoría</InputLabel>
    <Select
      labelId="category-select-label"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label="Categoría"
      disabled={disabled}
    >
      <MenuItem value="">Todas</MenuItem>
      {categories.map((cat) => (
        <MenuItem key={cat.id} value={cat.description}>
          {cat.description}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default CategoryFilter;
