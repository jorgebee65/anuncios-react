import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Pagination,
  Stack,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import CustomCard from "../components/CustomCard";

const Home = () => {
  const [advList, setAdvList] = useState([]);
  const [page, setPage] = useState(0); // Backend es 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(3);

  const fetchData = async (pageNumber = 0) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8585/api/v1/advertises?page=${pageNumber}&size=${size}&sort=creation,asc&active=true`
      );
      setAdvList(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, size]);

  const handlePageChange = (event, value) => {
    setPage(value - 1); // MUI usa 1-based, backend usa 0-based
  };

  return (
    <Container>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={3}
        justifyContent="flex-end"
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="size-select-label">Anuncios por página</InputLabel>
          <Select
            labelId="size-select-label"
            id="size-select"
            value={size}
            label="Anuncios por página"
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0); // Reiniciar a la primera página
            }}
          >
            {[3, 6, 9].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {advList.map((adv) => (
          <Grid key={adv.id}>
            <CustomCard adv={adv} />
          </Grid>
        ))}
      </Grid>

      <Stack spacing={2} mt={4} alignItems="center">
        <Pagination
          count={totalPages}
          page={page + 1} // Lo mostramos como 1-based
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </Container>
  );
};

export default Home;
