import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { SnackbarProvider } from './contexts/SnackBarProvider'; 
import { TodoProvider } from './contexts/TodoContext'; 
import ToDoList from './components/ToDoList';
import Sidebar from './components/Sidebar';

function App() {
  
  const theme = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#fafafa',
            width: 240,
            boxSizing: 'border-box',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: 'rgba(140, 206, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(140, 206, 255, 0.8)',
              },
            },
          },
        },
      },
    },
    typography: {
      poster: {
        fontSize: 25,
        color: 'navy',
        marginBottom: 55,
        marginLeft: 10,
        fontWeight: '700',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <TodoProvider>
          <Router>
            <Sidebar />
            <Container component="main" maxWidth="lg" />
            <Box sx={{ mt: 3 }}>
              <Routes>
                <Route path="/" element={<ToDoList />} />
              </Routes>
            </Box>
          </Router>
        </TodoProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
