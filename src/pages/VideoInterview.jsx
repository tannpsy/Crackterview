import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const StarRating = ({ rating, maxRating = 5, size = 20 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        size={size}
        className={
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-none text-gray-800"
        }
      />
    ))}
  </div>
);

export default function VideoInterview() {
  const [feedbackNote, setFeedbackNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [interview, setInterview] = useState(null);
  const { interviewId } = useParams();
  const videoRef = React.useRef(null);

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

 useEffect(() => {
  async function fetchInterview() {
    try {
      const res = await fetch(`/api/interviews/${interviewId}`);
      if (!res.ok) {
        const text = await res.text(); 
        console.error("Non-200 response:", text);
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setInterview(data);
    } catch (err) {
      console.error("Failed to fetch interview data", err);
    } finally {
      setLoading(false);
    }
  }

  fetchInterview();
}, [interviewId]);


  if (!interview) {
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

        <div className="flex flex-1 flex-col gap-10">
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

  {/* Center Play Button Overlay */}
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

  {/* Bottom Controls */}
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
                  <div><h4 className="mb-3 text-sm font-bold text-black">Fit for the Position</h4><StarRating rating={4} /></div>
                  <div><h4 className="mb-3 text-sm font-bold text-black">Culture Fit</h4><StarRating rating={1} /></div>
                </div>
                <div className="col-span-1 space-y-20">
                  <div><h4 className="mb-3 text-sm font-bold text-black">Motivation</h4><StarRating rating={3} /></div>
                  <div><h4 className="mb-3 text-sm font-bold text-black">Future Potential</h4><StarRating rating={4} /></div>
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

          <div className="mt-8 flex justify-end gap-4 mr-12">
            <button onClick={() => console.log("Saved note:", feedbackNote)} className="rounded-xl border border-gray-400 bg-white px-6 py-2 font-bold text-black shadow-lg transition-colors hover:bg-gray-50">Save</button>
            <button onClick={() => console.log("Send email with note:", feedbackNote)} className="rounded-xl bg-blue-600 px-6 py-2 font-bold text-white shadow-lg transition-colors hover:bg-blue-700">Send Email</button>
          </div>
        </div>
      </main>
      <PartnerFooter />
    </div>
  );
}
