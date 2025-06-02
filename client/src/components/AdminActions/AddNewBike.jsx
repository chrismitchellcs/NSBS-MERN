import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AddImage from "./AddImage";
import AddSizes from "./AddSizes";
import SelectImages from "./SelectImages";
import CloseIcon from "@mui/icons-material/Close";
import EditAvailability from "./EditAvailability";

const AddNewBike = () => {
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [bikes, setBikes] = useState([]);

  const fetchBikes = async () => {
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/other`, {})
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const [sizeArray, setSizeArray] = useState([]);

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

  const [colors, setColors] = useState([]);

  const AddColors = () => {
    const [currentColor, setCurrentColor] = useState("");

    return (
      <Stack spacing={1}>
        <Box>Add Colors</Box>
        <Stack direction={"row"}>
          <TextField
            value={currentColor}
            label="Add Color Name"
            variant="outlined"
            onChange={(event) => setCurrentColor(event.target.value)}
          />
          <Button
            onClick={() => {
              setColors([...colors, currentColor]);
            }}
          >
            Add
          </Button>
        </Stack>
        <Stack>
          {colors.map((color) => (
            <Stack
              direction={"row"}
              alignItems={"center"}
              bgcolor={"lightgrey"}
              justifyContent={"space-between"}
            >
              <Box>{color}</Box>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setColors((prevColors) =>
                    prevColors.filter((c) => c !== color)
                  );
                }}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // have brand, type in state

    const year = event.target.year.value;
    const name = event.target.name.value;
    const price = event.target.price.value;
    const saleprice = event.target.saleprice.value;
    const description = event.target.description.value;
    const link = event.target.link.value;
    const fullName = year + " " + brand + " " + name;

    let availabilityArray = [];
    let colorObject = {};
    colors.map((color) => {
      colorObject[color] = "";
    });

    console.log(colorObject);

    sizeArray.map((size) => {
      colors.map((color) => {
        availabilityArray.push({
          size: size,
          color: color,
          partNumber: "N/A",
          availability: "Out of Stock",
        });
      });
    });

    await axios
      .post(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/other`,
        {
          brand,
          type,
          year,
          name,
          price,
          saleprice,
          description,
          link,
          fullName,
          models: JSON.stringify(availabilityArray),
          colors: JSON.stringify(colorObject),
          public: false,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        fetchBikes();
        setOpen(true);
        // setBikes(res.data);
      })
      .catch((error) => {
        alert("bike not added");
      });
  };

  const BikeBox = ({ bike }) => {
    // console.log(bike);
    // const modelMatrix = {};
    // const models = JSON.parse(bike.models);
    // const [colors, setColors] = useState([]);
    let colors = [];
    if (bike.colors !== undefined) {
      colors = JSON.parse(bike.colors);
    }

    // models.map((model) => {
    //   if (!modelMatrix[model.color]) {
    //     modelMatrix[model.color] = {};
    //   }
    //   modelMatrix[model.color][model.size] = {
    //     partNumber: model.partNumber,
    //     availability: model.availability,
    //   };
    // });

    // useEffect(() => {
    //   if (bike.colors !== undefined) {
    //     setColors(JSON.parse(bike.colors));
    //   }
    // });
    // const colors = JSON.parse(bike.colors);

    const [isPublic, setIsPublic] = useState(bike.public);
    const handleChange = async (event) => {
      let newBike = bike;
      newBike.public = event.target.checked;
      setIsPublic(event.target.checked);
      await axios
        //   .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
        .patch(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/other/${newBike._id}`,
          {
            newBike,
          },
          { withCredentials: true }
        )
        .then((res) => {})
        .catch((error) => {
          alert("bike not added");
        });
    };

    const [edit, setEdit] = useState(false);
    const editInfo = (event) => {
      setEdit(!edit);
    };

    const EditMenu = () => {
      const saveEdit = () => {
        setEdit(false);
      };

      const [type, setType] = useState("");
      const [material, setMaterial] = useState("");

      const handleTypeChange = (e) => {
        const type = e.target.value;
        setType(type);
      };

      const handleMaterialChange = (e) => {
        const material = e.target.value;
        setMaterial(material);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const description = e.target.description.value;
        const link = e.target.link.value;
        const year = e.target.year.value;
        const price = e.target.price.value;
        const saleprice = e.target.saleprice.value;
        console.log(type, material, description, link);
        let newBike = bike;
        newBike.type = type;
        newBike.description = description;
        newBike.link = link;
        newBike.material = link;
        newBike.year = year;
        newBike.price = price;
        newBike.saleprice = saleprice;

        await axios
          //   .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
          .patch(
            `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/other/${newBike._id}`,
            {
              newBike,
            },
            { withCredentials: true }
          )
          .then((res) => {
            fetchBikes();
            setEdit(false);
          })
          .catch((error) => {
            alert("bike not added");
          });
        setEdit(false);
      };

      return (
        <form onSubmit={handleSubmit}>
          <Stack spacing={1} m={1}>
            <Box>
              <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
              <RadioGroup
                onChange={handleTypeChange}
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
                <FormControlLabel
                  value="Trail"
                  control={<Radio />}
                  label="Trail"
                />
                <FormControlLabel value="XC" control={<Radio />} label="XC" />
                <FormControlLabel
                  value="Dirt Jumper"
                  control={<Radio />}
                  label="Dirt Jumper"
                />
                <FormControlLabel
                  value="Recreational"
                  control={<Radio />}
                  label="Recreational"
                />
                <FormControlLabel
                  value="Kids"
                  control={<Radio />}
                  label="Kids"
                />
                <FormControlLabel
                  value="E-Bike"
                  control={<Radio />}
                  label="E-Bike"
                />
              </RadioGroup>
            </Box>

            <TextField
              id="description"
              label="Description"
              variant="outlined"
              multiline
            />
            <TextField id="link" label="Link" variant="outlined" />
            <TextField id="year" label="Year" variant="outlined" multiline />
            <TextField id="price" label="Price" variant="outlined" multiline />
            <TextField
              id="saleprice"
              label="Sale Price"
              variant="outlined"
              multiline
            />

            <Button type="submit" variant="contained" color="success">
              Save
            </Button>
          </Stack>
        </form>
      );
    };

    const CurrentImage = ({ color }) => {
      if (colors[color])
        return (
          <Box component={"img"} src={colors[color]} width={"200px"}></Box>
        );
      else {
        return <Box>No Photo Uploaded</Box>;
      }
    };

    const ImageUpload = ({ color }) => {
      const [selectedFile, setSelectedFile] = useState(null);
      const [previewUrl, setPreviewUrl] = useState("");
      const [uploading, setUploading] = useState(false);

      const updatePhoto = async (url) => {
        let newColors = colors;
        newColors[color] = url;
        console.log(newColors);
        let newBike = bike;
        newBike.colors = JSON.stringify(newColors);

        await axios
          //   .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
          .patch(
            `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/other/${newBike._id}`,
            {
              newBike,
            },
            { withCredentials: true }
          )
          .then((res) => {
            fetchBikes();
          })
          .catch((error) => {
            alert("bike not added");
          });
      };

      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
        }
      };

      const handleUpload = async () => {
        if (!selectedFile) {
          alert("Please select an image first!");
          return;
        }

        let fileName = bike.fullName + " " + color;
        fileName = fileName.replace(/ /g, "-");

        setUploading(true);

        const sigRes = await axios.get(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/images/get-signature`,
          { params: { public_id: fileName }, withCredentials: true }
        );
        const sigData = await sigRes.data;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder);
        formData.append("public_id", fileName);

        try {
          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
          const uploadRes = await axios.post(cloudinaryUrl, formData);
          const uploadedData = await uploadRes.data;
          console.log("Uploaded successfully:", uploadedData.secure_url);
          await updatePhoto(uploadedData.secure_url);

          setUploading(false);
        } catch (error) {
          alert("Not uploaded, try again");
        }
      };

      return (
        <Stack>
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "300px", marginTop: "10px" }}
                />
              </div>
            )}
            <button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload to Cloudinary"}
            </button>
          </div>
        </Stack>
      );
    };

    return (
      <Stack
        direction={"row"}
        bgcolor={"#EEEEEE"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack p={2}>
          <Box fontWeight={"500"} fontSize={"20px"}>
            {bike.name}
          </Box>
          <Box mt={1} fontWeight={"600"}>
            Availability:
          </Box>
          <EditAvailability bike={bike}></EditAvailability>
        </Stack>
        {edit ? (
          <EditMenu></EditMenu>
        ) : (
          <Stack spacing={1}>
            <Button onClick={editInfo} variant="contained" color="success">
              Edit
            </Button>
            <Box>Year: {bike.year}</Box>
            <Box>Price: {bike.price}</Box>
            <Box>Sale Price: {bike.saleprice}</Box>
            <Box>Type: {bike.type}</Box>
            <Box>Description: {bike.description}</Box>
            <Box>Link: {bike.link}</Box>
          </Stack>
        )}

        <Stack>
          {" "}
          {Object.entries(colors).map(([key, value]) => {
            return (
              <Stack>
                <Box fontSize={"20px"} fontWeight={"600"}>
                  {key}
                </Box>
                <CurrentImage color={key}></CurrentImage>
                <ImageUpload color={key}></ImageUpload>
              </Stack>
            );
          })}
        </Stack>
        <Stack m={5}>
          <Box>{!isPublic && <Box>Private</Box>}</Box>
          <Box>{isPublic && <Box>Public</Box>}</Box>
          <Switch
            checked={isPublic}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack width={"100%"} m={2} p={2}>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
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
          <FormControlLabel value="Ibis" control={<Radio />} label="Ibis" />
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
            value="Dirt Jumper"
            control={<Radio />}
            label="Dirt Jumper"
          />
          <FormControlLabel
            value="Recreational"
            control={<Radio />}
            label="Recreational"
          />
          <FormControlLabel value="Kids" control={<Radio />} label="Kids" />
          <FormControlLabel value="E-Bike" control={<Radio />} label="E-Bike" />
        </RadioGroup>

        <Stack width={"100%"} alignItems={"flex-start"} spacing={1}>
          <TextField
            id="year"
            label="Year"
            variant="outlined"
            sx={{ width: "500px" }}
          />
          <TextField
            id="name"
            label="Name (don't include brand)"
            variant="outlined"
            sx={{ width: "500px" }}
          />
          <TextField
            id="price"
            label="Price"
            variant="outlined"
            sx={{ width: "500px" }}
          />
          <TextField
            id="saleprice"
            label="Sale Price (Leave blank if not on sale)"
            variant="outlined"
            sx={{ width: "500px" }}
          />
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            multiline
            sx={{ width: "500px" }}
          />

          <TextField
            id="link"
            label="Link"
            variant="outlined"
            sx={{ width: "500px" }}
          />
          <FormLabel id="demo-radio-buttons-group-label">
            Add Sizes (Click buttons in order from smallest size to biggest)
          </FormLabel>
          <AddSizes sizes={sizeArray} setSizes={setSizeArray}></AddSizes>
          <AddColors></AddColors>

          <Button sx={{ color: "black", bgcolor: "#dcdcdc" }} type="submit">
            Add Bike
          </Button>
        </Stack>
      </form>
      <Box mt={2}>
        {bikes && (
          <Stack direction="column" spacing={2}>
            {bikes.map((bike) => {
              return <BikeBox bike={bike}></BikeBox>;
            })}
          </Stack>
        )}
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Availability Updated"
      />
    </Stack>
  );
};

export default AddNewBike;
