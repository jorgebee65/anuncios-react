import { TextField } from "@mui/material";

const PriceInput = ({ displayPrice, setDisplayPrice, form, handleChange }) => (
  <TextField
    fullWidth
    label="Precio"
    name="price"
    value={displayPrice}
    onChange={(e) => {
      const numericValue = e.target.value.replace(/[^0-9.]/g, "");
      setDisplayPrice(numericValue);
      handleChange({ target: { name: "price", value: numericValue } });
    }}
    onBlur={() => {
      const value = parseFloat(form.price);
      if (!isNaN(value)) {
        const formatted = new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          minimumFractionDigits: 2,
        }).format(value);
        setDisplayPrice(formatted);
      }
    }}
    onFocus={() => setDisplayPrice(form.price)}
    sx={{ mb: 2 }}
    slotProps={{ htmlInput: { inputMode: "decimal" } }}
  />
);

export default PriceInput;
