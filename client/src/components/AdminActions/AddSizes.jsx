import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const AddSizes = ({ sizes, setSizes }) => {
  const allSizes = [
    '10"',
    '12"',
    '14"',
    '16"',
    '20"',
    '24"',
    "Short",
    "Long",
    "X-Long",
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "1",
    "2",
    "3",
    "4",
    "5",
  ];

  const removeSize = (s, size) => {
    const index = s.indexOf(size);
    if (index > -1) {
      s.splice(index, 1);
    }
    setSizes(s);
  };

  const addSize = (s, size) => {
    s.push(size);
    setSizes(s);
  };

  const handleClick = (e) => {
    const size = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      var s = sizes;
      addSize(s, size);
    } else {
      const s = sizes;
      removeSize(s, size);
    }
  };

  return (
    <Box>
      <FormGroup aria-label="position" row onClick={handleClick}>
        {allSizes.map((size) => {
          return (
            <FormControlLabel
              value={size}
              control={<Checkbox />}
              label={size}
              labelPlacement="top"
            />
          );
        })}
      </FormGroup>
    </Box>
  );
};

export default AddSizes;
