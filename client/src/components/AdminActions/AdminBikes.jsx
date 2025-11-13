import {
  Box,
  Button,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { Image } from "cloudinary-react";
import EditBikeBrand from "./EditBikeBrand";
import EditBikeMaterial from "./EditBikeMaterial";
import { useEffect, useState } from "react";
import EditBikeDetail from "./EditBikeDetail";
import EditBikeType from "./EditBikeType";
import EditBikeSizes from "./EditBikeSizes";

const EditButton = styled(Button)({
  backgroundColor: "transparent",
  color: "black",
  maxHeight: "40px",
  padding: "2px",
  fontSize: "14px",
  paddingLeft: "5px",
  paddingRight: "5px",
  minWidth: "0px",
  textTransform: "none",
  fontFamily: "Open Sans, sans-serif",
  letterSpacing: 0,
  fontWeight: "600",
  "&:hover": {
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "5px",
    backgroundColor: "transparent",
    color: "black",
  },
});

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);
  useEffect(() => {
    const fetchBikes = async () => {
      console.log(process.env.REACT_APP_VERCEL_DOMAIN);
      await axios
        .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`, {
          withCredentials: true,
        })
        .then((res) => {
          setBikes(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchBikes();
  }, []);

  const Bike = ({ bike, index }) => {
    const [showImages, setShowImages] = useState(false);

    return (
      <TableRow>
        <TableCell sx={{ borderRight: 0.5 }}>
          <Stack alignItems={"center"} spacing={1}>
            {!showImages && (
              <EditButton
                onClick={() => {
                  setShowImages(true);
                }}
              >
                Show Images
              </EditButton>
            )}
            {showImages && (
              <EditButton
                onClick={() => {
                  setShowImages(false);
                }}
              >
                Hide Images
              </EditButton>
            )}

            {showImages && (
              <Stack justifyContent={"center"}>
                {JSON.parse(bike.images).map((image) => (
                  <Image
                    cloudName="ds4ukwnxl"
                    publicId={image}
                    width="180"
                    height="100"
                    crop="pad"
                  ></Image>
                ))}
              </Stack>
            )}
          </Stack>
        </TableCell>
        <TableCell sx={{ borderRight: 0.5 }}>
          <Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Box>
                <b>Year:</b>
              </Box>
              <Box>{bike.year}</Box>
              <EditBikeDetail
                property={"year"}
                bike={bike}
                setBikes={setBikes}
              ></EditBikeDetail>
            </Stack>
            <EditBikeBrand bike={bike} setBikes={setBikes}></EditBikeBrand>
            {/* <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Box>
                <b>Brand:</b>
              </Box>
              <Box>{bike.brand}</Box>
              <EditBikeDetail
                property={"brand"}
                bike={bike}
                setBikes={setBikes}
              ></EditBikeDetail>
            </Stack> */}
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Box>
                <b>Name:</b>
              </Box>
              <Box>{bike.name}</Box>
              <EditBikeDetail
                property={"name"}
                bike={bike}
                setBikes={setBikes}
              ></EditBikeDetail>
            </Stack>
            <EditBikeMaterial
              bike={bike}
              setBikes={setBikes}
            ></EditBikeMaterial>

            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Box>
                <b>Price:</b>
              </Box>
              <Box>{bike.price}</Box>
              <EditBikeDetail
                property={"price"}
                bike={bike}
                setBikes={setBikes}
              ></EditBikeDetail>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Box>
                <b>Sale Price (Leave Blank if Not on Sale):</b>
              </Box>
              <Box>{bike.saleprice}</Box>
              <EditBikeDetail
                property={"saleprice"}
                bike={bike}
                setBikes={setBikes}
              ></EditBikeDetail>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell sx={{ borderRight: 0.5 }}>
          <EditBikeType bike={bike} setBikes={setBikes}></EditBikeType>
        </TableCell>
        <TableCell sx={{ borderRight: 0.5 }}>
          <Stack spacing={1}>
            <EditBikeSizes bike={bike} setBikes={setBikes}></EditBikeSizes>

            {/* <EditBikeColors bike={bike} setBikes={setBikes}></EditBikeColors> */}
          </Stack>
        </TableCell>
        <TableCell>
          {/* <EditBikeAvailability
            bike={bike}
            setBikes={setBikes}
          ></EditBikeAvailability> */}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box width={"100%"}>
      {bikes && (
        <Paper sx={{ width: "100%" }}>
          <TableContainer>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Images</TableCell>
                  <TableCell align="center">Details</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Sizes / Colors</TableCell>
                  <TableCell align="center">Availability</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bikes.map((bike, index) => {
                  return <Bike bike={bike} index={index}></Bike>;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AdminBikes;

// <Stack spacing={3} width={"100%"}>
//   {bikes.map((bike) => {
//     return (
//       <Stack direction={"row"} width={"100%"}>
//         <Stack border={1} p={1} width={"100%"}>
//           <Box>Year: {bike.year}</Box>
//           <Box>Brand: {bike.brand}</Box>
//           <Box>Name: {bike.name}</Box>
//           <Box>Material: {bike.material}</Box>
//         </Stack>
//         <Stack border={1} p={1} width={"100%"}>
//           <Box>Price: ${bike.price}</Box>
//           <Box>Sale Price: ${bike.saleprice}</Box>
//         </Stack>
//         <Stack border={1} p={1} width={"100%"}>
//           <Box>Type: {bike.type}</Box>
//         </Stack>
//         <Stack border={1} p={1} width={"100%"} direction={"row"}>
//           {JSON.parse(bike.images).map((image) => (
//             <Image
//               cloudName="ds4ukwnxl"
//               publicId={image}
//               width="180"
//               height="100"
//               crop="pad"
//             ></Image>
//           ))}
//         </Stack>
//         <Stack
//           border={1}
//           p={1}
//           width={"100%"}
//           direction={"row"}
//           spacing={1}
//         >
//           <Box>All Sizes: </Box>
//           {JSON.parse(bike.sizes).map((size) => {
//             return <Box>{size}</Box>;
//           })}
//         </Stack>
//       </Stack>
//     );
//   })}
// </Stack>
// <Box>
//   <Box fontSize={"30px"}>BIKES IN STOCK</Box>
//   <TableContainer component={Paper}>
//     <Table sx={{ minWidth: 650 }} aria-label="simple table">
//       <TableHead>
//         <TableRow>
//           <TableCell>Brand</TableCell>
//           <TableCell>Model</TableCell>
//           <TableCell align="center">Material</TableCell>
//           <TableCell align="center">Type</TableCell>
//           <TableCell align="center">Price</TableCell>
//           <TableCell align="center">Sale Price</TableCell>
//           <TableCell align="center">Images</TableCell>
//           <TableCell align="center">Sizes</TableCell>
//           <TableCell align="center">Sizes Available</TableCell>
//           <TableCell align="center">Sizes In Stock</TableCell>
//           <TableCell align="center">Description</TableCell>
//           <TableCell align="center">Page</TableCell>
//           <TableCell align="center"></TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {bikes.map((row) => (
//           <TableRow
//             key={row.name}
//             sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//           >
//             <TableCell component="th" scope="row">
//               <Stack>
//                 <EditBikeBrand
//                   bike={row}
//                   setBikes={setBikes}
//                 ></EditBikeBrand>
//                 <Box>{row.brand}</Box>
//               </Stack>
//             </TableCell>
//             <TableCell component="th" scope="row">
//               <Stack>
//                 <EditBikeName
//                   bike={row}
//                   setBikes={setBikes}
//                 ></EditBikeName>
//                 <Box>{row.name}</Box>
//               </Stack>
//             </TableCell>

//             <TableCell align="center">
//               <Stack>
//                 <EditBikeMaterial
//                   bike={row}
//                   setBikes={setBikes}
//                 ></EditBikeMaterial>
//                 <Box>{row.material}</Box>
//               </Stack>
//             </TableCell>
//             <TableCell align="center">{row.type}</TableCell>
//             <TableCell align="center">
//               {" "}
//               <Stack>
//                 <EditBikePrice
//                   bike={row}
//                   setBikes={setBikes}
//                 ></EditBikePrice>
//                 <Box>${row.price}</Box>
//               </Stack>
//             </TableCell>
//             <TableCell align="center">
//               {" "}
//               <Stack>
//                 <EditBikeSalePrice
//                   bike={row}
//                   setBikes={setBikes}
//                 ></EditBikeSalePrice>
//                 <Box>${row.saleprice}</Box>
//               </Stack>
//             </TableCell>
//             <TableCell align="center">
//               {JSON.parse(row.images).map((image) => (
//                 <Image
//                   cloudName="ds4ukwnxl"
//                   publicId={image}
//                   width="100"
//                   crop="scale"
//                 ></Image>
//               ))}
//             </TableCell>
//             <TableCell align="center">
//               <Stack>
//                 <EditSizes bike={row} setBikes={setBikes}></EditSizes>
//                 {JSON.parse(row.sizes).map((size) => {
//                   return <Box>{size}</Box>;
//                 })}
//               </Stack>
//             </TableCell>
//             <TableCell align="center">
//               <Stack>
//                 <EditSizesAvailiable
//                   bike={row}
//                   setBikes={setBikes}
//                 ></EditSizesAvailiable>
//                 {row.sizesa ? (
//                   <Box>
//                     {JSON.parse(row.sizesa).map((size) => {
//                       return <Box>{size}</Box>;
//                     })}
//                   </Box>
//                 ) : (
//                   "N/A"
//                 )}
//               </Stack>
//             </TableCell>
//             <TableCell align="center">
//               <Stack>
//                 <EditSizesInStock
//                   bike={row}
//                   setBikes={setBikes}
//                 ></EditSizesInStock>
//                 {row.sizesis ? (
//                   <Box>
//                     {JSON.parse(row.sizesis).map((size) => {
//                       return <Box>{size}</Box>;
//                     })}
//                   </Box>
//                 ) : (
//                   "N/A"
//                 )}
//               </Stack>
//             </TableCell>
//             <TableCell align="center">
//               <Box fontSize={"10px"}>{row.description}</Box>
//             </TableCell>
//             <TableCell align="center">
//               <Link href={row.link} target="_blank" rel="noopener">
//                 Webpage
//               </Link>
//             </TableCell>
//             <TableCell align="center">
//               <Button id={row._id} onClick={handleClick}>
//                 Delete
//               </Button>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// </Box>
