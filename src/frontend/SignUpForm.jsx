import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.agreeToTerms) {
    toast.error("You must agree to the terms.");
    return;
  }

  if (formData.password !== formData.repeatPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        registerType: "normal",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error("Sign up failed!")
      throw new Error(data.error || "Sign up failed");
    }

    alert("Registration successful!");
    navigate("/");
  } catch (err) {
    alert(err.message);
  }

};

  return (
    <div className="w-full max-w-md bg-white p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-crackterview-black font-poppins text-3xl font-medium mb-2">
          Sign Up
        </h2>
        <p className="text-crackterview-black font-poppins text-base font-medium">
          Get Started Now
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-crackterview-black font-poppins text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="w-full px-3 py-3 border border-crackterview-muted rounded-lg font-poppins text-xs placeholder-crackterview-muted focus:outline-none focus:ring-2 focus:ring-crackterview-blue focus:border-transparent"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-crackterview-black font-poppins text-sm font-medium">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full px-3 py-3 border border-crackterview-muted rounded-lg font-poppins text-xs placeholder-crackterview-muted focus:outline-none focus:ring-2 focus:ring-crackterview-blue focus:border-transparent"
          />
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-crackterview-black font-poppins text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Create your username"
            className="w-full px-3 py-3 border border-crackterview-muted rounded-lg font-poppins text-xs placeholder-crackterview-muted focus:outline-none focus:ring-2 focus:ring-crackterview-blue focus:border-transparent"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-crackterview-black font-poppins text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create your password"
            className="w-full px-3 py-3 border border-crackterview-muted rounded-lg font-poppins text-xs placeholder-crackterview-muted focus:outline-none focus:ring-2 focus:ring-crackterview-blue focus:border-transparent"
          />
        </div>

        {/* Repeat Password Field */}
        <div className="space-y-2">
          <label className="text-crackterview-black font-poppins text-sm font-medium">
            Repeat Password
          </label>
          <input
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleInputChange}
            placeholder="Repeat your password"
            className="w-full px-3 py-3 border border-crackterview-muted rounded-lg font-poppins text-xs placeholder-crackterview-muted focus:outline-none focus:ring-2 focus:ring-crackterview-blue focus:border-transparent"
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="w-3 h-3 border-2 border-crackterview-black rounded-sm"
          />
          <label className="text-crackterview-black font-poppins text-xs font-medium">
            I agree to the{" "}
            <span className="underline">terms & policy</span>
          </label>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full bg-crackterview-black text-white py-3 rounded-lg font-poppins text-sm font-bold hover:bg-gray-800 transition-colors duration-200"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative bg-white px-4">
            <span className="text-gray-400 font-poppins text-xs font-medium">OR</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center space-x-3 py-3 px-5 border border-crackterview-muted rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
              <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
              <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.6055 17.5455 13.3575 18 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
              <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2555 15.1185 16.536 16.083 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
            </svg>
            <span className="text-crackterview-black font-poppins text-xs font-medium">
              Sign in with Google
            </span>
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center pt-4">
          <span className="text-crackterview-black font-poppins text-sm font-medium">
            Have an account?{" "}
          </span>
          <Link 
            to="/" 
            className="text-crackterview-light-blue font-poppins text-sm font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}