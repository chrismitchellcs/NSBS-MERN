import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";

import { useState } from "react";
import AddSizes from "./AddSizes";
import AddImage from "./AddImage";
import SelectImages from "./SelectImages";

const AddBike = ({ setBikes }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const price = e.target.price.value;
    const description = e.target.description.value;
    const link = e.target.link.value;
    const sizes = JSON.stringify(sizeArray);
    const images = JSON.stringify(imagesSelected);
    setImagesSelected([]);
    console.log(images);
    console.log(sizes);
    await axios
      .post("http://localhost:5050/api/bikes/", {
        brand,
        type,
        material,
        name,
        sizes,
        price,
        images,
        description,
        link,
      })
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        alert("bike not added");
      });
  };
  const [sizeArray, setSizeArray] = useState([]);

  const [imagesSelected, setImagesSelected] = useState([]);

  const [brand, setBrand] = useState("");

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setBrand(brand);
    console.log(brand);
  };

  const [type, setType] = useState("");

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setType(type);
    console.log(type);
  };

  const [material, setMaterial] = useState("");

  const handleMaterialChange = (e) => {
    const material = e.target.value;
    setMaterial(material);
    console.log(material);
  };

  return (
    <Box width={"100%"} m={2}>
      <form onSubmit={handleSubmit}>
        <FormLabel id="demo-radio-buttons-group-label">Brand</FormLabel>
        <RadioGroup
          onChange={handleBrandChange}
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="none"
          name="radio-buttons-group"
          value={brand}
        >
          <FormControlLabel
            value="Transition"
            control={<Radio />}
            label="Transition"
          />
          <FormControlLabel value="Norco" control={<Radio />} label="Norco" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
        <RadioGroup
          onChange={handleTypeChange}
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="none"
          name="radio-buttons-group"
          value={type}
        >
          <FormControlLabel value="DH" control={<Radio />} label="DH" />
          <FormControlLabel
            value="Enduro / All Mountain"
            control={<Radio />}
            label="Enduro / All Mountain"
          />
          <FormControlLabel value="Trail" control={<Radio />} label="Trail" />
          <FormControlLabel value="XC" control={<Radio />} label="XC" />
          <FormControlLabel
            value="Recreational"
            control={<Radio />}
            label="Recreational"
          />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">Material</FormLabel>
        <RadioGroup
          onChange={handleMaterialChange}
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="none"
          name="radio-buttons-group"
          value={material}
        >
          <FormControlLabel value="DH" control={<Radio />} label="DH" />
          <FormControlLabel value="Alloy" control={<Radio />} label="Alloy" />
          <FormControlLabel value="Carbon" control={<Radio />} label="Carbon" />
          <FormControlLabel value="Steel" control={<Radio />} label="Steel" />
        </RadioGroup>
        <Stack width={"100%"} alignItems={"flex-start"} spacing={1}>
          <TextField id="name" label="Name" variant="outlined" />
          <TextField id="price" label="Price" variant="outlined" />
          <TextField id="description" label="Description" variant="outlined" />
          <TextField id="link" label="Link" variant="outlined" />
          <FormLabel id="demo-radio-buttons-group-label">Add Sizes</FormLabel>
          <AddSizes sizes={sizeArray} setSizes={setSizeArray}></AddSizes>
          <AddImage></AddImage>
          <SelectImages images={imagesSelected} setImages={setImagesSelected} />
          <Button sx={{ color: "black", bgcolor: "#dcdcdc" }} type="submit">
            Add Bike
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
export default AddBike;
