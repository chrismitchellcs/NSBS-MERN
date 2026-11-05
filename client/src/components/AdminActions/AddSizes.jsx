import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useCatalogOptions } from "api/catalogOptions";

/** Pick sizes for a new bike from the shop-wide size list (managed under "Brands & sizes"). */
const AddSizes = ({ sizes, setSizes }) => {
  const { sizes: allSizes } = useCatalogOptions();

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
                  // Keep the picked sizes in list order (smallest → largest), not click order.
                  const next = isChecked ? [...sizes, size] : sizes.filter((s) => s !== size);
                  setSizes(allSizes.filter((s) => next.includes(s)).concat(next.filter((s) => !allSizes.includes(s))));
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
