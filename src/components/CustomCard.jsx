import {
  Box,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CategoryAvatar from "./CategoryAvatar";

const CustomCard = ({ adv }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/anuncio/${adv.id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: "100%" }}>
        <CardHeader
          avatar={<CategoryAvatar category={adv.category.description} />}
          sx={{ pb: 0 }}
        />
        <CardMedia
          component="img"
          image={adv.image}
          alt={adv.title}
          sx={{
            objectFit: "cover",
            width: "100%",
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            component="div"
            sx={{
              fontSize: {
                xs: ".8rem", // móvil
                sm: "1.1rem",
                md: "1.25rem", // escritorio
              },
              fontWeight: 600,
            }}
          >
            {adv.title}
          </Typography>

          {/* Ocultar descripción en móviles */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: { xs: "none", md: "block" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: 60,
            }}
          >
            {adv.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Chip
              color="primary"
              label={new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(adv.price)}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CustomCard;
