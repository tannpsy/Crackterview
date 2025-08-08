// src/frontend/Dashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DashboardHeader from "../components/HeaderDashboard";
import AddCandidateForm from "../frontend/AddCandidate";
import FilterCandidate from "../frontend/FilterCandidate";
import EditCandidateForm from "../frontend/EditCandidate";
import PartnerFooter from "../components/PartnerFooter";
import { Search } from "lucide-react";
import FilterIcon from "../components/icons/FilterIcon";
import AddIcon from "../components/icons/AddIcon";
import DownloadIcon from "../components/icons/DownloadIcon";
import * as XLSX from "xlsx";
import { ArrowUpDown, ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidateCount, setCandidateCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [filters, setFilters] = useState({ status: null, feedback: null, startDate: null, endDate: null });
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [sortBy, setSortBy] = useState("appliedDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const pageSize = 5;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(paginatedCandidates.map((c) => c._id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates((prevSelected) => {
      if (prevSelected.includes(candidateId)) {
        return prevSelected.filter((id) => id !== candidateId);
      } else {
        return [...prevSelected, candidateId];
      }
    });
  };

  const handleEditCandidate = (candidate) => {
    setCandidateToEdit(candidate);
    setShowEditForm(true);
    setActiveMenu(null);
  };

  const handleDeleteCandidate = async (candidate) => {
    if (window.confirm(`Are you sure you want to delete candidate ${candidate.name}?`)) {
        try {
            await axios.delete(`/api/dashboard/candidates/${candidate._id}`, { withCredentials: true });
            toast.success(`${candidate.name} has been deleted successfully!`);

            fetchCandidates(); 
            fetchStats(); 

        } catch (error) {
            console.error("Failed to delete candidate:", error);
            toast.error("Failed to delete candidate. Please try again.");
        }
    }
  };

  // Memoize the filtered candidates to avoid re-calculation on every render
  const filteredCandidates = candidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      (candidate.name && candidate.name.toLowerCase().includes(query)) ||
      (candidate.position && candidate.position.toLowerCase().includes(query))
    );
    const matchesStatus = !filters.status || filters.status === "All" || (candidate.status || "Unreviewed") === filters.status;
    const matchesFeedback = !filters.feedback || filters.feedback === "All" || (candidate.sendFeedbackStatus ?? "Need Review") === filters.feedback;
    
    const matchesDate =
    (!filters.startDate || (candidate.appliedDate && new Date(candidate.appliedDate) >= new Date(filters.startDate))) &&
    (!filters.endDate || (candidate.appliedDate && new Date(candidate.appliedDate) < new Date(new Date(filters.endDate).setDate(new Date(filters.endDate).getDate() + 1))));

    return matchesSearch && matchesStatus && matchesFeedback && matchesDate;
  });

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const calculatedNeedResponse = candidates.filter(
    (c) => (c.sendFeedbackStatus ?? "Need Review") !== "Sent"
  ).length;

  const mergedStats = [
    ...stats,
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
      const res = await axios.get("/api/dashboard/stats", { withCredentials: true });
      const data = res.data;
      if (data && typeof data === "object") {
        setStats([
          { label: "Total Applicants", value: data.totalApplicants, color: "text-[#1976D2]" },
          { label: "Total Interviews", value: data.totalInterviews, color: "text-black" },
          { label: "Total Responses", value: data.totalResponses, color: "text-[#4CAF50]" },
          { label: "Need Review", value: data.needReview, color: "text-[#FF3D00]" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchCandidates = useCallback(async () => {
      try {
          setLoadingCandidates(true);
          const res = await axios.get(
              `/api/dashboard/candidates?keyword=${searchQuery}&page=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
              { withCredentials: true }
          );
          const data = res.data?.data;
          if (Array.isArray(data)) {
              setCandidates(data);
              setCandidateCount(res.data.total); 
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
  }, [searchQuery, currentPage, pageSize, sortBy, sortOrder]); 

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setShowForm(false);
      setShowEditForm(false);
      setShowFilterForm(false);
    }
  }, []);

  const handleSort = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    const paginatedIds = paginatedCandidates.map(c => c._id);
    const allOnPageSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedCandidates.includes(id));
    setIsAllSelected(allOnPageSelected);
  }, [selectedCandidates, paginatedCandidates]);

  useEffect(() => {
    if (showForm || showEditForm || showFilterForm) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showForm, showEditForm, showFilterForm, handleKeyDown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest(`.menu-container-${activeMenu}`)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenu]);

  const handleCandidateAdded = () => {
    fetchCandidates();
    fetchStats();
    setCurrentPage(1);
  };

  const handleEditCompleted = () => {
    setShowEditForm(false);
    setCandidateToEdit(null);
    fetchCandidates();
  };

  const handleDownload = () => {
    try {
      const excelData = candidates.map((candidate) => ({
        Name: candidate.name || "",
        Email: candidate.email || "",
        Position: candidate.position || "",
        "Applied Date": candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : "-",
        Status: candidate.status || "Unreviewed",
        "AI Score": candidate.aiScore ?? "-",
        "HR Rating": candidate.hrRating ?? "0.0",
        "Feedback Status": candidate.sendFeedbackStatus ?? "Need Review",
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `candidates_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Candidates data downloaded successfully!");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download candidates data: " + error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setShowFilterForm(false);
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? <ChevronDown size={16} className="rotate-180" /> : <ChevronDown size={16} />;
    }
    return <ArrowUpDown size={16} />;
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <div className="w-full max-w-[1315px] mx-auto min-h-screen bg-white mt-5">
        <br />
        <div className="bg-white rounded-[40px] border border-[#D9D9D9] shadow p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1280px] mx-auto">
            <h1 className="text-[32px] font-bold text-black mb-8 lg:mb-12 font-montserrat">
              Your Stats
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
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

        <div className="mt-12 bg-white rounded-[40px] border border-[#D9D9D9] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6 mb-10">
          <h2 className="text-[28px] font-bold text-black mb-6 font-montserrat">Candidates</h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <Search className="text-gray-400 w-5 h-5" />
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search [Candidate][Position]"
                  className="w-full pl-4 pr-10 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-end items-center">
              <button
                onClick={handleDownload}
                className="px-4 rounded-md mr-5 bg-[#1976D2] text-white text-sm flex items-center gap-3 hover:bg-[#1565C0] transition-colors min-w-[120px] justify-center"
              >
                <DownloadIcon />
                <span>Download</span>
              </button>
              <button
                className="px-4 rounded-md mr-5 bg-[#1976D2] text-white text-sm flex items-center gap-3 hover:bg-[#1565C0] transition-colors min-w-[120px] justify-center"
                onClick={() => setShowForm(true)}
              >
                <AddIcon />
                <span>Add Candidates</span>
              </button>
              <button
                onClick={() => setShowFilterForm(true)}
                className="px-4 rounded-md border text-gray-400 border-gray-300 text-sm flex items-center gap-3 hover:text-gray-600 hover:border-gray-400 transition-colors min-w-[120px] justify-center"
              >
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
            {showFilterForm && (
              <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50">
                <div className="relative mt-[120px] mr-[100px]">
                  <div className="max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl">
                    <FilterCandidate
                      onClose={() => setShowFilterForm(false)}
                      onApplyFilter={handleFilterApply}
                      initialFilters={filters}
                    />
                  </div>
                </div>
              </div>
            )}
            {showEditForm && candidateToEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative">
                  <EditCandidateForm
                    candidateData={candidateToEdit}
                    onClose={() => setShowEditForm(false)}
                    onEditCompleted={handleEditCompleted}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="text-black border-b border-gray-300">
                <tr>
                  <th className="text-left py-3 px-2">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={isAllSelected && paginatedCandidates.length > 0}
                      ref={(input) => {
                        if (input) {
                          const paginatedIds = paginatedCandidates.map((c) => c._id);
                          const someSelected = paginatedIds.some((id) => selectedCandidates.includes(id));
                          const allSelected = paginatedIds.every((id) => selectedCandidates.includes(id));
                          input.indeterminate = someSelected && !allSelected;
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>
                      {getSortIcon("name")}
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="text-left py-3 px-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onClick={() => handleSort("position")}>
                      <span>Position</span>
                      {getSortIcon("position")}
                    </div>
                  </th>
                  <th className="text-left py-3 px-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onClick={() => handleSort("appliedDate")}>
                      <span>Applied Date</span>
                      {getSortIcon("appliedDate")}
                    </div>
                  </th>
                  <th className="text-left py-3 px-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}>
                      <span>Status</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th className="text-left py-3 px-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onClick={() => handleSort("aiScore")}>
                      <span>AI Score</span>
                      {getSortIcon("aiScore")}
                    </div>
                  </th>
                  <th className="text-left py-3 px-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onClick={() => handleSort("hrRating")}>
                      <span>HR Rating</span>
                      {getSortIcon("hrRating")}
                    </div>
                  </th>
                  <th className="text-left py-3 px-2">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700" onClick={() => handleSort("sendFeedbackStatus")}>
                      <span>Send Email</span>
                      {getSortIcon("sendFeedbackStatus")}
                    </div>
                  </th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {loadingCandidates ? (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      Loading candidates...
                    </td>
                  </tr>
                ) : paginatedCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      No candidates found
                    </td>
                  </tr>
                ) : (
                  paginatedCandidates.map((c, i) => {
                    const status = c.status || "Unreviewed";
                    const score = c.aiScore ?? "-";
                    const rating = c.hrRating ?? "0.0";
                    const feedback = c.sendFeedbackStatus ?? "Need Review"; // Changed to match backend field
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
                          <input
                            type="checkbox"
                            checked={selectedCandidates.includes(c._id)}
                            onChange={() => handleSelectCandidate(c._id)}
                          />
                        </td>
                        <td className="py-3 px-2 flex items-center gap-3">
                          <img
                            src={`https://i.pravatar.cc/32?u=${c.name || c.email}`}
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <Link 
                                to={c._id ? `/video-interview/${c._id}` : '#'} 
                                className="font-semibold text-black hover:underline"
                              >
                                {c.name}
                              </Link>
                            <div className="text-xs text-gray-500">{c.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2">{c.position}</td>
                        <td className="py-3 px-2">
                          {c.appliedDate ? new Date(c.appliedDate).toLocaleDateString() : "-"}
                        </td>
                        <td className={`py-3 px-2 font-semibold ${statusColor}`}>{status}</td>
                        <td className="py-3 px-2 font-bold">{score !== "-" ? `${score}/100` : "-"}</td>
                        <td className="py-3 px-2 font-bold">{rating !== "0.0" ? `${rating}/5.0` : "-"}</td>
                        <td
                          className={`py-3 px-2 font-semibold ${feedbackColor}`}
                          onClick={() => {
                            if (feedback !== "Sent") console.log("Set candidate for feedback email: ", c);
                          }}
                        >
                          {feedback}
                        </td>
                        <td className="py-3 px-2 relative">
                          <div
                            className={`menu-container-${c._id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setActiveMenu(activeMenu === c._id ? null : c._id)}
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {activeMenu === c._id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div
                                  className="py-1"
                                  role="menu"
                                  aria-orientation="vertical"
                                  aria-labelledby="options-menu"
                                >
                                  <button
                                    onClick={() => handleEditCandidate(c)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    role="menuitem"
                                  >
                                    <Pencil size={16} />
                                    <span>Edit Candidate</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCandidate(c)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                    role="menuitem"
                                  >
                                    <Trash2 size={16} />
                                    <span>Delete Candidate</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center mt-6 text-sm text-gray-500 space-x-2">
              <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 hover:underline disabled:opacity-50 ${currentPage > 1 ? "font-bold" : "font-normal"}`}
              >
                  ← Previous
              </button>
              <div className="flex gap-1 items-center">
                  {Array.from({ length: Math.ceil(candidateCount / pageSize) }, (_, i) => i + 1)
                      .slice(0, 5) 
                      .map((num) => (
                          <button
                              key={num}
                              onClick={() => setCurrentPage(num)}
                              className={`px-3 py-1 rounded-md ${num === currentPage ? "bg-black text-white" : "hover:bg-gray-200 text-gray-700"}`}
                          >
                              {num}
                          </button>
                      ))}
              </div>
              <button
                  onClick={() =>
                      setCurrentPage((prev) =>
                          Math.min(prev + 1, Math.ceil(candidateCount / pageSize))
                      )
                  }
                  disabled={currentPage * pageSize >= candidateCount}
                  className={`px-3 py-1 hover:underline disabled:opacity-50 ${
                      currentPage * pageSize < candidateCount ? "font-bold" : "font-normal"
                  }`}
              >
                  Next →
              </button>
          </div>
        </div>
        <PartnerFooter />
      </div>
    </div>
  );
}