import { Button, Stack, styled } from "@mui/material";

// @ts-ignore
const SizeButton = styled(Button)({
  backgroundColor: "#EAEAEA",
  color: "black",
  maxHeight: "40px",

  "&:hover": {
    backgroundColor: "#AAAAAA",
    color: "black",
  },
});

const SizeButtonClicked = styled(Button)({
  backgroundColor: "#777777",
  color: "black",
  maxHeight: "40px",

  "&:hover": {
    backgroundColor: "#AAAAAA",
    color: "black",
  },
});

const SizeButtons = ({ sizes, size, setSize }) => {
  const handleClick = (e) => {
    const size = e.target.id;
    console.log(size);
    setSize(size);
  };
  return (
    <Stack direction={"row"} spacing={2}>
      {sizes.map((s) => {
        if (s === size) {
          return (
            <SizeButtonClicked id={s} onClick={handleClick}>
              {s}
            </SizeButtonClicked>
          );
        } else {
          return (
            <SizeButton id={s} onClick={handleClick}>
              {s}
            </SizeButton>
          );
        }
      })}
    </Stack>
  );
};

export default SizeButtons;
