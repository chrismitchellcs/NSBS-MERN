import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const api = `${process.env.REACT_APP_VERCEL_DOMAIN}/api/service-listings`;

const emptyForm = {
  kind: "rate",
  title: "",
  price: "",
  description: "",
  sortOrder: 0,
  active: true,
};

const AdminServiceListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(api, { withCredentials: true });
      setItems(res.data ?? []);
    } catch (e) {
      console.error(e);
      alert("Could not load service listings. Are you logged in?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openNew = () => {
    setEditingId(null);
    const next =
      items.length > 0
        ? Math.max(...items.map((x) => Number(x.sortOrder) || 0)) + 1
        : 0;
    setForm({ ...emptyForm, sortOrder: next });
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row._id);
    setForm({
      kind: row.kind === "package" ? "package" : "rate",
      title: row.title ?? "",
      price: row.price ?? "",
      description: row.description ?? "",
      sortOrder: row.sortOrder ?? 0,
      active: row.active !== false,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title?.trim()) {
      alert("Title is required.");
      return;
    }
    const payload = {
      ...form,
      sortOrder: Number(form.sortOrder) || 0,
    };
    setSaving(true);
    try {
      if (editingId) {
        await axios.patch(`${api}/${editingId}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(api, payload, { withCredentials: true });
      }
      setDialogOpen(false);
      await fetchItems();
    } catch (e) {
      console.error(e);
      alert("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this service line?")) return;
    try {
      await axios.delete(`${api}/${id}`, { withCredentials: true });
      await fetchItems();
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    }
  };

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">
          Service page pricing
        </Typography>
        <Button variant="contained" onClick={openNew}>
          Add item
        </Button>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        <strong>Package</strong> = tune-up style blocks with optional bullet list (one line per
        bullet in Description). <strong>Rate</strong> = single row in the rates table. Sort order
        controls display (lower first).
      </Typography>

      {loading ? (
        <Typography>Loading…</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Kind</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.sortOrder}</TableCell>
                <TableCell>{row.kind}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.active ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="Edit" onClick={() => openEdit(row)}>
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="Delete"
                    color="error"
                    onClick={() => remove(row._id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit item" : "New item"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="kind-label">Kind</InputLabel>
              <Select
                labelId="kind-label"
                label="Kind"
                value={form.kind}
                onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
              >
                <MenuItem value="package">Package (tune-up block)</MenuItem>
                <MenuItem value="rate">Rate (table row)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Price (text)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              fullWidth
              placeholder="$100 or $25 - 40"
            />
            <TextField
              label="Description (packages only)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              fullWidth
              multiline
              minRows={form.kind === "package" ? 5 : 2}
              helperText="One bullet per line for packages. Ignored for rate rows."
            />
            <TextField
              label="Sort order"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
              }
              label="Active on public service page"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminServiceListings;
