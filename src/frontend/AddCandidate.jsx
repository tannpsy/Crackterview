import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function AddCandidateForm({ onClose, onCandidateAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    interviewType: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("position", formData.position);
    payload.append("interviewType", formData.interviewType);
    payload.append("recording", formData.file);

    try {
      const res = await fetch("/api/dashboard/candidates", {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create candidate");

      const newCandidate = data.candidate || data; 

      onCandidateAdded();


      toast.success(`Candidate added successfully!`);

      onClose();
    } catch (error) {
      console.error("Error creating candidate:", error);
      toast.error(error.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 w-[400px] rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Add New Candidate</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">
          ✕
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Candidate Name"
          required
          className="border border-gray-300 rounded-lg px-3 py-2"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="border border-gray-300 rounded-lg px-3 py-2"
        />

        {/* Position */}
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Position Applied"
          required
          className="border border-gray-300 rounded-lg px-3 py-2"
        />

        {/* Interview Type */}
        <select
          name="interviewType"
          value={formData.interviewType}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select Interview Type</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>

        {/* File Upload */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black mb-1">Upload Video/Audio</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl py-14 px-6 text-center text-sm text-gray-600 cursor-pointer">
            <input
              type="file"
              name="file"
              accept="audio/*,video/*"
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            Click to browse or <br /> drag and drop your files
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            className="border border-gray-400 text-gray-500 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1976D2] text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add Candidate"}
          </button>
        </div>
      </form>
    </div>
  );
}