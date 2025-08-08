// src/frontend/VideoInterview.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Play,
  SkipForward,
  Volume2,
  Settings,
  PictureInPicture2,
  Airplay,
  Maximize,
  FileText,
  Star,
} from "lucide-react";
import { Header } from "../components/Header";
import PartnerFooter from "../components/PartnerFooter";

const CircularProgress = ({ percentage, size = 70, color, label, value }) => {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
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
            strokeDasharray={strokeDasharray}
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

const StarRating = ({ rating, maxRating = 5, size = 20, onRatingChange }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        size={size}
        className={
          index < rating
            ? "fill-yellow-400 text-yellow-400 cursor-pointer"
            : "fill-none text-gray-800 cursor-pointer"
        }
        onClick={() => onRatingChange(index + 1)}
      />
    ))}
  </div>
);

export default function VideoInterview() {
  const [feedbackNote, setFeedbackNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { interviewId } = useParams();
  const videoRef = React.useRef(null);
  const [ratings, setRatings] = useState({
    'Fit for the Position': 0,
    'Culture Fit': 0,
    'Motivation': 0,
    'Future Potential': 0,
  });
  const [showTranscription, setShowTranscription] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleRatingChange = (category, newRating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: newRating,
    }));
  };

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

  const handleSaveFeedback = async () => {
    setIsSubmittingFeedback(true);
    try {
      await axios.put(`/api/dashboard/interviews/${interviewId}/feedback`, {
        hrRating: (Object.values(ratings).reduce((sum, current) => sum + current, 0) / Object.values(ratings).length).toFixed(1),
        hrNotes: feedbackNote,
        hrRatings: ratings,
        status: "Reviewed", 
      }, { withCredentials: true });
      toast.success("Feedback saved successfully!");
    } catch (err) {
      console.error("Failed to save feedback", err);
      toast.error("Failed to save feedback.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSubmittingFeedback(true);
    try {
      await axios.post(`/api/interviews/${interviewId}/send-email`, {
        hrFeedback: feedbackNote,
      }, { withCredentials: true });
      toast.success("Feedback email sent successfully!");
    } catch (err) {
      console.error("Failed to send feedback email", err);
      toast.error("Failed to send feedback email.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  useEffect(() => {
    async function fetchInterview() {
        try {
            const res = await axios.get(`/api/interviews/${interviewId}`, { withCredentials: true });
            const data = res.data;
            setInterview(data);
            if (data.hrNotes) {
              setFeedbackNote(data.hrNotes);
            }
            if (data.hrRatings) {
              // Ensure the new ratings from the backend are used to set the state
              setRatings(data.hrRatings);
            }
            // For backward compatibility, you can check if old keys exist and map them
            if (data.candidateId?.hrRatings) {
                setRatings(data.candidateId.hrRatings);
            }
        } catch (err) {
            console.error("Failed to fetch interview data", err);
            toast.error("Failed to load interview data.");
        } finally {
            setLoading(false);
        }
    }
      fetchInterview();
  }, [interviewId]);

  if (loading) {
    return <div className="text-center mt-20">Loading interview data...</div>;
  }

  if (!interview) {
    return <div className="text-center mt-20">Interview not found.</div>;
  }

  const { 
    candidateId: candidate, 
    overallAiScore, 
    overallAiFeedback, 
    recordingUrl,
    aiAnalysisResult,
    transcription
  } = interview;
  
  const aiScores = aiAnalysisResult?.scores || {};

  const appliedDate = new Date(candidate?.appliedDate).toLocaleDateString();
  const videoSrc = recordingUrl || null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <main className="flex flex-1 flex-col p-5 lg:flex-row lg:gap-5 mb-10 mt-10">
        <div className="w-full max-w-sm rounded-lg border border-gray-300 bg-white shadow-lg lg:mb-0">
          <div className="p-4">
            <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">Candidate Profile</h3>
          </div>
          <div className="flex justify-center py-6">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <img src="https://api.builder.io/api/v1/image/assets/TEMP/73769ef055e84e82fc81054341afcc8043090e87?width=200" alt="Candidate Avatar" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="space-y-10 p-4">
            {[
              { label: "Name", value: candidate?.name || "N/A" },
              { label: "Email", value: candidate?.email || "N/A" },
              { label: "Phone Number", value: candidate?.phoneNumber || "-" },
              { label: "Applied For", value: candidate?.position || "-" },
              { label: "Applied Date", value: appliedDate || "-" },
              { label: "Status", value: <span className="font-bold text-green-600">Reviewed</span> },
            ].map((item, idx) => (
              <div key={idx}>
                <label className="mb-2 block text-sm font-bold text-black">{item.label}</label>
                <div className="flex h-12 w-full items-center rounded-md border border-gray-300 px-3 text-sm text-gray-600">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-10 mt-5 lg:mt-0">
          <div className="mx-auto w-full">
            <h3 className="mb-6 font-['DM_Sans'] text-xl font-semibold text-black">Video/Audio Interview</h3>
            <div className="relative overflow-hidden rounded-lg border-4 border-white bg-black shadow-lg">
              <div className="relative aspect-video bg-gray-900">
                <div id="video-container" className="absolute inset-0" onClick={handlePlayClick}>
                  {videoSrc ? (
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      className="h-full w-full object-cover"
                      controls={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">
                      No video available
                    </div>
                  )}
                </div>

                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                  }`}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 hover:scale-110 transition-all cursor-pointer"
                    onClick={handlePlayClick}
                  >
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

          <div className="w-100 h-320 rounded-lg border border-gray-300 bg-white shadow-lg pb-20">
            <div className="p-6 mt-5">
              <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">Your Feedback</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1 space-y-20">
                  <div><h4 className="mb-3 text-sm font-bold text-black">Fit for the Position</h4><StarRating rating={ratings['Fit for the Position']} onRatingChange={(newRating) => handleRatingChange('Fit for the Position', newRating)} /></div>
                  <div><h4 className="mb-3 text-sm font-bold text-black">Culture Fit</h4><StarRating rating={ratings['Culture Fit']} onRatingChange={(newRating) => handleRatingChange('Culture Fit', newRating)} /></div>
                </div>
                <div className="col-span-1 space-y-20">
                  <div><h4 className="mb-3 text-sm font-bold text-black">Motivation</h4><StarRating rating={ratings['Motivation']} onRatingChange={(newRating) => handleRatingChange('Motivation', newRating)} /></div>
                  <div><h4 className="mb-3 text-sm font-bold text-black">Future Potential</h4><StarRating rating={ratings['Future Potential']} onRatingChange={(newRating) => handleRatingChange('Future Potential', newRating)} /></div>
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

        <div className="w-full max-w-sm mt-5 lg:mt-0">
          <div className="rounded-lg border border-gray-300 bg-white shadow-lg">
            <div className="p-4">
              <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">AI Interview Analysis</h3>
            </div>
            <div className="space-y-6 p-4">
              <div>
                <label className="mb-3 block text-sm font-bold text-black">AI Summary</label>
                <div className="min-h-[200px] w-full rounded-md border border-gray-300 p-3 text-sm leading-relaxed text-gray-600">{overallAiFeedback}</div>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowTranscription(!showTranscription)}
                  className="flex items-center gap-3 rounded-xl bg-black px-6 py-2 font-bold text-white shadow-lg transition-colors hover:bg-gray-800"
                >
                  <FileText className="h-5 w-5" />
                  <span>{showTranscription ? 'Hide Transcription' : 'Show Transcription'}</span>
                </button>
              </div>
              <div>
                <label className="mb-4 block text-sm font-bold text-black">AI Score</label>
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <CircularProgress 
                      percentage={overallAiScore || 0} 
                      label="Overall" 
                      value={`${overallAiScore || 0}%`} 
                  />
                  <CircularProgress 
                      percentage={aiScores?.professionalismScore || 0} 
                      label="Professionalism" 
                      value={`${aiScores?.professionalismScore || 0}%`} 
                  />
                  <CircularProgress 
                      percentage={aiScores?.criticalThinkingScore || 0} 
                      label="Critical Thinking" 
                      value={`${aiScores?.criticalThinkingScore || 0}%`} 
                  />
                  <CircularProgress 
                      percentage={aiScores?.communicationScore || 0} 
                      label="Communication" 
                      value={`${aiScores?.communicationScore || 0}%`} 
                  />
                  <CircularProgress 
                      percentage={aiScores?.teamworkScore || 0} 
                      label="Teamwork" 
                      value={`${aiScores?.teamworkScore || 0}%`} 
                  />
                  <CircularProgress 
                      percentage={aiScores?.leadershipScore || 0} 
                      label="Leadership" 
                      value={`${aiScores?.leadershipScore || 0}%`} 
                  />
                </div>
                {showTranscription && (
                  <div className="rounded-md border border-gray-300 p-3 text-sm leading-relaxed text-gray-600 mt-4 max-h-60 overflow-y-auto">
                      <h5 className="font-bold mb-2">Transcription</h5>
                      {transcription || "No transcription available."}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 mr-12">
            <button 
              onClick={handleSaveFeedback} 
              disabled={isSubmittingFeedback}
              className="rounded-xl border border-gray-400 bg-white px-6 py-2 font-bold text-black shadow-lg transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmittingFeedback ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleSendEmail} 
              disabled={isSubmittingFeedback}
              className="rounded-xl bg-blue-600 px-6 py-2 font-bold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmittingFeedback ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </main>
      <PartnerFooter />
    </div>
  );
}