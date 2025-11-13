import { Box, Button, Link, Snackbar, Stack, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import axios from "axios";
import EditTransitions from "./EditTransitions";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadTransitions = () => {
  const [data, setData] = useState(null);
  // const [stock, setStock] = useState(null);
  const [bikes, setBikes] = useState([]);

  const fetchBikes = async () => {
    await axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/alltransition`, {
        withCredentials: true,
      })
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

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const html = e.target.result;

        const parser = new DOMParser();
        // @ts-ignore
        const doc = parser.parseFromString(html, "text/html");

        const table = doc.querySelector("table");
        if (!table) {
          reject(new Error("No table found in uploaded file"));
          return;
        }

        const rows = table.querySelectorAll("tr");

        const headers = Array.from(rows[0].querySelectorAll("td, th")).map(
          (el) => el.textContent.trim()
        );

        const parsedData = Array.from(rows)
          .slice(1)
          .map((row) => {
            const cells = Array.from(row.querySelectorAll("td, th"));
            const entry = {};

            let imageFound = false;

            cells.forEach((cell, index) => {
              const refImage = cell.getAttribute("refImage");
              if (refImage && !imageFound) {
                entry[
                  "PHOTO"
                ] = `https://www.transitionbikes.com/WebStoreImages/${refImage}`;
                imageFound = true;
              }

              const header = headers[index] || `Column ${index + 1}`;
              entry[header] = cell.textContent.trim();
            });

            if (!entry["Photo"]) {
              entry["Photo"] = "";
            }

            return entry;
          })
          .filter(Boolean);

        setData(parsedData);
        resolve(parsedData);
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const transformStockList = (inputData = data) => {
    let stock = {};

    inputData.forEach((item) => {
      try {
        let cleaned = item.PRODUCT.replace("Complete: ", "");
        cleaned = cleaned.replace(" - USA", "").trim();

        if (cleaned.includes("Complete: ")) {
          cleaned = cleaned.replace("Complete: ", "");
        }

        const [namePart, metaPart] = cleaned.split(" (");
        const [size, color] = metaPart
          .replace(")", "")
          .split(", ")
          .map((s) => s.trim());
        const name = namePart;
        if (!item["PART NUMBER"].includes(".")) {
          return;
        }
        const numbers = item["PART NUMBER"].split(".");
        const modelYear = numbers[1];

        if (numbers[1].length === 2) {
          let fullName = `${modelYear} ${name}`.trim();

          const bikeData = {
            size,
            color,
            partNumber: item["PART NUMBER"],
            availability: item["AVAILABILITY"],
          };

          if (!stock[fullName]) {
            stock[fullName] = {
              bikes: [],
              modelYear,
              regularRetail: item["REGULAR RETAIL"],
              saleRetail: item["SALE RETAIL"],
              name,
              colors: {},
            };
          }

          stock[fullName].bikes.push(bikeData);
          stock[fullName].colors[color] = "";
        }
      } catch (error) {
        console.log("error uploading this bike: ", item);
      }
    });

    return stock;
  };

  const addBikesToDB = async (stockData = data) => {
    await axios
      .post(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition`,
        {
          stock: stockData,
        },
        { withCredentials: true }
      )
      .then((res) => {})
      .catch((error) => {
        alert("bike not added");
      });
  };

  const uploadBikes = async (event) => {
    const file = event.target.files[0];
    const parsedData = await uploadFile(file);
    const stock = transformStockList(parsedData);
    await addBikesToDB(stock);
    await fetchBikes();
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(true);
  };

  return (
    <Stack alignItems={"center"} spacing={1}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Bikes Updated"
      />
      <Box fontWeight={"600"} fontSize={"20px"}>
        Upload Transition Stock
      </Box>
      <Box fontWeight={"350"} fontSize={"14px"}>
        To get the file: Click{" "}
        <Link
          rel="noopener noreferrer"
          href="https://www.b2b.transitionbikes.com/Account.cfm"
          target="_blank"
        >
          Here
        </Link>
        , login, click on "Stock List", then click on "Download Excel"
      </Box>

      <Box>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={uploadBikes} />
        </Button>
      </Box>

      <EditTransitions bikes={bikes} setBikes={setBikes}></EditTransitions>
    </Stack>
  );
};

export default UploadTransitions;
