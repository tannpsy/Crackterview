import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  SkipForward,
  Volume2,
  Settings,
  PictureInPicture2,
  Airplay,
  Maximize,
  Loader,
  Star,
} from "lucide-react";
import { Header } from "../components/Header";
import PartnerFooter from "../components/PartnerFooter";
import { useAuth } from "../frontend/context/AuthContext";
import { toast } from "react-hot-toast";

// CircularProgress unchanged
const CircularProgress = ({ percentage, size = 70, color, label, value }) => {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    if (color) return color;
    return percentage >= 70 ? "#02FF02" : "#F4A215";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#C2C1C1"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getStrokeColor()}
            strokeWidth="2"
            fill="none"
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-black">{value}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="max-w-16 block text-xs font-medium text-black">
          {label}
        </span>
      </div>
    </div>
  );
};

// StarRating unchanged
const StarRating = ({ rating, onRate, maxRating = 5, size = 20 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: maxRating }, (_, index) => {
      const isFilled = index < rating;
      return (
        <Star
          key={index}
          size={size}
          className={isFilled ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-800"}
          onClick={() => onRate(index + 1)}
          style={{ cursor: "pointer" }}
        />
      );
    })}
  </div>
);

export default function VideoInterview() {
  const [feedbackNote, setFeedbackNote] = useState("");
  const [ratings, setRatings] = useState({
    fitForPositionRating: 0,
    motivationRating: 0,
    cultureFitRating: 0,
    futurePotentialRating: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const { interviewId } = useParams(); // Changed from 'id' to 'interviewId' for consistency
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmitFeedback = async (action) => {
    if (!interview?.candidateId?._id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/candidates/${interview.candidateId._id}/feedback`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...ratings,
            hrNote: feedbackNote,
            action,
            interviewId: interview._id,
          }),
        }
      );

      if (res.status === 401) {
        toast.error("Session expired");
        logout();
        navigate("/");
        return;
      }

      const result = await res.json();
      toast.success(`Feedback ${action === "send" ? "sent" : "saved"} successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback.");
    }
  };

  useEffect(() => {
    if (!token) {
      logout();
      toast.error("Session expired");
      navigate("/");
      return;
    }

    async function fetchInterview() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/interviews/${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) {
          toast.error("Session expired");
          logout();
          navigate("/");
          return;
        }

        const data = await res.json();
        setInterview(data);
      } catch (err) {
        console.error("Failed to fetch interview data", err);
        toast.error("Error loading interview");
      } finally {
        setLoading(false);
      }
    }

    fetchInterview();
  }, [interviewId, token, logout, navigate]);

  if (loading || !interview) {
    return <div className="text-center mt-20">Loading interview data...</div>;
  }

  const candidate = interview?.candidateId;
  const appliedDate = new Date(candidate?.appliedDate).toLocaleDateString();
  const aiScore = interview?.overallAiScore || 0;
  const aiFeedback = interview?.overallAiFeedback || "No feedback available yet.";
  const videoSrc = interview?.recordingUrl || null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <main className="flex flex-1 flex-col lg:flex-row lg:gap-5 mb-10 mt-10">
        {/* Candidate Info Panel */}
        <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white shadow-lg lg:mb-0">
          <div className="p-4">
            <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">Candidate Profile</h3>
          </div>
          <div className="flex justify-center py-6">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/73769ef055e84e82fc81054341afcc8043090e87?width=200"
                alt="Candidate Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-10 p-4">
            {[["Name", candidate?.name], ["Email", candidate?.email], ["Phone Number", candidate?.phone || "-"], ["Applied For", candidate?.position || "-"], ["Applied Date", appliedDate], ["Status", <span className="font-bold text-green-600">Reviewed</span>]].map(([label, value], i) => (
              <div key={i}>
                <label className="mb-2 block text-sm font-bold text-black">{label}</label>
                <div className="flex h-12 w-full items-center rounded-md border border-gray-300 px-3 text-sm text-gray-600">{value || "N/A"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Video and Feedback Panel */}
        <div className="flex flex-1 flex-col gap-10">
          {/* Video Section */}
          <div className="mx-auto w-full">
            <h3 className="mb-6 font-['DM_Sans'] text-xl font-semibold text-black">Video/Audio Interview</h3>
            <div className="relative overflow-hidden rounded-lg border-4 border-white bg-black shadow-lg">
              <div className="relative aspect-video bg-gray-900" onClick={handlePlayClick}>
                {videoSrc ? (
                  <video ref={videoRef} src={videoSrc} className="h-full w-full object-cover" controls={false} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white">No video available</div>
                )}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 hover:scale-110 transition-all cursor-pointer">
                    <Play className="ml-1 h-8 w-8 text-white" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-black/30 text-white">
                  <button onClick={handlePlayClick}><Play /></button>
                  <SkipForward />
                  <Volume2 />
                  <Settings />
                  <PictureInPicture2 />
                  <Airplay />
                  <Maximize />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="w-100 h-320 rounded-lg border border-gray-300 bg-white shadow-lg pb-20">
            <div className="p-6 mt-5">
              <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">Your Feedback</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1 space-y-20">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Fit for the Position</h4>
                    <StarRating rating={ratings.fitForPositionRating} onRate={(val) => setRatings(prev => ({ ...prev, fitForPositionRating: val }))} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Culture Fit</h4>
                    <StarRating rating={ratings.cultureFitRating} onRate={(val) => setRatings(prev => ({ ...prev, cultureFitRating: val }))} />
                  </div>
                </div>
                <div className="col-span-1 space-y-20">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Motivation</h4>
                    <StarRating rating={ratings.motivationRating} onRate={(val) => setRatings(prev => ({ ...prev, motivationRating: val }))} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Future Potential</h4>
                    <StarRating rating={ratings.futurePotentialRating} onRate={(val) => setRatings(prev => ({ ...prev, futurePotentialRating: val }))} />
                  </div>
                </div>
                <div className="col-span-2 space-y-6">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Note</h4>
                    <textarea
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                      className="h-40 w-full resize-none rounded-md border-2 border-gray-300 p-3 text-sm text-gray-600"
                      placeholder="e.g.: Invite this candidate for our office"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Panel + Actions */}
        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-gray-300 bg-white shadow-lg">
            <div className="p-4">
              <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">AI Interview Analysis</h3>
            </div>
            <div className="space-y-6 p-4">
              <div>
                <label className="mb-3 block text-sm font-bold text-black">AI Summary</label>
                <div className="min-h-[200px] w-full rounded-md border border-gray-300 p-3 text-sm leading-relaxed text-gray-600">{aiFeedback}</div>
              </div>
              <div className="flex justify-center pt-4">
                <button className="flex items-center gap-3 rounded-xl bg-black px-6 py-2 font-bold text-white shadow-lg transition-colors hover:bg-gray-800">
                  <Loader className="h-5 w-5" />
                  <span>Load More</span>
                </button>
              </div>
              <div>
                <label className="mb-4 block text-sm font-bold text-black">AI Score</label>
                <div className="mb-6 flex justify-center">
                  <CircularProgress percentage={aiScore} label="Overall" value={`${aiScore}%`} />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Action Buttons */}
          <div className="mt-8 flex justify-end gap-4 mr-12">
            <button
              onClick={() => handleSubmitFeedback("save")}
              className="rounded-xl border border-gray-400 bg-white px-6 py-2 font-bold text-black shadow-lg transition-colors hover:bg-gray-50"
            >
              Save
            </button>
            <button
              onClick={() => handleSubmitFeedback("send")}
              className="rounded-xl bg-blue-600 px-6 py-2 font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
            >
              Send Email
            </button>
          </div>
        </div>
      </main>
      <PartnerFooter />
    </div>
  );
}