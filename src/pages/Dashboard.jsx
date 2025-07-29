import React, { useEffect, useState, useCallback } from "react";
import DashboardHeader from "../components/HeaderDashboard";
import AddCandidateForm from "../frontend/AddCandidate";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Fetch dashboard stats
  useEffect(() => {
    fetch("/api/dashboard/stats", { credentials: "include" })
      .then((res) => res.json())
      .then((data) =>
        setStats([
          { label: "Total Applicants", value: data.totalApplicants, color: "text-[#1976D2]" },
          { label: "Total Interviews", value: data.totalInterviews, color: "text-black" },
          { label: "Total Responses", value: data.totalResponses, color: "text-[#4CAF50]" },
          { label: "Need Response", value: data.needResponse, color: "text-[#FF3D00]" },
        ])
      )
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("/api/dashboard/candidates", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoadingCandidates(false);
      }
    };
    fetchCandidates();
  }, []);

  // Close modal with ESC key
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setShowForm(false);
  }, []);

  useEffect(() => {
    if (showForm) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showForm, handleKeyDown]);

  return (
    <div className="w-full max-w-[1315px] mx-auto relative">
      <DashboardHeader />
      <br />

      {/* ==== STATS SECTION ==== */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==== CANDIDATES TABLE ==== */}
      <div className="mt-12 bg-white rounded-[40px] border border-[#D9D9D9] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[28px] font-bold text-black font-montserrat">Candidates</h2>
          <button
            className="px-4 py-2 rounded-full bg-[#1976D2] text-white text-sm"
            onClick={() => setShowForm(true)}
          >
            Add Candidate
          </button>
        </div>

        {loadingCandidates ? (
          <p className="text-center text-gray-500">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="text-center text-gray-500">No candidates found</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Position</th>
                <th className="p-3">Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="border-b">
                  <td className="p-3">{c.username}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.position}</td>
                  <td className="p-3">{c.appliedDate || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ==== MODAL OVERLAY ==== */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn"
          onClick={() => setShowForm(false)}
        >
          <div
            className="animate-scaleIn"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <AddCandidateForm
              onClose={() => setShowForm(false)}
              onCandidateAdded={(newCandidate) =>
                setCandidates((prev) => [...prev, newCandidate])
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
