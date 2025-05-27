import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Feedback-related API calls
export const submitFeedback = async (feedbackData) => {
  const response = await axios.post(`${API_URL}/feedback`, feedbackData);
  return response.data;
};

export const getAllFeedbacks = async (page = 1, limit = 6) => {
  const response = await axios.get(`${API_URL}/feedbacks?page=${page}&limit=${limit}`);
  return response.data;
};

export const getFeedbacksBySubject = async (subject, page = 1, limit = 6) => {
  const response = await axios.get(`${API_URL}/feedbacks/${subject}?page=${page}&limit=${limit}`);
  return response.data;
};

// Course-related API calls
export const getAllCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

export const initializeCourses = async () => {
  const response = await axios.post(`${API_URL}/init-courses`);
  return response.data;
};
