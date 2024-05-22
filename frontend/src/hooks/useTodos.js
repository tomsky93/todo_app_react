import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

const useTodos = (selectedCategory, filterDate) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndSetTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.fetchTodos(selectedCategory, filterDate);
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, filterDate]);

  useEffect(() => {
    fetchAndSetTodos();
  }, [fetchAndSetTodos]);

  return {
    todos,
    loading,
    error,
    refetch: fetchAndSetTodos,
  };
};

export { useTodos };

export const useCreateToDo = () => {
  const createToDo = async (newToDo) => {
    const data = await api.createToDo(newToDo);
    return data;
  };

  return createToDo;
}

export const useUpdateToDo = () => {
  const updateToDo = async (updatedToDo) => {
    const data = await api.updateToDo(updatedToDo);
    return data;
  };

  return updateToDo;
}

export const useDeleteToDo = () => {
  const deleteToDo = async (id) => {
    await api.deleteToDo(id);
  };

  return deleteToDo;
}

