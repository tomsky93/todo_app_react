import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.fetchCategories();
      setCategories(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

export const useCreateCategory = () => {
  const createCategory = useCallback(async (categoryName) => {
    try {
      const response = await api.createCategory(categoryName);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  return createCategory;
};
