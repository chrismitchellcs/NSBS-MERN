import { Box, Button, Stack, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FilterButton = styled(Button)({
  color: "black",

  maxHeight: "40px",
  fontWeight: "350",
  fontSize: "14px",
  padding: "0px",
  paddingTop: "2px",
  paddingLeft: "5px",
  paddingBottom: "2px",
  justifyContent: "left",

  "&:hover": {
    backgroundColor: "lightgrey",
    color: "black",
  },
});

const SideFilterMenu = () => {
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

  const bikeBrands = ["Transition", "Norco", "Ibis", "All"];
  const navigate = useNavigate();

  const handleBrandClick = async (e) => {
    e.preventDefault();
    var brand = e.target.id;
    console.log(brand);
    if (brand == "All" || brand == "all") {
      brand = "";
    }
    brand = brand.replace(" ", "+");
    brand = brand.replace(/\s+/g, "+");
    brand = brand.replace("/", "=");
    navigate(`/shop/${brand.toLowerCase()}`);
    navigate(0);
  };

  return (
    <div>
      <Box width={"250px"} position={"fixed"} sx={{ marginBottom: "200px" }}>
        <Stack alignItems={"left"} p={3} border={1} m={1} borderRadius={2}>
          <Box pb={1} sx={{ fontSize: "16px", fontWeight: "600" }} pl={"5px"}>
            BRAND
          </Box>
          {bikeBrands.map((brand) => (
            <FilterButton onClick={handleBrandClick} id={brand}>
              {brand}
            </FilterButton>
          ))}
        </Stack>
        <Stack
          alignItems={"left"}
          p={3}
          pt={1}
          border={1}
          borderRadius={2}
          m={1}
        >
          <Box
            pb={1}
            pt={2}
            sx={{ fontSize: "16px", fontWeight: "600" }}
            pl={"5px"}
          >
            TYPE
          </Box>
          {bikeTypes.map((type) => {
            return (
              <FilterButton onClick={handleBrandClick} id={type}>
                {type}
              </FilterButton>
            );
          })}
        </Stack>
      </Box>
      <Box
        width={"240px"}
        height={"100%"}
        borderRight={1}
        bgcolor={"white"}
      ></Box>
    </div>
  );
};

export default SideFilterMenu;
