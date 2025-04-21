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
        onChange?.({ target: { category: varios } });
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
    const selectedDesc = e.target.value;
    const category = categories.find((cat) => cat.description === selectedDesc);
    setSelectedCategory(category);
    onChange?.({ target: { category } });
  };

  return (
    <TextField
      fullWidth
      select
      label="Categoría"
      value={selectedCategory?.description || ""}
      onChange={handleChange}
      disabled={loading}
      sx={{ mb: 2 }}
    >
      {categories.map((cat) => (
        <MenuItem key={cat.id} value={cat.description}>
          {cat.description}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CategorySelect;
