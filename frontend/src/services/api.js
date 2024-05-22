import axios from 'axios';
const baseURL = 'http://localhost:8000/api';

const fetchCategories = async () => {
        const response = await axios.get(`${baseURL}/categories/`);
        return response.data;
    };

const createCategory = async (categoryName) => {
    try {
        const response = await axios.post(`${baseURL}/categories/`, { name: categoryName });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const fetchTodos = async (selectedCategory, filterDate) => {
        
        if (selectedCategory) {
            const response = await axios.get(`${baseURL}/todos/?category=${selectedCategory}`);
            return response.data;
        }
        if (filterDate) {
            const response = await axios.get(`${baseURL}/todos/?due_date=${filterDate}`);
            return response.data;
        }
        else {
            const response = await axios.get(`${baseURL}/todos/`);
            return response.data;
        }
}

const createToDo = async (newToDo) => {
    try {
        const response = await axios.post(`${baseURL}/todos/`, newToDo);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const updateToDo = async (updatedToDo) => {
    try {
        const response = await axios.put(`${baseURL}/todos/${updatedToDo.id}/`, updatedToDo);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const deleteToDo = async (deleteTodo) => {
    try {
        await axios.delete(`${baseURL}/todos/${deleteTodo}/`);
    } catch (error) {
        console.error(error);
    }
}

const api = { fetchCategories, createCategory, fetchTodos, createToDo, updateToDo, deleteToDo };

export default api;


