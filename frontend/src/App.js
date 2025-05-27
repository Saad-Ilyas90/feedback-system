import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { theme } from './theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
          <Navbar />
          <Container sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<FeedbackForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/feedbacks" element={<FeedbackList />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
