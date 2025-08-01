import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DashboardHeader from "../components/HeaderDashboard";
import AddCandidateForm from "../frontend/AddCandidate";
import PartnerFooter from "../components/PartnerFooter";
// import FeedbackModal from "../components/FeedbackModal"; feedback moved to user interview page

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Email modal state
  const [emailCandidate, setEmailCandidate] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [candidateCount, setCandidateCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const pageSize = 10;

  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ---------- Fetch Stats ----------
  const calculatedNeedResponse = candidates.filter(
    (c) => (c.feedback ?? "Send Feedback") !== "Sent"
  ).length;

    // ✅ Calculate "Need Response" only when candidates or stats change
  const mergedStats = useMemo(() => {
    const needResponseCount = candidates.filter(
      (c) => (c.feedback ?? "Send Feedback") !== "Sent"
    ).length;

    return [
      ...stats.filter((s) => s.label !== "Need Response"),
      {
        label: "Need Response",
        value: needResponseCount,
        color: "text-[#FF3D00]",
      },
    ];
  }, [stats, candidates]);

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


  const STAT_STYLE = {
    fontFamily: "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
  };

  const VALUE_STYLE = {
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
  };

  // ---------- Fetch Candidates ----------
  const fetchCandidates = useCallback(async () => {
    try {
      const res = await axios.get("/api/dashboard/candidates", { withCredentials: true });
      const data = res.data?.data || [];
      setCandidates(data);
      setCandidateCount(data.length);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
      setCandidates([]);
      setCandidateCount(0);
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchCandidates();
  }, [fetchCandidates]);

  // ---------- Add Candidate ----------
  const handleCandidateAdded = (newCandidate) => {
    setCandidates((prev) => [...prev, newCandidate]);
    setCandidateCount((prev) => prev + 1);
    setCurrentPage(1);

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: `Candidate ${newCandidate.name} added for ${newCandidate.position}`,
        time: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  // ---------- Delete Candidates ----------
  const confirmDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`/api/dashboard/candidates/${id}`, { withCredentials: true })
        )
      );
      setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
      setCandidateCount((prev) => prev - selectedIds.length);
      setSelectedIds([]);
      toast.success("Selected candidates deleted!");
    } catch {
      toast.error("Failed to delete some candidates.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // ---------- Select Checkboxes ----------
  const toggleSelectAll = (checked) => {
    const ids = paginatedCandidates.map((c) => c._id);
    setSelectedIds((prev) =>
      checked ? [...new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id))
    );
  };

  const toggleSelectOne = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  // ---------- Email Modal ----------
  const openEmailModal = (candidate) => {
    setBulkMode(false);
    setEmailCandidate(candidate);
    setSubject(`Update on your ${candidate.position} application`);
    setMessage(
      `Hi ${candidate.name},\n\nThis is a follow-up regarding your application for ${candidate.position}.`
    );
    setShowEmailModal(true);
  };

  const openBulkEmailModal = () => {
    setBulkMode(true);
    setSubject("Update on your job application");
    setMessage("Hi, this is a follow-up regarding your recent application. We will update you soon.");
    setShowEmailModal(true);
  };

  const sendEmail = async () => {
    try {
      if (bulkMode) {
        await Promise.all(
          candidates
            .filter((c) => selectedIds.includes(c._id))
            .map((c) =>
              axios.post(
                "http://localhost:5000/api/auth/send-email",
                { to: c.email, subject, text: message },
                { withCredentials: true }
              )
            )
        );
        toast.success("Bulk emails sent!");
      } else if (emailCandidate) {
        await axios.post(
          "/api/auth/send-email",
          { to: emailCandidate.email, subject, text: message },
          { withCredentials: true }
        );
        toast.success(`Email sent to ${emailCandidate.name}`);
      }
    } catch {
      toast.error("Failed to send email(s).");
    } finally {
      setShowEmailModal(false);
    }
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
      <DashboardHeader notifications={notifications} />

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mt-4 mb-4 flex gap-2">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-full"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑 Delete Selected ({selectedIds.length})
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-full"
            onClick={openBulkEmailModal}
          >
            📧 Send Email ({selectedIds.length})
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-4">
              Do you really want to delete {selectedIds.length} selected candidate(s)?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-full"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-3">
              {bulkMode ? "Send Bulk Email" : `Email ${emailCandidate?.name}`}
            </h2>
            <input
              className="w-full border p-2 rounded mb-3"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
            <textarea
              className="w-full border p-2 rounded mb-3"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-full"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-full"
                onClick={sendEmail}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
    <section className="bg-white rounded-[40px] border border-[#D9D9D9] shadow p-4 sm:p-6 lg:p-8 mt-4">
        <h1 className="text-[32px] font-bold text-black mb-8 lg:mb-12 font-montserrat">Your Stats</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {mergedStats.map((stat, index) => (
            <div key={index} className="text-center lg:text-left">
              <div className="text-[20px] font-bold text-[#979797] mb-4">{stat.label}</div>
              <div className={`${stat.color} text-[40px] font-bold`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Candidate Table */}
      <section className="mt-12 bg-white rounded-[40px] border border-[#D9D9D9] shadow p-6">
        <h2 className="text-[28px] font-bold text-black mb-6 font-montserrat">Candidates</h2>
   
        {/* <p className="text-gray-600 mb-4">Total Candidates: {candidateCount}</p> */}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search Candidates"
              className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></span>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">✕</span>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button className="px-4 py-2 rounded-full border text-[#1976D2] border-[#1976D2] text-sm">⬇ Download</button>
            <button className="px-4 py-2 rounded-full border text-gray-500 border-gray-300 text-sm">⬆ Import</button>
            <button className="px-4 py-2 rounded-full bg-[#1976D2] text-white text-sm" onClick={() => setShowForm(true)}>
              ➕ Add Candidates
            </button>
            <button className="px-4 py-2 rounded-full border text-gray-500 border-gray-300 text-sm">🧃 Filter Candidates</button>
          </div>

          {/* Candidate Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <AddCandidateForm
                onCandidateAdded={handleCandidateAdded}
                onClose={() => setShowForm(false)}
              />
            </div>
          )}


        <div className="overflow-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="text-gray-500 border-b border-gray-300">
              <tr>
                <th className="py-3 px-2">
                  <input
                    type="checkbox"
                    checked={
                      paginatedCandidates.length > 0 &&
                      paginatedCandidates.every((c) => selectedIds.includes(c._id))
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="py-3 px-2 text-left">Name</th>
                <th className="py-3 px-2 text-left">Position</th>
                <th className="py-3 px-2 text-left">Applied Date</th>
                <th className="py-3 px-2 text-left">Status</th>
                <th className="py-3 px-2 text-left">AI Score</th>
                <th className="py-3 px-2 text-left">HR Rating</th>
                <th className="py-3 px-2 text-left">Send Email</th>
              </tr>
            </thead>
            <tbody>
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
                paginatedCandidates.map((c) => (
                  <tr key={c._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c._id)}
                        onChange={(e) => toggleSelectOne(c._id, e.target.checked)}
                      />
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
                    <td
                      className={`py-3 px-2 font-semibold ${
                        c.status === "Reviewed" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {c.status || "Unreviewed"}
                    </td>
                    <td className="py-3 px-2 font-bold">
                      {(c.score ?? Math.floor(Math.random() * 40) + 60)}/100
                    </td>
                    <td className="py-3 px-2 font-bold">{c.rating ?? "0.0"}/5.0</td>
                    <td className="py-3 px-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs"
                        onClick={() => openEmailModal(c)}
                      >
                        Send Email
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <PartnerFooter />
    </div>
  );
}
