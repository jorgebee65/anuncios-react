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
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          avatar={<CategoryAvatar category={adv.category.description} />}
        />
        <CardMedia sx={{ height: 280 }} image={adv.image} title={adv.title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {adv.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {adv.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
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
