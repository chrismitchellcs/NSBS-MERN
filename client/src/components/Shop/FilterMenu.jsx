import { Box, Button, Stack, styled } from "@mui/material";
import axios from "axios";
import CollapsedFilterMenu from "./CollapsedFilterMenu";
import { useNavigate } from "react-router-dom";

const FilterMenu = ({ setBikes }) => {
  const navigate = useNavigate();

  const FilterButton = styled(Button)({
    color: "white",

    maxHeight: "40px",
    fontWeight: "300",
    fontSize: "14px",

    "&:hover": {
      backgroundColor: "#4d5e5f",
      color: "white",
    },
  });

  const handleTypeClick = async (e) => {
    var type = e.target.id;
    console.log(type);
    if (type == "All" || type == "all") {
      type = "";
    }
    type = type.replace(/\s+/g, "+");
    type = type.replace("/", "=");

    navigate(`/shop/${type.toLowerCase()}`);
    navigate(0);
  };

  const handleBrandClick = async (e) => {
    e.preventDefault();
    var brand = e.target.id;
    console.log(brand);
    if (brand == "All" || brand == "all") {
      brand = "";
    }
    brand = brand.replace(" ", "+");
    navigate(`/shop/${brand.toLowerCase()}`);
    navigate(0);
  };
  const bikeTypes = [
    "DH",
    "Enduro / All Mountain",
    "Trail",
    "XC",
    "Dirt Jumper",
    "Recreational",
    "Kids",
    "E-Bike",
  ];

  const bikeBrands = ["All", "Transition", "Norco", "Ibis"];

  return (
    <Box width={"100%"} bgcolor={"black"} pt={2} pb={2}>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <Stack
          direction={"row"}
          spacing={2}
          display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
        >
          <FilterButton onClick={handleBrandClick} id="bnbnbn">
            All
          </FilterButton>
          <FilterButton onClick={handleBrandClick}>Transition</FilterButton>
          <FilterButton onClick={handleBrandClick} id="Norco">
            Norco
          </FilterButton>
          <FilterButton onClick={handleBrandClick} id="Transition">
            Ibis
          </FilterButton>
        </Stack>
        <CollapsedFilterMenu
          name={"Brand"}
          bikeTypes={bikeBrands}
          handleTypeClick={handleBrandClick}
        ></CollapsedFilterMenu>
        <Stack
          direction={"row"}
          spacing={2}
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
          name={"Filter"}
          bikeTypes={bikeTypes}
          handleTypeClick={handleTypeClick}
        ></CollapsedFilterMenu>
      </Stack>
    </Box>
  );
};

export default FilterMenu;
