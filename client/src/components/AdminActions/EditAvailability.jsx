import {
  Stack,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";

const EditAvailability = ({ bike }) => {
  const [models, setModels] = useState(() => {
    try {
      return JSON.parse(bike.models || "[]");
    } catch {
      return [];
    }
  });

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
        }
        return model;
      });
      setModels(newModels);
      setEdit(false);

      const newBike = { models: JSON.stringify(newModels) };

      await axios
        .patch(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/other/${bike._id}`,
          {
            newBike,
          },
          { withCredentials: true }
        )
        .then(() => {
          setOpen(true);
        })
        .catch(() => {
          setModels(oldModels);
          alert("Something went wrong, availability not updated");
        });
    };

    if (edit) {
      return (
        <Stack spacing={1}>
          <RadioGroup value={status} onChange={handleBrandChange} name={`avail-${colour}-${size}`}>
            <FormControlLabel value="In Store" control={<Radio size="small" />} label="In Store" />
            <FormControlLabel
              value="Available to Order"
              control={<Radio size="small" />}
              label="Available to Order"
            />
            <FormControlLabel value="Out of Stock" control={<Radio size="small" />} label="Out of Stock" />
          </RadioGroup>
          <Button variant="contained" size="small" onClick={handleEdit}>
            Save
          </Button>
        </Stack>
      );
    }
    return (
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
        <Typography variant="body2" component="span">
          {availability}
        </Typography>
        <Button size="small" variant="outlined" onClick={() => setEdit(!edit)}>
          Edit
        </Button>
      </Stack>
    );
  };

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5} sx={{ width: "100%" }}>
      {Object.entries(modelMatrix).map(([colorKey, bySize]) => (
        <Stack key={colorKey} spacing={1} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              color: "common.white",
              bgcolor: "common.black",
              px: 1,
              py: 0.75,
              borderRadius: 1,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {colorKey}
          </Box>
          {Object.entries(bySize).map(([sizeKey, value2]) => (
            <Box
              key={`${colorKey}-${sizeKey}`}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={0.75}>
                <Typography variant="body2" fontWeight={600}>
                  {sizeKey}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {value2.partNumber}
                </Typography>
                <Availability availability={value2.availability} colour={colorKey} size={sizeKey} />
              </Stack>
            </Box>
          ))}
        </Stack>
      ))}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="Availability updated" />
    </Stack>
  );
};

export default EditAvailability;
