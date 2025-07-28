import React from "react";
import DashboardHeader from "../components/HeaderDashboard";

const stats = [
  {
    label: "Total Applicants",
    value: "134",
    color: "text-[#1976D2]",
  },
  {
    label: "Total Interviews",
    value: "121",
    color: "text-black",
  },
  {
    label: "Total Responses",
    value: "116",
    color: "text-[#4CAF50]",
  },
  {
    label: "Need Response",
    value: "5",
    color: "text-[#FF3D00]",
  },
];

export default function Dashboard() {
  return (
    <div className="w-full max-w-[1315px] mx-auto">
      <DashboardHeader />
      <br />

      {/* STATS SECTION */}
      <div className="bg-white rounded-[40px] border border-[#D9D9D9] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1280px] mx-auto">
          <h1
            className="text-[32px] font-bold text-black mb-8 lg:mb-12"
            style={{
              fontFamily:
                "Montserrat, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            Your Stats
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div
                  className="text-[20px] font-bold text-[#979797] mb-4"
                  style={{
                    fontFamily:
                      "DM Sans, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  className={`${stat.color} text-[40px] font-bold`}
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CANDIDATE TABLE --- */}
      <div className="mt-12 bg-white rounded-[40px] border border-[#D9D9D9] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-6">
        <h2 className="text-[28px] font-bold text-black mb-6 font-montserrat">Candidates</h2>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search Candidates"
              className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">✕</span>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button className="px-4 py-2 rounded-full border text-[#1976D2] border-[#1976D2] text-sm">⬇ Download</button>
            <button className="px-4 py-2 rounded-full border text-gray-500 border-gray-300 text-sm">⬆ Import</button>
            <button className="px-4 py-2 rounded-full bg-[#1976D2] text-white text-sm">➕ Add Candidates</button>
            <button className="px-4 py-2 rounded-full border text-gray-500 border-gray-300 text-sm">🧃 Filter Candidates</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="text-gray-500 border-b border-gray-300">
              <tr>
                <th className="text-left py-3 px-2"><input type="checkbox" /></th>
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
              {[
                {
                  name: "Jahn Lennart",
                  email: "lejohn@gmail.com",
                  avatar: "john",
                  position: "Front End Engineer Lead",
                  date: "05/11/2025",
                  status: "Reviewed",
                  score: "73",
                  rating: "3.7",
                  feedback: "Sent",
                },
                {
                  name: "Felix Romarow Kent",
                  email: "felix.kent@outlook.com",
                  avatar: "felix",
                  position: "Senior Back End Engineer",
                  date: "05/14/2025",
                  status: "Reviewed",
                  score: "82",
                  rating: "4.6",
                  feedback: "Send Feedback",
                },
                {
                  name: "Paramitha Adhisya",
                  email: "mithasya@yahoo.com",
                  avatar: "paramitha",
                  position: "QA Engineer",
                  date: "05/09/2025",
                  status: "Unreviewed",
                  score: "68",
                  rating: "0.0",
                  feedback: "Need Review",
                },
                {
                  name: "Angeline Gita",
                  email: "angel.gita@hotmail.com",
                  avatar: "angel",
                  position: "UI/UX Designer Lead",
                  date: "05/22/2025",
                  status: "Reviewed",
                  score: "94",
                  rating: "4.2",
                  feedback: "Send Feedback",
                },
              ].map((c, i) => {
                const statusColor = c.status === "Reviewed" ? "text-green-600" : "text-red-500";
                const feedbackColor =
                  c.feedback === "Sent"
                    ? "text-green-600"
                    : c.feedback === "Need Review"
                    ? "text-red-500"
                    : "text-blue-600 underline cursor-pointer";

                return (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2"><input type="checkbox" /></td>
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/32?u=${c.avatar}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-black">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2">{c.position}</td>
                    <td className="py-3 px-2">{c.date}</td>
                    <td className={`py-3 px-2 font-semibold ${statusColor}`}>{c.status}</td>
                    <td className="py-3 px-2 font-bold">{c.score}/100</td>
                    <td className="py-3 px-2 font-bold">{c.rating}/5.0</td>
                    <td className={`py-3 px-2 font-semibold ${feedbackColor}`}>{c.feedback}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <span className="cursor-pointer hover:underline">← Previous</span>
          <div className="flex gap-2 items-center">
            {[1, 2, 3, "...", 67, 68].map((num, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-full ${
                  num === 1 ? "bg-black text-white" : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="cursor-pointer hover:underline">Next →</span>
        </div>
      </div>
      {/* --- END CANDIDATE TABLE --- */}
    </div>
  );
}
