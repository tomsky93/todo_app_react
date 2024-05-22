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
import { useSnackbar } from "../contexts/SnackBarProvider";
import { useTodoContext } from '../contexts/TodoContext';

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

const AddEditToDoModal = ({ isOpen, handleClose, categories, todo}) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();
  const { handleAdd, handleEdit } = useTodoContext();

  useEffect(() => {
    if (isOpen && todo) {
      setFormData({
        title: todo.title || "",
        description: todo.description || "",
        category: todo.category || "",
        due_date: todo.due_date ? dayjs(todo.due_date) : null,
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
    setErrors({});
  }, [isOpen, todo]);

  const handleFieldChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    if (field === 'title') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: !value.trim() ? ERROR_MESSAGES[field] : "",
      }));
    } else if (field === 'category') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: !value ? ERROR_MESSAGES[field] : "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = ERROR_MESSAGES.title;
    }
    if (!formData.category) {
      newErrors.category = ERROR_MESSAGES.category;
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showSnackbar(
        "Validation failed. Please check your input and try again.",
        "error"
      );
      return;
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
      } 
      else {
      handleAdd({ ...formData, due_date: formattedDate, completed: false });
       }

    setFormData(DEFAULT_FORM_DATA);
    handleClose();
  };

  const handleCancel = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
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
          error={Boolean(errors.title)}
          helperText={errors.title}
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
            error={Boolean(errors.category)}
            name="category"
            value={formData.category}
            label="Category"
            onChange={(e) => handleFieldChange("category", e.target.value)}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <FormHelperText error>{errors.category}</FormHelperText>
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditToDoModal;
