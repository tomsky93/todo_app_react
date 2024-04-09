import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ToDoList from "./components/ToDoList";
import Sidebar from "./components/Sidebar";
import AddEditToDoModal from "./components/AddEditToDoModal";
import { Box, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "./components/SnackBarProvider";

axios.defaults.baseURL = "http://localhost:8000/";

function App() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const theme = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#fafafa",
            width: 240,
            boxSizing: "border-box",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "rgba(140, 206, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(140, 206, 255, 0.8)",
              },
            },
          },
        },
      },
    },
    typography: {
      poster: {
        fontSize: 25,
        color: "navy",
        marginBottom: 55,
        marginLeft: 10,
        fontWeight: "700",
      },
    },
  });
  const handleOpenEditModal = (todo) => {
    setCurrentTodo(todo);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentTodo(null);
  };
  const fetchTodos = async (filterDate) => {
    try {
      let url = "api/todos/";
      if (filterDate) {
        url += `?due_date=${filterDate}`;
      }
      fetchCategories();
      const response = await axios.get(url);
      setTodos(response.data);
    } catch (error) {
      console.error("Could not fetch todos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Could not fetch categories:", error);
    }
  };

  const handleCategoryAdded = async () => {
    await fetchCategories();
  };

  const updateToDo = async (updatedToDo) => {
    try {
      const response = await axios.put(
        `api/todos/${updatedToDo.id}/`,
        updatedToDo
      );
      setTodos(
        todos.map((todo) => (todo.id === updatedToDo.id ? response.data : todo))
      );
    } catch (error) {
      console.error("Could not update todo:", error);
    }
  };

  const deleteToDo = async (id) => {
    try {
      await axios.delete(`api/todos/${id}/`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Could not delete todo:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("/api/categories/");
      setCategories(response.data);
    };

    const fetchTodos = async () => {
      if (selectedCategory) {
        const response = await axios.get(
          `/api/todos/?category=${selectedCategory}`
        );
        setSelectedCategory(null);
        setTodos(response.data);
      }
    };

    fetchCategories();
    fetchTodos();
  }, [selectedCategory]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Router>
          <Sidebar
            categories={categories}
            onSelectCategory={setSelectedCategory}
            onOpenModal={setIsModalOpen}
            onAddToDo={fetchTodos}
            handleCategoryAdded={handleCategoryAdded}
            fetchTodos={fetchTodos}
          />
          <Container component="main" maxWidth="lg" />
          <Box sx={{ mt: 3 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <ToDoList
                      todos={todos}
                      updateToDo={updateToDo}
                      deleteToDo={deleteToDo}
                      onEdit={handleOpenEditModal}
                    />
                    <AddEditToDoModal
                      isOpen={editModalOpen}
                      handleClose={handleCloseEditModal}
                      handleEdit={updateToDo}
                      categories={categories}
                      todo={currentTodo}
                      onSelectCategory={setSelectedCategory}
                      onAddToDo={fetchTodos}
                    />
                  </>
                }
              />
            </Routes>
          </Box>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
