import {
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

const CustomCard = ({ adv }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/anuncio/${adv.id}`);
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 280 }} image={adv.image} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {adv.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {adv.description}
        </Typography>
        <CardActions>
          <Button href={adv.shareLink} target="_blank" size="small">
            Share
          </Button>
          <Button onClick={handleClick} size="small">
            VER
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
