import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import { useCachedCategories } from "../../hooks/useCachedCategories";

const CategorySelect = ({ value, onChange }) => {
  const { categories, loading } = useCachedCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !value) {
      const varios = categories.find((cat) => cat.description === "VARIOS");
      if (varios) {
        setSelectedCategory(varios);
        onChange?.({ target: { value: varios.id, category: varios } });
      }
    }
  }, [categories, value, onChange]);

  useEffect(() => {
    if (value && categories.length > 0) {
      const found = categories.find((cat) => cat.id === value);
      if (found) {
        setSelectedCategory(found);
      }
    }
  }, [value, categories]);

  const handleChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const category = categories.find((cat) => cat.id === selectedId);
    setSelectedCategory(category);
    onChange?.({ target: { value: selectedId, category } });
  };

  return (
    <TextField
      fullWidth
      select
      label="Categoría"
      value={selectedCategory?.id || ""}
      onChange={handleChange}
      disabled={loading}
      sx={{ mb: 2 }}
    >
      {categories.map((cat) => (
        <MenuItem key={cat.id} value={cat.id}>
          {cat.description}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CategorySelect;
