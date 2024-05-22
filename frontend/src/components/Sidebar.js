import React, { useState, useLayoutEffect } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CategoryForm from './CategoryForm';
import AddEditToDoModal from './AddEditToDoModal';
import { useTodoContext } from '../contexts/TodoContext';

const Sidebar = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    setFilterDate,
    categories,
    isModalOpen,
    modalType,
    handleOpenModal,
    handleCloseModal,
    handleAdd,
  } = useTodoContext();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(isLargeScreen);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleClick = (filter) => () => {
    setSelectedFilter(filter);
    setFilterDate(filter);
    setSelectedCategory(null);
  };

  useLayoutEffect(() => {
    setIsDrawerOpen(isLargeScreen);
  }, [isLargeScreen]);

  const filterLabels = {
    today: 'Today',
    next7days: 'Next 7 days',
    overdue: 'Overdue',
    noduedate: 'No due date',
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer}
        sx={{ mr: 2, display: isLargeScreen ? 'none' : 'block' }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant={isLargeScreen ? 'permanent' : 'temporary'}
        open={isDrawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        <List>
          <Typography variant="poster" sx={{ p: 2 }}>ToDo App</Typography>
          <ListItem>
            <ListItemText primary="Category" />
            <IconButton onClick={() => handleOpenModal('category', null)}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleToggle}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ListItem>
          <Divider />
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {categories.length > 0 ? (
              categories.map((category) => (
                <ListItem
                  button
                  key={category.id}
                  selected={selectedCategory === category.id}
                  onClick={() => {
                    setSelectedFilter(null);
                    setSelectedCategory(category.id);
                    setFilterDate(null);
                  }}
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No categories available" />
              </ListItem>
            )}
          </Collapse>
          <Divider />
          {['today', 'next7days', 'overdue', 'noduedate'].map((filter) => (
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
        <ListItem button onClick={() => handleOpenModal('add', null)}>
          <ListItemText primary="Add ToDo" />
          <AddIcon />
        </ListItem>
      </Drawer>
      <CategoryForm
        isOpen={isModalOpen && modalType === 'category'}
        handleClose={handleCloseModal}
      />
      <AddEditToDoModal
        isOpen={isModalOpen && modalType === 'add'}
        handleClose={handleCloseModal}
        categories={categories}
        onSave={handleAdd}
      />
    </>
  );
};

export default Sidebar;
