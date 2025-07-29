import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AddCandidateForm from "./frontend/AddCandidate.jsx";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<LandingPage />} />
      <Route path="/features" element={<Features />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/help" element={<Help />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard /> } />
      <Route path="/add-candidate" element={<AddCandidateForm /> } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
