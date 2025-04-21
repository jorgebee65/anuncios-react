import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Pagination,
  Stack,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  IconButton,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import { OutlinedInput, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomCard from "../components/CustomCard";
import { useCachedAdverts } from "../hooks/useCachedAdverts";
import { useCachedCategories } from "../hooks/useCachedCategories"; // importa el hook
import ClearIcon from "@mui/icons-material/Clear";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(3);
  const [category, setCategory] = useState("");
  const { categories, loading: loadingCategories } = useCachedCategories();

  const {
    data: allAdverts,
    loading,
    refreshAdverts,
  } = useCachedAdverts(category);

  const filteredAdverts = allAdverts.filter((adv) =>
    adv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAdverts = filteredAdverts.slice(
    page * size,
    page * size + size
  );
  const totalPages = Math.ceil(filteredAdverts.length / size);
  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  return (
    <Container>
      <Stack
        direction={{ xs: "column", sm: "row" }} // columna en xs, fila en sm en adelante
        spacing={2}
        alignItems="stretch"
        mb={3}
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 300 },
            flex: 1,
          }}
        >
          <InputLabel htmlFor="search-input">Buscar anuncio</InputLabel>
          <OutlinedInput
            id="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            label="Buscar anuncio"
            endAdornment={
              <InputAdornment position="end">
                {searchTerm && (
                  <IconButton
                    aria-label="Limpiar búsqueda"
                    onClick={() => {
                      setSearchTerm("");
                      setPage(0);
                    }}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            flex: 1,
          }}
        >
          <InputLabel id="category-select-label">Categoría</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Categoría"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
            disabled={loadingCategories}
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.description}>
                {cat.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 160 },
            flex: 1,
          }}
        >
          <InputLabel id="size-select-label">Anuncios por página</InputLabel>
          <Select
            labelId="size-select-label"
            id="size-select"
            value={size}
            label="Anuncios por página"
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
          >
            {[3, 6, 9].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-end", sm: "center" },
            alignItems: "center",
            mt: { xs: 1, sm: 0 },
          }}
        >
          <IconButton onClick={refreshAdverts} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Stack>

      {loading ? (
        <Stack alignItems="center" mt={4}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 3 }}
          >
            {paginatedAdverts.map((adv) => (
              <Grid size={{ xs: 6, md: 3 }} key={adv.id}>
                <CustomCard adv={adv} />
              </Grid>
            ))}
          </Grid>

          <Stack spacing={2} mt={4} alignItems="center">
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Container>
  );
};

export default Home;
