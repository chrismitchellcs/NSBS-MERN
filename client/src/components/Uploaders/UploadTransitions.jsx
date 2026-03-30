import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Snackbar,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";
import axios from "axios";
import { useEffect, useState } from "react";
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
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Stack spacing={3} alignItems="stretch">
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Bikes updated from stock file.
        </Alert>
      </Snackbar>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700} sx={{ color: NAV_BAR_BG }}>
            Upload Transition stock file
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            Export HTML from the B2B stock list and upload it here. It creates/updates Transition models and availability.
            To get the file: click{" "}
            <Link rel="noopener noreferrer" href="https://www.b2b.transitionbikes.com/Account.cfm" target="_blank">
              Transition B2B
            </Link>
            , sign in, open <strong>Stock List</strong>, then download as Excel/HTML as you currently do.
          </Typography>
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ bgcolor: NAV_BAR_BG }}
            >
              Choose stock file
              <VisuallyHiddenInput type="file" onChange={uploadBikes} />
            </Button>
          </Box>
        </Stack>
      </Paper>

      <EditTransitions bikes={bikes} setBikes={setBikes} />
    </Stack>
  );
};

export default UploadTransitions;
