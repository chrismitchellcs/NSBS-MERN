import {
  Stack,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const EditAvailability = ({ bike }) => {
  const [models, setModels] = useState(JSON.parse(bike.models));

  const modelMatrix = useMemo(() => {
    const matrix = {};
    models.forEach((model) => {
      if (!matrix[model.color]) {
        matrix[model.color] = {};
      }
      matrix[model.color][model.size] = {
        partNumber: model.partNumber,
        availability: model.availability,
      };
    });
    return matrix;
  }, [models]);

  const Availability = ({ availability, size, colour }) => {
    const [edit, setEdit] = useState(false);
    const [status, setStatus] = useState(availability);
    const handleBrandChange = (e) => {
      setStatus(e.target.value);
    };

    const handleEdit = async () => {
      const oldModels = models;
      const newModels = models.map((model) => {
        if (model.size === size && model.color === colour) {
          return { ...model, availability: status };
        } else {
          return model;
        }
      });
      setModels(newModels);
      setEdit(false);

      let newBike = bike;
      newBike.models = JSON.stringify(newModels);

      await axios
        .patch(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/other/${newBike._id}`,
          {
            newBike,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setOpen(true);
        })
        .catch((error) => {
          setModels(oldModels);
          alert("Something went wrong, availability not updated");
        });
    };

    if (edit) {
      return (
        <Stack>
          <RadioGroup
            onChange={handleBrandChange}
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="none"
            name="radio-buttons-group"
            value={status}
          >
            <FormControlLabel
              value="In Store"
              control={<Radio />}
              label="In Store"
            />
            <FormControlLabel
              value="Available to Order"
              control={<Radio />}
              label="Available to Order"
            />
            <FormControlLabel
              value="Out of Stock"
              control={<Radio />}
              label="Out of Stock"
            />
          </RadioGroup>
          <Button variant="contained" onClick={handleEdit}>
            Save
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack direction={"row"} alignItems={"center"}>
          <Box>{availability}</Box>
          <Button onClick={() => setEdit(!edit)}>Edit</Button>
        </Stack>
      );
    }
  };

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack direction={"row"}>
      {Object.entries(modelMatrix).map(([key, value]) => (
        <Stack>
          <Box color={"white"} bgcolor={"black"} p={1} m={1}>
            {key}
          </Box>
          {Object.entries(value).map(([key2, value2]) => (
            <Box>
              <Stack spacing={1} m={1} bgcolor={"white"} p={1}>
                <Box>{key2}</Box>
                <Box>{value2.partNumber}</Box>
                <Availability
                  availability={value2.availability}
                  colour={key}
                  size={key2}
                ></Availability>
              </Stack>
            </Box>
          ))}
        </Stack>
      ))}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Availability Updated"
      />
    </Stack>
  );
};

export default EditAvailability;
