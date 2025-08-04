import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DashboardHeader from "../components/HeaderDashboard";
import AddCandidateForm from "../frontend/AddCandidate";
import PartnerFooter from "../components/PartnerFooter";
import { Search } from "lucide-react";
import FilterIcon from "../components/icons/FilterIcon";
import AddIcon from "../components/icons/AddIcon";
import DownloadIcon from "../components/icons/DownloadIcon";
import * as XLSX from 'xlsx';
// import FeedbackModal from "../components/FeedbackModal"; feedback moved to user interview page

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateCount, setCandidateCount] = useState(0); 

  const pageSize = 10;

  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const calculatedNeedResponse = candidates.filter(
    (c) => (c.feedback ?? "Need Review") !== "Sent"
  ).length;

  const mergedStats = [
    ...stats.filter((s) => s.label !== "Need Review"),
    {
      label: "Need Review",
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
      if (Array.isArray(data)) {
        setCandidates(data);
        setCandidateCount(data.length); 
      } else {
        setCandidates([]);
        setCandidateCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
      setCandidates([]);
      setCandidateCount(0);
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  // const handleFeedbackSubmit = async ({ candidateId, hrRating, hrNotes, interviewId }) => {
  //   const candidate = candidates.find(c => c._id === candidateId);
  //   const finalInterviewId = candidate?.interviewId || interviewId;

  //   if (!finalInterviewId) {
  //     toast.error("No interview exists for this candidate.");
  //     return;
  //   }


  //   try {
  //     await axios.put(
  //       `http://localhost:5000/api/dashboard/candidates/${candidateId}/interviews/${finalInterviewId}/review-status`,
  //       {
  //         hrRating: rating,
  //         hrNotes: notes,
  //         hrFeedbackProvided: true,
  //       },
  //       { withCredentials: true }
  //     );

  //     setCandidates(prev =>
  //       prev.map(c =>
  //         c._id === candidateId
  //           ? { ...c, feedback: "Sent", rating, interviewId: finalInterviewId }
  //           : c
  //       )
  //     );

  //     toast.success("Feedback submitted!");
  //     setSelectedCandidate(null);
  //   } catch (error) {
  //     console.error("Error submitting feedback:", error);
  //     toast.error("Failed to submit feedback.");
  //   }
  // };


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

  const handleCandidateAdded = () => {
    fetchCandidates();
    fetchStats();
    setCurrentPage(1);
  };

  const handleDownload = () => {
    try {
      console.log('Starting download with candidates:', candidates.length);
      // Prepare the data for Excel
      const excelData = candidates.map(candidate => ({
        Name: candidate.name || '',
        Email: candidate.email || '',
        Position: candidate.position || '',
        'Applied Date': candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : '-',
        Status: candidate.status || 'Unreviewed',
        'AI Score': candidate.score ?? '-',
        'HR Rating': candidate.rating ?? '0.0',
        'Feedback Status': candidate.feedback ?? 'Need Review'
      }));

      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');

      // Generate the Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `candidates_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Candidates data downloaded successfully!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download candidates data: ' + error.message);
      console.error('Detailed error:', error);
    }
  };

  return (
    <div className="w-full max-w-[1315px] mx-auto">
      <DashboardHeader />
      <br />
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

      <div className="mt-12 bg-white rounded-[40px] border border-[#D9D9D9] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6">
        <h2 className="text-[28px] font-bold text-black mb-6 font-montserrat">Candidates</h2>
   
        {/* <p className="text-gray-600 mb-4">Total Candidates: {candidateCount}</p> */}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <Search className="text-gray-400 w-5 h-5" />
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Candidates"
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600">✕</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-end items-center">
            <button 
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-full border text-[#1976D2] border-[#1976D2] text-sm flex items-center gap-3 hover:bg-[#1565C0] hover:text-white hover:border-[#1565C0] transition-colors min-w-[140px] justify-center"
            >
              <DownloadIcon />
              <span>Download</span>
            </button>
            <button 
              className="px-6 py-2.5 rounded-full bg-[#1976D2] text-white text-sm flex items-center gap-3 hover:bg-[#1565C0] transition-colors min-w-[160px] justify-center" 
              onClick={() => setShowForm(true)}
            >
              <AddIcon />
              <span>Add Candidates</span>
            </button>
            <button className="px-6 py-2.5 rounded-full border text-gray-400 border-gray-300 text-sm flex items-center gap-3 hover:text-gray-600 hover:border-gray-400 transition-colors min-w-[160px] justify-center">
              <FilterIcon />
              <span>Filter Candidates</span>
            </button>
          </div>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative">
                <AddCandidateForm
                  onClose={() => setShowForm(false)}
                  onCandidateAdded={handleCandidateAdded}
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
              <th className="text-left py-3 px-2">Send Email</th>
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
                const feedback = c.feedback ?? "Need Review";
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
                    <td
                      className={`py-3 px-2 font-semibold ${feedbackColor}`}
                      onClick={() => {
                        if (feedback !== "Sent") setSelectedCandidate(c);
                      }}
                    >
                      {feedback}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* {selectedCandidate && (
        <FeedbackModal
          isOpen={true}
          candidate={selectedCandidate}
          interviewId={selectedCandidate.interviewId}
          onClose={() => setSelectedCandidate(null)}
          onSubmit={(data) =>
            handleFeedbackSubmit({
              ...data,
              candidateId: selectedCandidate._id,
              interviewId: data.interviewId || selectedCandidate.interviewId
            })
          }
        />
      )} */}

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
      <PartnerFooter />
    </div>
  );
}