import Header from "./Header";
import Footer from "./Footer";
import { Container, Box } from "@mui/material";

const Layout = ({ children }) => (
  <Box display="flex" flexDirection="column" minHeight="100vh">
    <Header />
    <Container sx={{ flex: 1, mt: 4 }}>{children}</Container>
    <Footer />
  </Box>
);

export default Layout;
