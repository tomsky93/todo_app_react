import React, { useState, useLayoutEffect } from "react";
import {
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CategoryForm from "./CategoryForm";
import AddEditToDoModal from "./AddEditToDoModal";
import axios from "axios";

const Sidebar = ({
  categories,
  onAddToDo,
  onSelectCategory,
  selectedCategory,
  handleCategoryAdded,
  fetchTodos,
  currentTodo,
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isToDoModalOpen, setIsToDoModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleToggle = () => setIsExpanded(!isExpanded);
  const openCategoryModal = () => setIsCategoryModalOpen(true);
  const closeCategoryModal = () => setIsCategoryModalOpen(false);
  const openToDoModal = () => setIsToDoModalOpen(true);
  const closeToDoModal = () => setIsToDoModalOpen(false);
  const handleClick = (filter) => () => {
    setSelectedFilter(filter);
    fetchTodos(filter, null);
  };

  useLayoutEffect(() => {
    setIsDrawerOpen(isLargeScreen);
  }, [isLargeScreen]);

  const handleAddToDo = async (newToDo) => {
    try {
      const response = await axios.post("api/todos/", newToDo);
      onSelectCategory(response.data.categoryId);
      onAddToDo(onSelectCategory(response.data.category));
      console.log(
        "Selected category:",
        onSelectCategory(response.data.category)
      );
    } catch (error) {
      console.error("Could not add todo:", error);
    }
  };

  const filterLabels = {
    today: "Today",
    next7days: "Next 7 days",
    overdue: "Overdue",
    noduedate: "No due date",
  };

  
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer}
        sx={{ mr: 2, display: isLargeScreen ? "none" : "block" }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant={isLargeScreen ? "permanent" : "temporary"}
        open={isDrawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        <List>
          <Typography variant="poster">ToDo App</Typography>

          <ListItem>
            <ListItemText primary="Category" />
            <IconButton onClick={openCategoryModal}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleToggle}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ListItem>
          <Divider />
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {categories.map((category) => (
              <ListItem
                button
                key={category.id}
                selected={selectedFilter === category.id}
                onClick={() => {
                  setSelectedFilter(category.id);
                  onSelectCategory(category.id);
                }}
              >
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </Collapse>
          <Divider />

          {["today", "next7days", "overdue", "noduedate"].map((filter) => (
            <ListItem
              button
              key={filter}
              selected={selectedFilter === filter}
              onClick={handleClick(filter)}
            >
              <ListItemText primary={filterLabels[filter]} />
            </ListItem>
          ))}
        </List>
        <ListItem button onClick={openToDoModal}>
          <ListItemText primary="Add ToDo" />
          <AddIcon />
        </ListItem>
      </Drawer>
      <CategoryForm
        isModalOpen={isCategoryModalOpen}
        handleCloseModal={() => {
          closeCategoryModal();
          handleCategoryAdded();
        }}
      />
      <AddEditToDoModal
        isOpen={isToDoModalOpen}
        handleClose={closeToDoModal}
        handleAdd={handleAddToDo}
        categories={categories}
        selectedCategory={selectedCategory}
        todo={currentTodo}
      />
    </>
  );
};

export default Sidebar;
