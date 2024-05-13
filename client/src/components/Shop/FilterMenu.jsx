import { Box, Button, Stack, styled } from "@mui/material";
import axios from "axios";
import CollapsedFilterMenu from "./CollapsedFilterMenu";

const FilterMenu = ({ setBikes }) => {
  const FilterButton = styled(Button)({
    color: "white",

    maxHeight: "40px",
    fontWeight: "300",
    fontSize: "16px",

    "&:hover": {
      backgroundColor: "#4d5e5f",
      color: "white",
    },
  });

  const handleTypeClick = async (e) => {
    const type = e.target.id;
    await axios
      .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/type`, { type })
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {});
  };

  const handleBrandClick = async (e) => {
    const brand = e.target.id;
    await axios
      .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/brand`, { brand })
      .then((res) => {
        setBikes(res.data);
      })
      .catch((error) => {});
  };
  const bikeTypes = [
    "DH",
    "Enduro / All Mountain",
    "Trail",
    "XC",
    "Recreational",
    "Kids",
  ];

  return (
    <Box width={"100%"} bgcolor={"black"} pt={2} pb={2}>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <Stack direction={"row"} spacing={5}>
          <FilterButton onClick={handleBrandClick} id="Transition">
            Transition
          </FilterButton>
          <FilterButton onClick={handleBrandClick} id="Norco">
            Norco
          </FilterButton>
        </Stack>
        <Stack
          direction={"row"}
          spacing={5}
          display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
        >
          {bikeTypes.map((type) => {
            return (
              <FilterButton onClick={handleTypeClick} id={type}>
                {type}
              </FilterButton>
            );
          })}
        </Stack>
        <CollapsedFilterMenu
          bikeTypes={bikeTypes}
          handleTypeClick={handleTypeClick}
        ></CollapsedFilterMenu>
      </Stack>
    </Box>
  );
};

export default FilterMenu;
