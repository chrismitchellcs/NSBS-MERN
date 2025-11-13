import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

const EditTransitions = ({ bikes, setBikes }) => {
  const fetchBikes = async () => {
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/alltransition`, {})
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const BikeBox = ({ bike }) => {
    const modelMatrix = {};
    const models = JSON.parse(bike.models);

    const [inStoreBikes, setInStoreBikes] = useState(JSON.parse(bike.inStock));

    let colors = [];
    if (bike.colors !== undefined) {
      colors = JSON.parse(bike.colors);
    }

    const [isPublic, setIsPublic] = useState(bike.public);
    const handleChange = async (event) => {
      let newBike = bike;
      newBike.public = event.target.checked;
      setIsPublic(event.target.checked);
      await axios
        .patch(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition/${newBike._id}`,
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

    models.forEach((model) => {
      if (!modelMatrix[model.color]) {
        modelMatrix[model.color] = {};
      }
      modelMatrix[model.color][model.size] = {
        partNumber: model.partNumber,
        availability: model.availability,
      };
    });

    const [edit, setEdit] = useState(false);
    const editInfo = (event) => {
      setEdit(!edit);
    };

    const EditMenu = () => {
      const [type, setType] = useState(bike.type);

      const handleTypeChange = (e) => {
        const type = e.target.value;
        setType(type);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const description = e.target.description.value;
        const link = e.target.link.value;
        let newBike = bike;
        newBike.type = type;
        newBike.description = description;
        newBike.link = link;

        await axios
          .patch(
            `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition/${newBike._id}`,
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
            <Box> </Box>
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              defaultValue={bike.description}
              multiline
            />

            <TextField
              id="link"
              label="Link"
              variant="outlined"
              defaultValue={bike.link}
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

        let newBike = bike;
        newBike.colors = JSON.stringify(newColors);

        await axios
          .patch(
            `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition/${newBike._id}`,
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
          const uploadRes = await axios.post(cloudinaryUrl, formData, {
            withCredentials: false,
          });
          const uploadedData = await uploadRes.data;
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

    const addInStore = async (size, partNumber, color) => {
      const stockItem = {
        size: size,
        partNumber: partNumber,
        color: color,
        availability: "In Store",
      };
      const oldStock = JSON.parse(bike.inStock);

      const isAlreadyAdded = oldStock.some(
        (item) => item.partNumber === partNumber
      );

      if (!isAlreadyAdded) {
        let newBike = bike;
        oldStock.push(stockItem);

        newBike.inStock = JSON.stringify(oldStock);

        await axios
          .patch(
            `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition/${newBike._id}`,
            {
              newBike,
            },
            { withCredentials: true }
          )
          .then((res) => {
            setInStoreBikes(oldStock);
          })
          .catch((error) => {
            alert("bike not added");
          });
      }
    };

    const removeFromStore = async (partNumber) => {
      const newInStoreBikes = inStoreBikes.filter(
        (item) => item.partNumber !== partNumber
      );
      let newBike = bike;
      newBike.inStock = JSON.stringify(newInStoreBikes);
      await axios
        .patch(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition/${newBike._id}`,
          {
            newBike,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setInStoreBikes(newInStoreBikes);
        })
        .catch((error) => {
          alert("bike not added");
        });
    };

    const [newBikeColor, setNewBikeColor] = useState("");
    const [newBikeSize, setNewBikeSize] = useState("");

    const addOtherBikeToStore = async () => {
      const stockItem = {
        size: newBikeSize,
        partNumber: Date.now(),
        color: newBikeColor,
        availability: "In Store",
      };
      const oldStock = JSON.parse(bike.inStock);

      // const isAlreadyAdded = oldStock.some(
      //   (item) => item.partNumber === stockItem.partNumber
      // );

      let newBike = bike;
      oldStock.push(stockItem);

      newBike.inStock = JSON.stringify(oldStock);

      await axios
        .patch(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition/${newBike._id}`,
          {
            newBike,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setInStoreBikes(oldStock);
          setNewBikeColor("");
          setNewBikeSize("");
        })
        .catch((error) => {
          alert("bike not added");
        });
    };

    return (
      <Stack
        borderBottom={1}
        p={0.5}
        direction={"row"}
        spacing={2}
        bgcolor={"#EEEEEE"}
        alignItems={"center"}
        justifyContent={"space-around"}
        width={"100vw"}
      >
        <Stack p={2}>
          <Box fontWeight={"500"} fontSize={"20px"}>
            {bike.name}
          </Box>
          <Box>Year: 20{bike.year}</Box>
          <Box>Price: ${bike.price}</Box>
          <Box>Sale Price: ${bike.saleprice}</Box>
          <Box mt={1} fontWeight={"600"}>
            Availability:
          </Box>
          <Stack direction={"row"} fontSize={"13px"}>
            {Object.entries(modelMatrix).map(([key, value]) => (
              <Stack>
                <Box color={"white"} bgcolor={"black"} p={0.5} m={0.5}>
                  {key}
                </Box>
                {Object.entries(value).map(([key2, value2]) => (
                  <Box>
                    <Stack spacing={0.5} m={0.5} bgcolor={"white"} p={0.5}>
                      <Box>{key2}</Box>
                      <Box>{value2.partNumber}</Box>
                      <Box>{value2.availability}</Box>
                      <Box>
                        <Button
                          onClick={() =>
                            addInStore(key2, value2.partNumber, key)
                          }
                          variant="contained"
                          color="success"
                          sx={{
                            fontSize: "12px",
                            p: 0.5,
                            m: 0,
                            textTransform: "none",
                          }}
                        >
                          In Store
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ))}
          </Stack>
          <Box mt={1} fontWeight={"600"}>
            Add Other Bike:
          </Box>
          <Box mt={1} mb={1} fontWeight={"400"} width={"400px"}>
            Use this if the bike we want to display is not shown above. Please
            ensure the name of the colour and size is correct.
          </Box>
          <Stack bgcolor={"white"} p={1} spacing={1}>
            <TextField
              id="outlined-controlled"
              label="Color"
              value={newBikeColor}
              onChange={(event) => {
                setNewBikeColor(event.target.value);
              }}
            />
            <TextField
              id="outlined-controlled"
              label="Size"
              value={newBikeSize}
              onChange={(event) => {
                setNewBikeSize(event.target.value);
              }}
            />
            <Box>
              <Button
                onClick={() => addOtherBikeToStore()}
                variant="contained"
                color="success"
              >
                Add Bike
              </Button>
            </Box>
          </Stack>
          <Box mt={1} fontWeight={"600"}>
            In Store Bikes:
          </Box>
          <Stack direction={"row"}>
            {inStoreBikes.map((bike) => {
              return (
                <Stack
                  fontSize={"13px"}
                  spacing={0.5}
                  m={0.5}
                  bgcolor={"white"}
                  p={0.5}
                >
                  <Box>{bike.color}</Box>
                  <Box>{bike.size}</Box>
                  <Box>{bike.partNumber}</Box>
                  <Box>
                    <Button
                      onClick={() => removeFromStore(bike.partNumber)}
                      variant="contained"
                      color="error"
                      sx={{
                        fontSize: "12px",
                        p: 0.5,
                        m: 0,
                        textTransform: "none",
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        {edit ? (
          <EditMenu></EditMenu>
        ) : (
          <Stack spacing={1}>
            <Button onClick={editInfo} variant="contained" color="success">
              Edit
            </Button>
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
    <Box>
      {bikes && (
        <Stack direction="column" spacing={0}>
          {bikes.map((bike) => {
            return <BikeBox bike={bike}></BikeBox>;
          })}
        </Stack>
      )}
    </Box>
  );
};

export default EditTransitions;
