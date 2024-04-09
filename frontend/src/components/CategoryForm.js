import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "./SnackBarProvider";

const CategoryForm = ({ isModalOpen, handleCloseModal }) => {
  const [name, setName] = useState("");
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/api/categories/", { name });
      setName("");
      handleCloseModal();
      showSnackbar("Category added successfully.", "success");
    } catch (error) {
      console.error(error);
      handleCloseModal();
      showSnackbar("Error occurred while adding category.", "error");
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleCloseModal}
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
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;
