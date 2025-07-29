import React, { useState } from "react";

export default function AddCandidateForm({ onClose, onCandidateAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    appliedDate: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("position", formData.position);
      if (formData.appliedDate) fd.append("appliedDate", formData.appliedDate);
      if (formData.file) fd.append("file", formData.file);

      const res = await fetch("/api/dashboard/candidates", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create candidate");
      const data = await res.json();

      if (onCandidateAdded) onCandidateAdded(data.candidate);
      onClose();
    } catch (err) {
      console.error("Error creating candidate:", err);
      alert("Failed to add candidate");
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

        {/* Applied Date */}
        <input
          type="date"
          name="appliedDate"
          value={formData.appliedDate}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />

        {/* File Upload */}
               <div className="flex flex-col">
                    <label className="text-sm font-semibold text-black mb-1">Upload Video/Audio</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl py-14 px-6 text-center text-sm text-gray-600 cursor-pointer">
                    <input
                        type="file"
                        name="file"
                        onChange={handleChange}
                        className="border p-2 rounded-lg"
                        />Click to browse or <br /> drag and drop your files
                    </div>
                </div>

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
