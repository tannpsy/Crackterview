export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/user/api/auth/register", // Signup
    LOGIN: "/user/api/auth/login",       // Authenticate user & return JWT token
    GET_PROFILE: "/user/api/auth/profile", // Get logged-in user details
  }, 
  IMAGE: {
    UPLOAD_IMAGE: "/user/api/auth/upload-image", // Upload profile picture
  },

  AI: {
    GENERATE_QUESTIONS: "/user/api/ai/generate-questions", // Generate interview questions and answers using Gemini
    GENERATE_EXPLANATION: "/user/api/ai/generate-explanation", // Generate concept explanation using Gemini
  },
  
  SESSION: {
    CREATE: "/user/api/sessions/create", // Create a new interview session with questions
    GET_ALL: "/user/api/sessions/my-sessions", // Get all user sessions
    GET_ONE: (id) => `/user/api/sessions/${id}`, // Get session details with questions
    DELETE: (id) => `/user/api/sessions/${id}`,  // Delete a session
  },
  QUESTION: {
    ADD_TO_SESSION: "/user/api/questions/add", // Add more questions to a session
    PIN: (id) => `/user/api/questions/${id}/pin`, // Pin or Unpin a question
    UPDATE_NOTE: (id) => `/user/api/questions/${id}/note`, // Update/Add a note to a question
  },
};
