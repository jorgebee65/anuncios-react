import { useState } from "react";
import { Box, Button } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";

const ImageUpload = ({ file, setFile }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <Box>
      <Button
        component="label"
        variant="outlined"
        startIcon={<CameraAlt />}
        fullWidth
        sx={{ mb: 2 }}
      >
        Subir Imagen
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </Button>
      {preview && (
        <Box
          component="img"
          src={preview}
          alt="Vista previa"
          sx={{
            width: 150,
            height: 150,
            objectFit: "cover",
            borderRadius: 2,
            display: "block",
            margin: "auto",
            border: "1px solid #ccc",
          }}
        />
      )}
    </Box>
  );
};

export default ImageUpload;
