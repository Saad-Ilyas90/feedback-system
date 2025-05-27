import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { getAllFeedbacks, getFeedbacksBySubject } from '../services/api';

const FeedbackList = () => {
  // Mock authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication
    const checkAuth = async () => {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo purposes, we'll set authentication to true
      // In a real app, this would check with your auth service
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    checkAuth();
  }, []);
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getAllFeedbacks(pageNum);
      setFeedbacks(data.feedbacks);
      setTotalPages(data.totalPages);
      setLoading(false);
      // Extract unique subjects
      const uniqueSubjects = [...new Set(data.feedbacks.map(feedback => feedback.subject))];
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleSubjectChange = async (event) => {
    setPage(1);
    const subject = event.target.value;
    setSelectedSubject(subject);
    try {
      setLoading(true);
      const data = subject
        ? await getFeedbacksBySubject(subject, 1)
        : await getAllFeedbacks(1);
      setFeedbacks(data.feedbacks);
      setTotalPages(data.totalPages);
      setLoading(false);
      
      // Calculate average rating
      const avg = data.feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / data.feedbacks.length;
      setAverageRating(avg || 0);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    if (selectedSubject) {
      getFeedbacksBySubject(selectedSubject, value);
    } else {
      fetchFeedbacks(value);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Feedback Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Review and analyze student feedback
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControl sx={{ minWidth: 300 }}>
        <InputLabel>Filter by Subject</InputLabel>
        <Select
          value={selectedSubject}
          label="Filter by Subject"
          onChange={handleSubjectChange}
        >
          <MenuItem value="">
            <em>All Subjects</em>
          </MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      </Box>

      {selectedSubject && (
        <Box sx={{ mb: 4, textAlign: 'center', p: 3, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
          <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
            Average Rating for {selectedSubject}:{' '}
            <Rating 
              value={averageRating} 
              precision={0.1} 
              readOnly 
              size="large"
              sx={{ 
                mt: 1,
                '& .MuiRating-iconFilled': {
                  color: 'white',
                },
              }}
            />
            {' '}({averageRating.toFixed(1)})
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {feedbacks.map((feedback) => (
          <Grid item xs={12} sm={6} md={4} key={feedback._id}>
            <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
            },
          }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  {feedback.studentName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Subject: {feedback.subject}
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Rating 
                    value={feedback.rating} 
                    readOnly 
                    sx={{ 
                      '& .MuiRating-iconFilled': {
                        color: 'primary.main',
                      },
                    }}
                  />
                </Box>
                {feedback.comments && (
                  <Typography variant="body2">
                    "{feedback.comments}"
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              },
              '& .Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeedbackList;
