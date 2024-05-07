import { Box, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const AddImage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sizeOK, setSizeOK] = useState(true);

  const fileSelectedHandler = (e) => {
    const selectedFiles = e.target.files;
    var selectedFilesArray = Array.from(selectedFiles);
    console.log(selectedFilesArray[0].name);
    setSizeOK(true);
    selectedFilesArray.some((file) => {
      console.log(file.size);
      if (file.size > 10485760) {
        alert("One of the files is too large. The maximum is 10MB");
        selectedFilesArray = [];
        setSizeOK(false);
      }
    });
    previewFiles(selectedFilesArray);
  };

  const previewFiles = async (filesArray) => {
    const base64Array = await Promise.all(
      filesArray.map(async (file) => {
        const loadedFile = await loadFile(file, file.name);
        return loadedFile;
      })
    );
    console.log(base64Array);
    setSelectedFiles(base64Array);
  };

  const loadFile = async (file, fileName) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({ file: reader.result, name: fileName });
      };
      reader.onerror = () => {
        reject();
      };
    });
  };

  const fileUploadHandler = async (e) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      await Promise.all(
        selectedFiles.map((file) => {
          uploadImage(file);
        })
      );
      alert("images uploaded");
    } else {
      alert("no files to upload");
    }
  };

  const uploadImage = async (file) => {
    const data = JSON.stringify({ file });
    return new Promise(async (resolve, reject) => {
      await axios
        .post("http://localhost:5050/api/images", {
          data,
        })
        .then((res) => {
          console.log(res);
          resolve();
        })
        .catch((error) => {
          reject();
        });
    });
  };

  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={fileSelectedHandler}
      />
      {!sizeOK && <Box>One of the files is too large. The maximum is 10MB</Box>}
      <Box>
        {selectedFiles &&
          selectedFiles.map((file, index) => {
            return <img src={file.file} alt="chosen" width={"400px"} />;
          })}
      </Box>

      <Button onClick={fileUploadHandler}>Upload Images</Button>
    </Box>
  );
};

export default AddImage;
