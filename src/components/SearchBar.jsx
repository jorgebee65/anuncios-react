import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// components/SearchBar.jsx
const SearchBar = ({ value, onChange, onClear }) => (
  <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 300 }, flex: 1 }}>
    <InputLabel htmlFor="search-input">Buscar anuncio</InputLabel>
    <OutlinedInput
      id="search-input"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      label="Buscar anuncio"
      endAdornment={
        <InputAdornment position="end">
          {value && (
            <IconButton onClick={onClear} edge="end" size="small">
              <ClearIcon />
            </IconButton>
          )}
          <SearchIcon />
        </InputAdornment>
      }
    />
  </FormControl>
);

export default SearchBar;
