import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Chip, Collapse, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { NAV_BAR_BG } from "components/General/NavBar";
import { useMemo, useState } from "react";
import {
  OPEN_TRANSITION_BIKE_EVENT,
  transitionBikesNeedingAttention,
} from "utils/transitionAdminChecks";

const CHIP_COLOR = { high: "error", medium: "warning", info: "default" };

/** Two-digit model year from "26 Bottlerocket…" or the year field; 0 when unknown. */
function modelYear(bike) {
  const prefix = String(bike?.fullName || "").trim().split(" ")[0];
  if (/^\d{2}$/.test(prefix)) return Number(prefix);
  const y = Number(bike?.year);
  return Number.isFinite(y) ? y : 0;
}

function openBike(id) {
  window.dispatchEvent(new CustomEvent(OPEN_TRANSITION_BIKE_EVENT, { detail: id }));
}

function FlaggedBikeList({ items, onArchive, archivingId }) {
  return (
    <Stack spacing={1} sx={{ maxHeight: 360, overflow: "auto", pr: 0.5 }}>
      {items.map(({ bike, issues }) => (
        <Stack
          key={bike._id}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1}
          sx={{ py: 1, px: 1.5, borderRadius: 1, bgcolor: "action.hover" }}
        >
          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700}>
              {bike.fullName || bike.name}
            </Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
              {issues.map((issue) => (
                <Chip
                  key={issue.key}
                  size="small"
                  label={issue.label}
                  color={CHIP_COLOR[issue.severity]}
                  variant={issue.severity === "info" ? "outlined" : "filled"}
                />
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => openBike(bike._id)}
              sx={{ borderColor: NAV_BAR_BG, color: NAV_BAR_BG, textTransform: "none" }}
            >
              Open
            </Button>
            {onArchive ? (
              <Button
                size="small"
                variant="outlined"
                color="warning"
                disabled={archivingId === bike._id}
                onClick={() => onArchive(bike)}
                sx={{ textTransform: "none" }}
              >
                {archivingId === bike._id ? "Archiving…" : "Archive"}
              </Button>
            ) : null}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

const TransitionNeedsAttention = ({ bikes, onRefresh }) => {
  const [showDrafts, setShowDrafts] = useState(false);
  const [archivingId, setArchivingId] = useState(null);

  const archiveBike = async (bike) => {
    setArchivingId(bike._id);
    try {
      await axios.patch(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/transition/${bike._id}`,
        { newBike: { archived: true, public: false } },
        { withCredentials: true }
      );
      await onRefresh?.();
    } catch {
      alert("Could not archive this bike.");
    } finally {
      setArchivingId(null);
    }
  };
  const { live, drafts } = useMemo(() => {
    const flagged = transitionBikesNeedingAttention(bikes);
    return {
      live: flagged.filter(({ bike }) => bike.public),
      drafts: flagged
        .filter(({ bike }) => !bike.public)
        .sort(
          (a, b) =>
            modelYear(b.bike) - modelYear(a.bike) ||
            String(a.bike.fullName || "").localeCompare(String(b.bike.fullName || ""))
        ),
    };
  }, [bikes]);

  if (!bikes?.length) return null;

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ color: NAV_BAR_BG }}>
        Needs attention ({live.length})
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
        Live bikes missing photos or details. Colours without a photo don&apos;t show properly on the
        shop.
      </Typography>
      {live.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nothing to do. Every live bike has photos, a description, and a type.
        </Typography>
      ) : (
        <FlaggedBikeList items={live} />
      )}

      {drafts.length > 0 ? (
        <>
          <Button
            size="small"
            onClick={() => setShowDrafts((v) => !v)}
            endIcon={showDrafts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ mt: 2, color: NAV_BAR_BG, textTransform: "none", px: 0 }}
          >
            {showDrafts ? "Hide" : "Show"} drafts with stock ({drafts.length})
          </Button>
          <Collapse in={showDrafts} unmountOnExit>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Private bikes the vendor has stock for, with what they still need before you make them
              public. Out-of-stock drafts and archived bikes are not listed.
            </Typography>
            <FlaggedBikeList items={drafts} onArchive={archiveBike} archivingId={archivingId} />
          </Collapse>
        </>
      ) : null}
    </Paper>
  );
};

export default TransitionNeedsAttention;
