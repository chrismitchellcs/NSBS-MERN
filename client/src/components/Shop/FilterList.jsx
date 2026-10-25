import { Box, Chip, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";

const chipBaseSx = {
  fontWeight: 500,
  borderRadius: 2,
  transition: (theme) =>
    theme.transitions.create(["background-color", "border-color", "color"], {
      duration: theme.transitions.duration.short,
    }),
};

export const selectedChipSx = {
  ...chipBaseSx,
  bgcolor: NAV_BAR_BG,
  color: "#fff",
  borderColor: NAV_BAR_BG,
  "&:hover": {
    bgcolor: "#1e332b",
    borderColor: "#1e332b",
  },
};

export const idleChipSx = {
  ...chipBaseSx,
  bgcolor: "background.paper",
  borderColor: "divider",
  color: "text.secondary",
  "&:hover": {
    borderColor: "text.disabled",
    bgcolor: "grey.100",
    color: "text.primary",
  },
};

export const filterSectionTitleSx = {
  display: "block",
  color: "text.secondary",
  letterSpacing: "0.12em",
  fontWeight: 700,
  fontSize: "0.68rem",
  mb: 1,
};

/** One chip per value with its result count; zero-result chips are disabled unless selected. */
function ChipGroup({ title, values, selected, counts, onToggle }) {
  return (
    <Box>
      <Typography variant="overline" sx={filterSectionTitleSx}>
        {title}
      </Typography>
      <Stack spacing={1} alignItems="flex-start">
        {values.map((value) => {
          const isSelected = selected.includes(value);
          const count = counts?.[value] ?? 0;
          return (
            <Chip
              key={value}
              label={`${value} (${count})`}
              onClick={() => onToggle(value)}
              disabled={!isSelected && count === 0}
              variant={isSelected ? "filled" : "outlined"}
              aria-pressed={isSelected}
              sx={isSelected ? selectedChipSx : idleChipSx}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default function FilterList({
  bikeBrands,
  bikeTypes,
  checkedBrands,
  checkedTypes,
  brandCounts,
  typeCounts,
  onToggleBrand,
  onToggleType,
}) {
  return (
    <Stack spacing={2.5} sx={{ width: "100%" }}>
      <ChipGroup
        title="Brand"
        values={bikeBrands}
        selected={checkedBrands}
        counts={brandCounts}
        onToggle={onToggleBrand}
      />
      <ChipGroup
        title="Type"
        values={bikeTypes}
        selected={checkedTypes}
        counts={typeCounts}
        onToggle={onToggleType}
      />
    </Stack>
  );
}
