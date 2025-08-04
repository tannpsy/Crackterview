import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function EditCandidateForm({ onClose, candidateData, onEditCompleted }) {
  const [formData, setFormData] = useState({
    name: candidateData?.name || "",
    email: candidateData?.email || "",
    position: candidateData?.position || "",
    interviewType: candidateData?.interviewType || "",
    phoneNumber: candidateData?.phoneNumber || "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
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
    payload.append("phoneNumber", formData.phoneNumber);

    if (formData.file) {
      payload.append("recording", formData.file);
    }
    
    try {
      await axios.put(`/api/dashboard/candidates/${candidateData._id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      onEditCompleted();
      
      toast.success(`${formData.name} updated successfully!`);

      onClose();
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast.error(error.message || "Failed to update candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 w-[400px] rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Edit Candidate</h2>
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

        {/* Phone Number */}
        <input
          type="number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
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
          <label className="text-sm font-semibold text-black mb-1">
            Upload New Video/Audio (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl py-14 px-6 text-center text-sm text-gray-600 cursor-pointer">
            <input
              type="file"
              name="file"
              accept="audio/*,video/*"
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
            Click to browse or <br /> drag and drop new files
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
            {loading ? "Updating..." : "Update Candidate"}
          </button>
        </div>
      </form>
    </div>
  );
}
