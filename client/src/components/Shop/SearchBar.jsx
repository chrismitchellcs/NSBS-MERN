import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, InputAdornment, TextField } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";

const SearchBar = ({ value, onChange }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        id="shop-bike-search"
        type="search"
        placeholder="Search by brand, model…"
        aria-label="Search bikes"
        variant="outlined"
        size="small"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 22 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "background.paper",
            transition: (theme) =>
              theme.transitions.create(["box-shadow", "border-color"], {
                duration: theme.transitions.duration.short,
              }),
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0,0,0,0.14)",
              },
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 3px ${NAV_BAR_BG}22`,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: NAV_BAR_BG,
                borderWidth: 1,
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
