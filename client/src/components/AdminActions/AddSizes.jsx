import { Box, Checkbox, FormControlLabel } from "@mui/material";

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

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(4.25rem, 1fr))",
        gap: 0.5,
        width: "100%",
      }}
    >
      {allSizes.map((size) => {
        const checked = sizes.includes(size);
        return (
          <FormControlLabel
            key={size}
            sx={{
              m: 0,
              px: 0.25,
              py: 0.25,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px solid",
              borderColor: checked ? "primary.main" : "divider",
              borderRadius: 0.75,
              bgcolor: checked ? "action.selected" : "background.paper",
              minHeight: 44,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.7rem",
                lineHeight: 1.1,
                maxWidth: "100%",
              },
            }}
            labelPlacement="top"
            control={
              <Checkbox
                size="small"
                checked={checked}
                value={size}
                onChange={(_, isChecked) => {
                  if (isChecked) {
                    if (!sizes.includes(size)) setSizes([...sizes, size]);
                  } else {
                    setSizes(sizes.filter((s) => s !== size));
                  }
                }}
                sx={{ p: 0, mt: 0.25 }}
              />
            }
            label={size}
          />
        );
      })}
    </Box>
  );
};

export default AddSizes;
