import { Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const EditBikeSalePrice = ({ bike, setBikes }) => {
  const [edit, setEdit] = useState(false);

  const handleEditClick = () => {
    if (edit) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  };

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
    newBike.saleprice = saleprice;

    const id = newBike._id;

    await axios

      .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
        newBike,
      })
      .then((res) => {
        setEdit(false);
        fetchBikes();
        setSalePrice("");
      })
      .catch((error) => {
        alert("bike not added");
      });
  };

  const [saleprice, setSalePrice] = useState("");

  const handleChange = (e) => {
    setSalePrice(e.target.value);
  };

  return (
    <Stack>
      <Button onClick={handleEditClick}>Edit</Button>
      {edit && (
        <Stack>
          <TextField
            value={saleprice}
            variant="outlined"
            onChange={handleChange}
          />
        </Stack>
      )}
      {edit && <Button onClick={handleSaveClick}>Save</Button>}
    </Stack>
  );
};

export default EditBikeSalePrice;
