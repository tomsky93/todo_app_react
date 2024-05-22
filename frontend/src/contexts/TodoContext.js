import React, { createContext, useContext, useState, useCallback} from 'react';
import { useCategories, useCreateCategory } from '../hooks/useCategories';
import { useTodos, useCreateToDo, useUpdateToDo, useDeleteToDo } from '../hooks/useTodos';
import { useSnackbar } from '../contexts/SnackBarProvider';

const TodoContext = createContext();

export const useTodoContext = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const { categories, refetch: refetchCategories } = useCategories();
  const createCategory = useCreateCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { showSnackbar } = useSnackbar();

  const handleAddCategory = useCallback(
    async (categoryName) => {
      await createCategory(categoryName);
      showSnackbar('Category added successfully');
      refetchCategories();
    },
    [createCategory, showSnackbar, refetchCategories]
  );

  const [filterDate, setFilterDate] = useState(null);
  const { todos, refetch } = useTodos(selectedCategory, filterDate);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const createTodo = useCreateToDo();
  const updateTodo = useUpdateToDo();
  const deleteTodo = useDeleteToDo();

  const handleOpenModal = (type, todo) => {
    setModalType(type);
    setCurrentTodo(todo || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTodo(null);
  };

  const handleAdd = useCallback(
    async (newTodo) => {
      await createTodo(newTodo);
      showSnackbar('Todo added successfully');
      refetch();
      handleCloseModal();
    },
    [createTodo, showSnackbar, refetch]
  );

  const handleEdit = useCallback(
    async (updatedTodo) => {
      await updateTodo(updatedTodo);
      showSnackbar('Todo updated successfully');
      refetch();
    },
    [updateTodo, showSnackbar, refetch]
  );

  const handleDelete = useCallback(
    async () => {
      if (currentTodo) {
        await deleteTodo(currentTodo.id);
        showSnackbar('Todo deleted successfully');
        refetch(); 
        handleCloseModal();
      }
    },
    [deleteTodo, currentTodo, showSnackbar, refetch]
  );

  const value = {
    categories,
    selectedCategory,
    setSelectedCategory,
    handleAddCategory,
    filterDate,
    setFilterDate,
    todos,
    currentTodo,
    isModalOpen,
    modalType,
    handleOpenModal,
    handleCloseModal,
    handleAdd,
    handleEdit,
    handleDelete,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
