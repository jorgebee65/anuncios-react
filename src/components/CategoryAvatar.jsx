import { Avatar } from "@mui/material";
import { red, green, orange, blue, grey } from "@mui/material/colors";
import PetsIcon from "@mui/icons-material/Pets";
import PowerIcon from "@mui/icons-material/Power";
import ChairIcon from "@mui/icons-material/Chair";
import HomeIcon from "@mui/icons-material/Home";
import AppsIcon from "@mui/icons-material/Apps";

const categoryMap = {
  MUEBLES: { color: orange[500], icon: <ChairIcon /> },
  ELECTRONICOS: { color: green[500], icon: <PowerIcon /> },
  MASCOTAS: { color: red[500], icon: <PetsIcon /> },
  INMUEBLES: { color: blue[500], icon: <HomeIcon /> },
  VARIOS: { color: grey[700], icon: <AppsIcon /> },
};

const CategoryAvatar = ({ category }) => {
  const data = categoryMap[category] || categoryMap["VARIOS"];

  return (
    <Avatar sx={{ bgcolor: data.color }} aria-label={category}>
      {data.icon}
    </Avatar>
  );
};

export default CategoryAvatar;
