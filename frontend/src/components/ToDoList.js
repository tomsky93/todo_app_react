import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Checkbox,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { useTodoContext } from '../contexts/TodoContext';
import AddEditToDoModal from './AddEditToDoModal';

const ToDoList = () => {
  const {
    todos,
    isModalOpen,
    modalType,
    currentTodo,
    handleOpenModal,
    handleCloseModal,
    handleDelete,
    handleEdit,
    categories,
  } = useTodoContext();
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd-MM-yyyy");
  };

  const renderListItem = (todo) => {
    if (!todo) return null;

    return (
      <ListItem
        key={todo.id}
        secondaryAction={
          <>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => handleOpenModal('edit', todo)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleOpenModal('delete', todo)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
        disablePadding
        sx={{
          "&:hover": {
            backgroundColor: "action.hover",
          },
          ".MuiListItemText-secondary": {
            maxWidth: "calc(100% - 60px)",
            whiteSpace: "normal",
            wordBreak: "break-word",
          },
        }}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={todo.completed}
            onChange={() => handleEdit({ ...todo, completed: !todo.completed })}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText
          primary={todo.title}
          secondary={`${todo.due_date ? formatDate(todo.due_date) : ""} ${todo.description}`}
          sx={{
            "& .MuiListItemText-primary": {
              textDecoration: todo.completed ? "line-through" : "none",
              textUnderlineOffset: "3px",
              transition: "text-decoration 0.3s ease",
            },
            "& .MuiListItemText-secondary": {
              textDecoration: todo.completed ? "line-through" : "none",
              display: "block",
            },
          }}
        />
      </ListItem>
    );
  };

  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const completedTodosExist = completedTodos.length > 0;

  return (
    <div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <List
          sx={{
            width: "100%",
            maxWidth: 600,
            bgcolor: "background.paper",
            margin: "10px",
          }}
        >
          {incompleteTodos.map(renderListItem)}
        </List>
      </Box>
      {completedTodosExist && showCompleted && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <List
            sx={{
              width: "100%",
              maxWidth: 600,
              bgcolor: "background.paper",
              margin: "10px",
            }}
          >
            {completedTodos.map(renderListItem)}
          </List>
        </Box>
      )}
      {completedTodosExist && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            onClick={toggleShowCompleted}
            variant="outlined"
            color="primary"
          >
            {showCompleted ? "Hide completed" : "Show completed"}
          </Button>
        </Box>
      )}
      <AddEditToDoModal
        isOpen={isModalOpen && modalType === 'edit'}
        handleClose={handleCloseModal}
        categories={categories}
        todo={currentTodo}
      />
      <Dialog open={isModalOpen && modalType === 'delete'} onClose={handleCloseModal}>
        <DialogTitle>{'Delete confirmation'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant='outlined' color='error' onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ToDoList;
