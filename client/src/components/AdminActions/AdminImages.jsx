import { Checkbox, FormControlLabel, Grid, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Image } from "cloudinary-react";

const AdminImages = ({ images, setImages }) => {
  const [imageIds, setImageIds] = useState([]);
  // const [images, setImages] = useState(false);

  const loadImages = async () => {
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/images`)
      .then((res) => {
        if (res.data.length > 0) {
          setImageIds(res.data);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    loadImages();
  }, []);

  const removeImage = (i, image) => {
    const index = i.indexOf(image);
    if (index > -1) {
      i.splice(index, 1);
    }
    setImages(i);
  };

  const addImage = (i, image) => {
    i.push(image);
    setImages(i);
  };

  const handleClick = (e) => {
    console.log(e.target.value);
    console.log(e.target.checked);
    const image = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      var i = images;
      addImage(i, image);
    } else {
      const i = images;
      removeImage(i, image);
    }
    console.log(images);
  };

  return (
    <Grid container>
      {imageIds &&
        imageIds.map((imageId, index) => (
          <Grid item>
            <Stack>
              <Image
                key={index}
                cloudName="ds4ukwnxl"
                publicId={imageId}
                width="400"
                crop="scale"
              ></Image>
              <FormControlLabel
                control={<Checkbox />}
                label={imageId}
                value={imageId}
                onClick={handleClick}
              />
            </Stack>
          </Grid>
        ))}
    </Grid>
  );
};

export default AdminImages;
