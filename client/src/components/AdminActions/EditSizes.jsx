import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";

const EditSizes = ({ bike }) => {
  const [edit, setEdit] = useState(false);

  const handleClick = () => {
    setEdit(true);
  };

  return (
    <Stack>
      <Button onClick={handleClick}>Edit</Button>
      {edit &&
        JSON.parse(bike.sizes).map((size) => {
          return <Button>{size}</Button>;
        })}
    </Stack>
  );
};

export default EditSizes;
