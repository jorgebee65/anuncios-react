import {
  Container,
  Grid,
  Pagination,
  Stack,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomCard from "../components/CustomCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import PageSizeSelector from "../components/PageSizeSelector";
import { useCachedAdverts } from "../hooks/useCachedAdverts";
import { useCachedCategories } from "../hooks/useCachedCategories";
import { useState } from "react";

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

  return (
    <Container>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        flexWrap="wrap"
      >
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setPage(0);
          }}
          onClear={() => {
            setSearchTerm("");
            setPage(0);
          }}
        />

        <CategoryFilter
          value={category}
          onChange={(val) => {
            setCategory(val);
            setPage(0);
          }}
          categories={categories}
          disabled={loadingCategories}
        />

        <PageSizeSelector
          value={size}
          onChange={(val) => {
            setSize(val);
            setPage(0);
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
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
              onChange={(_, value) => setPage(value - 1)}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Container>
  );
};

export default Home;
