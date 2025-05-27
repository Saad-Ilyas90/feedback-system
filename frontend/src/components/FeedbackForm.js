import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Rating, Box, Typography, Alert, MenuItem } from '@mui/material';
import { submitFeedback, getAllCourses, initializeCourses } from '../services/api';

const validationSchema = Yup.object({
  studentName: Yup.string().required('Student name is required'),
  subject: Yup.string().required('Subject is required'),
  rating: Yup.number().required('Rating is required').min(1).max(5),
  comments: Yup.string()
});

const FeedbackForm = () => {
  const [submitStatus, setSubmitStatus] = React.useState({ success: false, error: null });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let coursesData = await getAllCourses();
        if (coursesData.length === 0) {
          // If no courses exist, initialize them
          coursesData = await initializeCourses();
        }
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await submitFeedback(values);
      setSubmitStatus({ success: true, error: null });
      resetForm();
    } catch (error) {
      setSubmitStatus({ success: false, error: error.message });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Submit Feedback
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Share your thoughts about the course
        </Typography>
      </Box>
      
      {submitStatus.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Feedback submitted successfully!
        </Alert>
      )}
      
      {submitStatus.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitStatus.error}
        </Alert>
      )}

      <Formik
        initialValues={{
          studentName: '',
          subject: '',
          rating: 3,
          comments: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <TextField
              fullWidth
              name="studentName"
              label="Student Name"
              value={values.studentName}
              onChange={handleChange}
              error={touched.studentName && Boolean(errors.studentName)}
              helperText={touched.studentName && errors.studentName}
              margin="normal"
            />

            <TextField
              select
              fullWidth
              name="subject"
              label="Subject"
              value={values.subject}
              onChange={handleChange}
              error={touched.subject && Boolean(errors.subject)}
              helperText={touched.subject && errors.subject}
              margin="normal"
            >
              {courses.map((course) => (
                <MenuItem key={course.code} value={course.name}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ my: 3, textAlign: 'center' }}>
              <Typography variant="h6" component="legend" gutterBottom>
                Rate your experience
              </Typography>
              <Rating
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: 'primary.main',
                  },
                  '& .MuiRating-iconHover': {
                    color: 'primary.light',
                  },
                }}
                name="rating"
                value={values.rating}
                onChange={(_, newValue) => {
                  setFieldValue('rating', newValue);
                }}
              />
            </Box>

            <TextField
              fullWidth
              name="comments"
              label="Comments"
              multiline
              rows={4}
              value={values.comments}
              onChange={handleChange}
              error={touched.comments && Boolean(errors.comments)}
              helperText={touched.comments && errors.comments}
              margin="normal"
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px 0 rgba(25,118,210,0.25)',
                  },
                }}
              >
                Submit Feedback
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default FeedbackForm;
