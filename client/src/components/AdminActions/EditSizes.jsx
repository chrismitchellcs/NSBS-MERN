import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

const EditSizes = ({ bike, setBikes }) => {
  const [edit, setEdit] = useState(false);
  const [newSizes, setNewSizes] = useState([]);

  const handleEditClick = () => {
    setEdit(true);
  };

  const removeSize = (s, size) => {
    const index = s.indexOf(size);
    if (index > -1) {
      s.splice(index, 1);
    }
    setNewSizes(s);
  };

  const addSize = (s, size) => {
    s.push(size);
    setNewSizes(s);
  };

  const handleClick = (e) => {
    console.log(e.target.value);
    console.log(e.target.checked);
    const size = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      var s = newSizes;
      addSize(s, size);
    } else {
      const s = newSizes;
      removeSize(s, size);
    }
    console.log(newSizes);
  };

  const oldSizes = [
    '12"',
    '14"',
    '16"',
    '20"',
    '24"',
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "1",
    "2",
    "3",
    "4",
    "5",
  ];

  const fetchBikes = async () => {
    console.log(process.env.REACT_APP_VERCEL_DOMAIN);
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {})
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSaveClick = async () => {
    var newBike = bike;
    newBike.sizes = JSON.stringify(newSizes);
    const id = newBike._id;
    console.log(id);
    await axios
      //   .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
      .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
        newBike,
      })
      .then((res) => {
        setEdit(false);
        setNewSizes([]);
        fetchBikes();

        // setBikes(res.data);
      })
      .catch((error) => {
        alert("bike not added");
      });
  };

  return (
    <Stack>
      <Button onClick={handleEditClick}>Edit</Button>
      {edit && (
        <FormGroup aria-label="position" onClick={handleClick}>
          {oldSizes.map((size) => {
            return (
              <FormControlLabel
                value={size}
                control={<Checkbox />}
                label={size}
                // labelPlacement="top"
              />
            );
          })}
        </FormGroup>
      )}
      <Button onClick={handleSaveClick}>Save</Button>
    </Stack>
  );
};

export default EditSizes;
