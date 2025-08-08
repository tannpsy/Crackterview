import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./frontend/context/AuthContext.jsx"; // HR
import UserProvider from "./usersidefrontend/context/userContext.jsx"; // User

// HR Pages
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Features from "./pages/Features.jsx";
import Demo from "./pages/Demo.jsx";
import Faq from "./pages/Faq.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import NotFound from "./pages/NotFound.jsx";
import LandingPageHR from "./frontend/LandingPage.jsx";
import DashboardHR from "./pages/Dashboard.jsx";
import GoogleSuccess from "./pages/GoogleSuccess.jsx";
import AddCandidateForm from "./frontend/AddCandidate.jsx";
import VideoInterview from "./pages/VideoInterview.jsx";

// User Pages
import LandingPageUser from "./usersidefrontend/pages/landingPage.jsx";
import LoginUser from "./usersidefrontend/pages/auth/login.jsx";
import SignUpUser from "./usersidefrontend/pages/auth/signUp.jsx";
import DashboardUser from "./usersidefrontend/pages/home/dashboard.jsx";
import InterviewPrep from "./usersidefrontend/pages/interviewPrep/interviewPrep.jsx";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* HR Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/google-success" element={<GoogleSuccess />} />
            <Route path="/landing-page" element={<LandingPageHR />} />
            <Route path="/add-candidate" element={<AddCandidateForm />} />
            <Route path="/video-interview" element={<VideoInterview />} />
            <Route path="/video-interview/:interviewId" element={<VideoInterview />} />

            {/* Protected HR Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardHR />
                </ProtectedRoute>
              }
            />

            {/* User-Side Routes */}
            {/* <Route path="/user/login" element={<LoginUser />} />
            <Route path="/user/signup" element={<SignUpUser />} /> */}
            <Route path="/user/dashboard" element={<DashboardUser />} />
            <Route path="/user" element={<LandingPageUser />} />
            <Route path="/user/interview-prep/:sessionId" element={<InterviewPrep />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontSize: "13px",
              },
            }}
          />
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
