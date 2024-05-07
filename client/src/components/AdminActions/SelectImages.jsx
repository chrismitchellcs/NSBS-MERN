import { Box, Button } from "@mui/material";
import { useState } from "react";
import AdminImages from "./AdminImages";

const SelectImages = ({ images, setImages }) => {
  const [showImages, setShowImages] = useState(false);
  const selectImage = () => {
    if (!showImages) {
      setShowImages(true);
    } else {
      setShowImages(false);
    }
  };

  return (
    <Box>
      <Button onClick={selectImage}>Select Images</Button>
      <Box>
        {showImages && (
          <AdminImages images={images} setImages={setImages}></AdminImages>
        )}
      </Box>
    </Box>
  );
};

export default SelectImages;
