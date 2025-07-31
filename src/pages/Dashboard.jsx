import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DashboardHeader from "../components/HeaderDashboard";
import AddCandidateForm from "../frontend/AddCandidate";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const calculatedNeedResponse = candidates.filter(
    (c) => (c.feedback ?? "Send Feedback") !== "Sent"
  ).length;

  const mergedStats = [
    ...stats.filter((s) => s.label !== "Need Response"),
    {
      label: "Need Response",
      value: calculatedNeedResponse,
      color: "text-[#FF3D00]",
    },
  ];

  const STAT_STYLE = {
    fontFamily: "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
  };

  const VALUE_STYLE = {
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats", { credentials: "include" });
      const data = await res.json();
      if (data && typeof data === "object") {
        setStats([
          { label: "Total Applicants", value: data.totalApplicants, color: "text-[#1976D2]" },
          { label: "Total Interviews", value: data.totalInterviews, color: "text-black" },
          { label: "Total Responses", value: data.totalResponses, color: "text-[#4CAF50]" },
          // "Need Response" will be calculated dynamically below
        ]);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchCandidates = useCallback(async () => {
    try {
      const res = await axios.get("/api/dashboard/candidates", { withCredentials: true });
      const data = res.data?.data;
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setShowForm(false);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    if (showForm) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showForm, handleKeyDown]);

  const handleCandidateAdded = (newCandidate) => {
    setCandidates((prev) => [...prev, newCandidate]);
    setCurrentPage(1); // Reset to page 1 after add
  };

  return (
    <div className="w-full max-w-[1315px] mx-auto">
      <DashboardHeader />
      <br />

      {/* Stats Section */}
      <div className="bg-white rounded-[40px] border border-[#D9D9D9] shadow p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-[32px] font-bold text-black mb-8 lg:mb-12 font-montserrat">
            Your Stats
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {mergedStats.map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="text-[20px] font-bold text-[#979797] mb-4" style={STAT_STYLE}>
                  {stat.label}
                </div>
                <div className={`${stat.color} text-[40px] font-bold`} style={VALUE_STYLE}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="text-gray-500 border-b border-gray-300">
            <tr>
              <th className="text-left py-3 px-2">
                <input type="checkbox" />
              </th>
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Position</th>
              <th className="text-left py-3 px-2">Applied Date</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">AI Score</th>
              <th className="text-left py-3 px-2">HR Rating</th>
              <th className="text-left py-3 px-2">Send Feedback</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loadingCandidates ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Loading candidates...
                </td>
              </tr>
            ) : paginatedCandidates.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No candidates found
                </td>
              </tr>
            ) : (
              paginatedCandidates.map((c, i) => {
                const status = c.status || "Unreviewed";
                const score = c.score ?? Math.floor(Math.random() * 40) + 60;
                const rating = c.rating ?? "0.0";
                const feedback = c.feedback ?? "Send Feedback";
                const statusColor = status === "Reviewed" ? "text-green-600" : "text-red-500";
                const feedbackColor =
                  feedback === "Sent"
                    ? "text-green-600"
                    : feedback === "Need Review"
                    ? "text-red-500"
                    : "text-blue-600 underline cursor-pointer";

                return (
                  <tr key={c._id || i} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <input type="checkbox" />
                    </td>
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/32?u=${c.name || c.email}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-black">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2">{c.position}</td>
                    <td className="py-3 px-2">
                      {c.appliedDate ? new Date(c.appliedDate).toLocaleDateString() : "-"}
                    </td>
                    <td className={`py-3 px-2 font-semibold ${statusColor}`}>{status}</td>
                    <td className="py-3 px-2 font-bold">{score}/100</td>
                    <td className="py-3 px-2 font-bold">{rating}/5.0</td>
                    <td className={`py-3 px-2 font-semibold ${feedbackColor}`}>{feedback}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn"
          onClick={() => setShowForm(false)}
        >
          <div className="animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <AddCandidateForm onClose={() => setShowForm(false)} onCandidateAdded={handleCandidateAdded} />
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="hover:underline disabled:opacity-50"
        >
          ← Previous
        </button>
        <div className="flex gap-2 items-center">
          {Array.from({ length: Math.ceil(candidates.length / pageSize) }, (_, i) => i + 1)
            .slice(0, 5)
            .map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-full ${
                  num === currentPage ? "bg-black text-white" : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
        </div>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(candidates.length / pageSize)))
          }
          disabled={currentPage * pageSize >= candidates.length}
          className="hover:underline disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
