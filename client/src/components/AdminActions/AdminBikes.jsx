import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";

import { Image } from "cloudinary-react";
import EditSizes from "./EditSizes";
import EditBikeBrand from "./EditBikeBrand";
import EditBikeName from "./EditBikeName";
import EditBikeMaterial from "./EditBikeMaterial";
import EditBikePrice from "./EditBikePrice";

const AdminBikes = ({ bikes, setBikes }) => {
  const handleClick = async (e) => {
    const bikeID = e.target.id;
    await axios
      .delete(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${bikeID}`, {})
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {});
  };

  const handleSizeClick = () => {};

  return (
    <Box m={3}>
      <Box fontSize={"30px"}>BIKES IN STOCK</Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell align="center">Material</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Sizes</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Page</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bikes.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Stack>
                    <EditBikeBrand
                      bike={row}
                      setBikes={setBikes}
                    ></EditBikeBrand>
                    <Box>{row.brand}</Box>
                  </Stack>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack>
                    <EditBikeName bike={row} setBikes={setBikes}></EditBikeName>
                    <Box>{row.name}</Box>
                  </Stack>
                </TableCell>

                <TableCell align="center">
                  <Stack>
                    <EditBikeMaterial
                      bike={row}
                      setBikes={setBikes}
                    ></EditBikeMaterial>
                    <Box>{row.material}</Box>
                  </Stack>
                </TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">
                  {" "}
                  <Stack>
                    <EditBikePrice
                      bike={row}
                      setBikes={setBikes}
                    ></EditBikePrice>
                    <Box>${row.price}</Box>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  {JSON.parse(row.images).map((image) => (
                    <Image
                      cloudName="ds4ukwnxl"
                      publicId={image}
                      width="100"
                      crop="scale"
                    ></Image>
                  ))}
                </TableCell>
                <TableCell align="center">
                  <Stack>
                    <EditSizes bike={row} setBikes={setBikes}></EditSizes>
                    {JSON.parse(row.sizes).map((size) => {
                      return <Box>{size}</Box>;
                    })}
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Box fontSize={"10px"}>{row.description}</Box>
                </TableCell>
                <TableCell align="center">
                  <Link href={row.link} target="_blank" rel="noopener">
                    Webpage
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Button id={row._id} onClick={handleClick}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminBikes;
