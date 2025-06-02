import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Switch,
  TextField,
} from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
import axios from "axios";
import { useEffect, useState } from "react";

const EditTransitions = ({ bikes, setBikes }) => {
  const CustomButton = styled(Button)({
    color: "darkslategray",
    backgroundColor: "aliceblue",
    padding: 8,
    borderRadius: 4,
  });

  const fetchBikes = async () => {
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition`, {})
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const BikeBox = ({ bike }) => {
    // console.log(bike);
    const modelMatrix = {};
    const models = JSON.parse(bike.models);
    // const [colors, setColors] = useState([]);
    let colors = [];
    if (bike.colors !== undefined) {
      colors = JSON.parse(bike.colors);
    }

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

    // console.log(models);
    models.map((model) => {
      if (!modelMatrix[model.color]) {
        modelMatrix[model.color] = {};
      }
      modelMatrix[model.color][model.size] = {
        partNumber: model.partNumber,
        availability: model.availability,
      };
      //   modelMatrix[model.color] = {
      //     size: model.size,
      //     partNumber: model.partNumber,
      //     availability: model.availability,
      //   };
    });

    const [edit, setEdit] = useState(false);
    const editInfo = (event) => {
      setEdit(!edit);
    };

    const EditMenu = () => {
      const saveEdit = () => {
        setEdit(false);
      };

      const [type, setType] = useState("");

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
          //   .patch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${id}`, {
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
              multiline
            />

            <TextField id="link" label="Link" variant="outlined" />
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
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ))}
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
