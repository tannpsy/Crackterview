import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./frontend/context/AuthContext.jsx";
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Features from "./pages/Features.jsx";
import Demo from "./pages/Demo.jsx";
import Help from "./pages/Help.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import NotFound from "./pages/NotFound.jsx";
import LandingPage from "./frontend/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GoogleSuccess from "./pages/GoogleSuccess.jsx";
import AddCandidateForm from "./frontend/AddCandidate.jsx";
import InterviewPage from "./pages/VideoInterview.jsx";

const App = () => (
  <BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/help" element={<Help />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/video-interview" element={<InterviewPage /> } />
      <Route path="/add-candidate" element={<AddCandidateForm /> } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AuthProvider>
  </BrowserRouter>
);

export default App;