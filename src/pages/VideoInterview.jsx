import React, { useState } from "react";
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

//
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

// ---- StarRating Component ----
const StarRating = ({ rating, maxRating = 5, size = 20 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        size={size}
        className={
          index < rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-800"
        }
      />
    ))}
  </div>
);

// Main
export default function InterviewPage() {
  const [feedbackNote, setFeedbackNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <main className="flex flex-1 flex-col lg:flex-row lg:gap-5 mb-10 mt-10">
        {/* Candidate Profile Card */}
        <div className=" w-full max-w-sm rounded-lg border border-gray-300 bg-white shadow-lg lg:mb-0">
          <div className=" p-4">
            <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">
              Candidate Profile
            </h3>
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
            {[
              { label: "Name", value: "Jahn Lennart" },
              { label: "Email", value: "lejahn@gmail.com" },
              { label: "Phone Number", value: "+821039659910" },
              { label: "Applied For", value: "Front End Engineer Lead" },
              { label: "Applied Date", value: "05/11/2025" },
              {
                label: "Status",
                value: <span className="font-bold text-green-600">Reviewed</span>,
              },
            ].map((item, idx) => (
              <div key={idx}>
                <label className="mb-2 block text-sm font-bold text-black">
                  {item.label}
                </label>
                <div className="flex h-12 w-full items-center rounded-md border border-gray-300 px-3 text-sm text-gray-600">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: Video Player & Feedback */}
        <div className="flex flex-1 flex-col gap-10 ">
          {/* Video Player */}
          <div className="mx-auto w-full">
            <h3 className="mb-6 font-['DM_Sans'] text-xl font-semibold text-black">
              Video/Audio Interview
            </h3>
            <div className="relative overflow-hidden rounded-lg border-4 border-white bg-black shadow-lg">
              <div className="relative aspect-video bg-gray-900">
                <div 
                  id="video-container" 
                  className="absolute inset-0 cursor-pointer"
                  onClick={handlePlayClick}
                >
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black bg-opacity-50 transition-all hover:bg-opacity-70 hover:scale-110 hover:bg-blue-600">
                    <Play className="ml-1 h-8 w-8 text-white transition-transform" fill="white" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="relative mb-4 h-1 w-full rounded-full bg-white bg-opacity-20">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-white bg-opacity-50"
                    style={{ width: "50%" }}
                  ></div>
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-red-600"
                    style={{ width: "25%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white">
                    <Play className="h-6 w-6" fill="white" />
                    <SkipForward className="h-6 w-6" fill="white" />
                    <Volume2 className="h-6 w-6" fill="white" />
                    <span className="text-xs">0:01 / 1:00</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex h-6 w-9 items-center rounded-full bg-white bg-opacity-50">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                        <Play className="h-3 w-3 text-black" fill="black" />
                      </div>
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded border border-white text-xs">
                      CC
                    </div>
                    <Settings className="h-6 w-6" />
                    <PictureInPicture2 className="h-6 w-6" />
                    <div className="h-6 w-6 rounded border border-white" />
                    <Airplay className="h-6 w-6" />
                    <Maximize className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Your Feedback */}
          <div className="w-100 h-320 rounded-lg border border-gray-300 bg-white shadow-lg pb-20">
            <div className="p-6 mt-5">
              <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">
                Your Feedback
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1 space-y-20 ">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">
                      Fit for the Position
                    </h4>
                    <StarRating rating={4} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Culture Fit</h4>
                    <StarRating rating={1} />
                  </div>
                </div>
                <div className="col-span-1 space-y-20">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Motivation</h4>
                    <StarRating rating={3} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-black">Future Potential</h4>
                    <StarRating rating={4} />
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

        {/* AI Analysis Card */}
        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-gray-300 bg-white shadow-lg">
            <div className="p-4">
              <h3 className="font-['DM_Sans'] text-xl font-semibold text-black">
                AI Interview Analysis
              </h3>
            </div>
            <div className="space-y-6 p-4">
              <div>
                <label className="mb-3 block text-sm font-bold text-black">
                  AI Summary
                </label>
                <div className="min-h-[200px] w-full rounded-md border border-gray-300 p-3 text-sm leading-relaxed text-gray-600">
                  The video features a self-introduction by Jahn Lennart, a 26-year-old
                  professional. He has been working as a Front End Engineer at Accenture for
                  the past four years. He holds a Computer Science degree from the University
                  of Southern California and has a background in Web Developer. His entry into
                  the field was influenced by working at Stern Technologies.
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <button className="flex items-center gap-3 rounded-xl bg-black px-6 py-2 font-bold text-white shadow-lg transition-colors hover:bg-gray-800">
                  <Loader className="h-5 w-5" />
                  <span>Load More</span>
                </button>
              </div>
              <div>
                <label className="mb-4 block text-sm font-bold text-black">AI Score</label>
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <CircularProgress percentage={73} label="Overall" value="73%" />
                  <CircularProgress percentage={85} label="Professionalism" value="85%" />
                  <CircularProgress percentage={65} label="Critical Thinking" value="65%" />
                </div>
                <div className="mb-6 grid grid-cols-2 gap-8">
                  <CircularProgress percentage={90} label="Communication" value="90%" />
                  <CircularProgress percentage={60} label="Teamwork" value="60%" />
                </div>
                <div className="flex justify-center">
                  <CircularProgress percentage={65} label="Leadership" value="65%" />
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4 mr-12">
            <button
              onClick={() => console.log("Saved note:", feedbackNote)}
              className="rounded-xl border border-gray-400 bg-white px-6 py-2 font-bold text-black shadow-lg transition-colors hover:bg-gray-50"
            >
              Save
            </button>
            <button
              onClick={() => console.log("Send email with note:", feedbackNote)}
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