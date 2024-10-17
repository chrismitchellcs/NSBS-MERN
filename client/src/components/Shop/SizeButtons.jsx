import { Box, Button, Stack, styled } from "@mui/material";

// @ts-ignore
const SizeButton = styled(Button)({
  backgroundColor: "#EAEAEA",
  color: "black",
  maxHeight: "40px",
  fontWeight: "inherit",

  "&:hover": {
    backgroundColor: "#AAAAAA",
    color: "black",
  },
});

const SizeButtonAvailiable = styled(Button)({
  backgroundColor: "#c8ded3",
  color: "black",
  maxHeight: "40px",
  fontWeight: "inherit",

  "&:hover": {
    backgroundColor: "#AAAAAA",
    color: "black",
  },
});

const SizeButtonInStock = styled(Button)({
  backgroundColor: "#c8ded3",
  color: "black",
  maxHeight: "40px",
  fontWeight: "inherit",

  "&:hover": {
    backgroundColor: "#AAAAAA",
    color: "black",
  },
});

const SizeButtons = ({ sizes, size, setSize, sizesa, sizesis }) => {
  const handleClick = (e) => {
    const size = e.target.id;
    console.log(size);
    setSize(size);
  };
  return (
    <Stack spacing={2} width={"100%"}>
      {sizes.map((s) => {
        // if (s === size) {
        //   return (
        //     <SizeButtonClicked id={s} onClick={handleClick}>
        //       {s}
        //     </SizeButtonClicked>
        //   );
        // } else {
        //   return (
        //     <SizeButton id={s} onClick={handleClick}>
        //       {s}
        //     </SizeButton>
        //   );
        // }
        if (sizesis.includes(s)) {
          return (
            <SizeButtonInStock id={s} onClick={handleClick}>
              <Stack
                alignItems={"center"}
                direction={"row"}
                justifyContent={"space-between"}
                width={"100%"}
                p={1}
              >
                <Box fontSize={"16px"}>{s}</Box>
                <Box sx={{ fontSize: "12px", fontweight: "300" }}>In Store</Box>
              </Stack>
            </SizeButtonInStock>
          );
        } else if (sizesa.includes(s)) {
          return (
            <SizeButtonAvailiable id={s} onClick={handleClick}>
              <Stack
                alignItems={"center"}
                direction={"row"}
                justifyContent={"space-between"}
                width={"100%"}
                p={1}
              >
                <Box fontSize={"16px"}>{s}</Box>
                <Box sx={{ fontSize: "12px", fontweight: "300" }}>
                  In Warehouse (3-5 Days)
                </Box>
              </Stack>
            </SizeButtonAvailiable>
          );
        } else {
          return (
            <SizeButton id={s} onClick={handleClick}>
              <Stack
                alignItems={"center"}
                direction={"row"}
                justifyContent={"space-between"}
                width={"100%"}
                p={1}
              >
                <Box fontSize={"16px"}>{s}</Box>
                <Box sx={{ fontSize: "12px", fontweight: "300" }}>
                  Not Available
                </Box>
              </Stack>
            </SizeButton>
          );
        }
      })}
    </Stack>
  );
};

export default SizeButtons;
