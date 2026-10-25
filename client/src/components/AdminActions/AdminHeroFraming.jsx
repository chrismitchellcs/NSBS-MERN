import CenterFocusStrongOutlinedIcon from "@mui/icons-material/CenterFocusStrongOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useRef } from "react";

const STEP = 5;
const KEYWORDS = { left: 0, center: 50, right: 100, top: 0, bottom: 100 };

const clamp = (n) => Math.min(100, Math.max(0, Math.round(n)));

/** CSS object-position ("center bottom", "30% 70%", "left") → { x, y } percentages. */
export function parseObjectPosition(value) {
  const parts = String(value || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return { x: 50, y: 100 };
  const toNum = (p) => (p.endsWith("%") ? parseFloat(p) : KEYWORDS[p]);
  const isVertical = (p) => p === "top" || p === "bottom";
  const isHorizontal = (p) => p === "left" || p === "right";

  if (parts.length === 1) {
    const [p] = parts;
    if (isVertical(p)) return { x: 50, y: KEYWORDS[p] };
    const n = toNum(p);
    return { x: Number.isFinite(n) ? clamp(n) : 50, y: 50 };
  }
  let [a, b] = parts;
  if (isVertical(a) || isHorizontal(b)) [a, b] = [b, a];
  const x = toNum(a);
  const y = toNum(b);
  return { x: Number.isFinite(x) ? clamp(x) : 50, y: Number.isFinite(y) ? clamp(y) : 50 };
}

const toValue = ({ x, y }) => `${clamp(x)}% ${clamp(y)}%`;

const band = (n, low, mid, high, lowMid, midHigh) =>
  n <= 15 ? low : n >= 85 ? high : n >= 40 && n <= 60 ? mid : n < 50 ? lowMid : midHigh;

/** { x: 50, y: 100 } → "Bottom of the photo, centred" */
function describe({ x, y }) {
  const down = band(y, "Top", "Middle", "Bottom", "Upper part", "Lower part");
  const across = band(x, "left side", "centred", "right side", "left of centre", "right of centre");
  return `${down} of the photo, ${across}`;
}

/**
 * Cover-cropped preview you can drag. Dragging the photo down reveals more of its top, the same as
 * sliding a print around behind a frame.
 */
function FramePreview({ src, position, onChange, aspectRatio, label, textAlign, headline }) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);

  const onPointerDown = (e) => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img?.naturalWidth) return;
    const { width: cw, height: ch } = frame.getBoundingClientRect();
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      from: position,
      overflowX: img.naturalWidth * scale - cw,
      overflowY: img.naturalHeight * scale - ch,
    };
    frame.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    onChange({
      x: d.overflowX > 1 ? clamp(d.from.x - (dx / d.overflowX) * 100) : d.from.x,
      y: d.overflowY > 1 ? clamp(d.from.y - (dy / d.overflowY) * 100) : d.from.y,
    });
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        sx={{
          position: "relative",
          aspectRatio,
          borderRadius: 1.5,
          overflow: "hidden",
          bgcolor: "grey.900",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
          "&:active": { cursor: "grabbing" },
        }}
      >
        <Box
          ref={imgRef}
          component="img"
          src={src}
          alt=""
          draggable={false}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: toValue(position),
            pointerEvents: "none",
          }}
        />
        <Box aria-hidden sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.32)", pointerEvents: "none" }} />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: 1.25,
            textAlign,
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          <Box sx={{ fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", lineHeight: 1.1 }}>
            {headline || "Headline"}
          </Box>
          <Box
            sx={{
              display: "inline-block",
              mt: 0.5,
              width: 34,
              height: 10,
              borderRadius: 0.5,
              bgcolor: "rgba(255,255,255,0.9)",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

const padButtonSx = { border: "1px solid", borderColor: "divider", borderRadius: 1.5, width: 40, height: 40 };

/** Photo framing for a hero slide: drag either preview or use the arrows; saves as "X% Y%". */
export default function AdminHeroFraming({ src, value, onChange, headline }) {
  const position = parseObjectPosition(value);
  const set = (next) => onChange(toValue(next));
  const nudge = (dx, dy) => set({ x: position.x + dx, y: position.y + dy });

  const onKeyDown = (e) => {
    const map = { ArrowUp: [0, -STEP], ArrowDown: [0, STEP], ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0] };
    const step = map[e.key];
    if (!step) return;
    e.preventDefault();
    nudge(step[0], step[1]);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Photo framing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Drag a preview or use the arrows to choose which part of the photo shows. Check both sizes,
        since phones crop much more of the sides.
      </Typography>

      <Box
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Photo framing previews. Use arrow keys to move the photo."
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 110px",
          gap: 1.5,
          alignItems: "end",
          borderRadius: 1.5,
          "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 4 },
        }}
      >
        <FramePreview
          src={src}
          position={position}
          onChange={set}
          aspectRatio="2 / 1"
          label="Desktop"
          textAlign="left"
          headline={headline}
        />
        <FramePreview
          src={src}
          position={position}
          onChange={set}
          aspectRatio="9 / 14"
          label="Phone"
          textAlign="center"
          headline={headline}
        />
      </Box>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1.5 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 40px)", gap: 0.5, flexShrink: 0 }}>
          <span />
          <Tooltip title="Show more of the top">
            <IconButton aria-label="Show more of the top" onClick={() => nudge(0, -STEP)} disabled={position.y <= 0} sx={padButtonSx}>
              <KeyboardArrowUpIcon />
            </IconButton>
          </Tooltip>
          <span />
          <Tooltip title="Show more of the left">
            <IconButton aria-label="Show more of the left" onClick={() => nudge(-STEP, 0)} disabled={position.x <= 0} sx={padButtonSx}>
              <KeyboardArrowLeftIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Centre the photo">
            <IconButton aria-label="Centre the photo" onClick={() => set({ x: 50, y: 50 })} sx={padButtonSx}>
              <CenterFocusStrongOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Show more of the right">
            <IconButton aria-label="Show more of the right" onClick={() => nudge(STEP, 0)} disabled={position.x >= 100} sx={padButtonSx}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </Tooltip>
          <span />
          <Tooltip title="Show more of the bottom">
            <IconButton aria-label="Show more of the bottom" onClick={() => nudge(0, STEP)} disabled={position.y >= 100} sx={padButtonSx}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </Tooltip>
          <span />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2">{describe(position)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {position.x}% across, {position.y}% down
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
