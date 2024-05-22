import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTodoContext } from '../contexts/TodoContext';
import { useSnackbar } from '../contexts/SnackBarProvider';

const CategoryForm = ({ isOpen, handleClose }) => {
  const [name, setName] = useState("");
  const { handleAddCategory } = useTodoContext();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleAddCategory(name);
      handleClose();
    } catch (error) {
      showSnackbar("Error adding category", "error");
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{ "& .MuiDialog-paper": { minWidth: "300px" } }}
    >
      <DialogTitle>Add New Category</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="none"
            id="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CategoryForm;
