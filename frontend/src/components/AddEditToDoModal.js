import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSnackbar } from "./SnackBarProvider";

const DEFAULT_FORM_DATA = {
  title: "",
  description: "",
  category: "",
  due_date: null,
};

const ERROR_MESSAGES = {
  title: "Title is required",
  category: "Category is required",
};

const AddToDoModal = ({
  isOpen,
  handleClose,
  handleAdd,
  handleEdit,
  categories,
  todo,
}) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || "",
        description: todo.description || "",
        category: todo.category || "",
        due_date: todo.due_date ? dayjs(todo.due_date) : null,
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
    setSubmitted(false);
  }, [isOpen, todo]);

  const handleFieldChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validate = () => {
    const errors = {
      title: !formData.title.trim(),
      category: !formData.category,
    };
    return errors;
  };

  const getErrorMessage = (fieldName) => {
    return submitted && validate()[fieldName] ? ERROR_MESSAGES[fieldName] : "";
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    try {
      const errors = validate();
      if (errors.title || errors.category) {
        throw new Error("Validation failed");
      }
      const formattedDate = formData.due_date
        ? dayjs(formData.due_date).format("YYYY-MM-DD")
        : null;

      if (todo) {
        handleEdit({
          ...formData,
          id: todo.id,
          due_date: formattedDate,
          completed: todo.completed,
        });
        showSnackbar("ToDo updated successfully.", "success");
      } else {
        handleAdd({ ...formData, due_date: formattedDate, completed: false });
        showSnackbar("ToDo added successfully.", "success");
      }

      setFormData(DEFAULT_FORM_DATA);
      handleClose();
    } catch (error) {
      if (error.message === "Validation failed") {
        showSnackbar(
          "Validation failed. Please check your input and try again.",
          "error"
        );
      } else {
        showSnackbar("Something went wrong. Please try again.", "error");
      }
    }
  };

  const handleCancel = () => {
    setFormData(DEFAULT_FORM_DATA);
    setSubmitted(false);
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{ "& .MuiDialog-paper": { maxWidth: "400px" } }}
    >
      <DialogContent>
        <TextField
          label="Title"
          error={submitted && validate().title}
          helperText={getErrorMessage("title")}
          name="title"
          variant="outlined"
          value={formData.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          fullWidth
          sx={{ mb: 2, mt: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          variant="outlined"
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel id="category-select-label" sx={{ mb: 2 }}>
            Category
          </InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            error={submitted && validate().category}
            name="category"
            value={formData.category}
            label="Category"
            onChange={(e) => handleFieldChange("category", e.target.value)}
            sx={{ borderColor: submitted && validate().category ? "red" : "" }}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {submitted && validate().category && (
            <FormHelperText error>{getErrorMessage("category")}</FormHelperText>
          )}
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            id="due_date"
            name="due_date"
            label="Due Date"
            format="DD-MM-YYYY"
            inputFormat="DD-MM-YYYY"
            variant="inline"
            value={formData.due_date}
            onChange={(date) => handleFieldChange("due_date", date)}
            TextFieldComponent={(props) => <TextField {...props} />}
            fullWidth
            sx={{ mb: 2, mt: 2, width: "100%" }}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {todo ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddToDoModal;
