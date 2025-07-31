import { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  interviewId,
  initialRating = 0,
  initialNotes = ""
}) {
  const [rating, setRating] = useState(initialRating);
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("Modal Props →", { interviewId, initialRating, initialNotes });
  }, [interviewId, initialRating, initialNotes]);


  const handleSubmit = async () => {
    console.log("handleSubmit called");
    if (!interviewId) {
      toast.error("Interview ID is missing.");
      return;
    }

    if (isNaN(rating)) {
      toast.error("Rating must be a number.");
      return;
    }

    setLoading(true);
    try {
     await onSubmit({
      interviewId,
      hrRating: Number(rating),
      hrNotes: notes,
      hrFeedbackProvided: true
    });

      toast.success("Feedback submitted!");
      onClose(); 
    } catch (error) {
      toast.error("Submission failed.");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }

    console.log("interviewId:", interviewId);
    console.log("onSubmit exists:", typeof onSubmit === "function");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Submit Feedback"
      ariaHideApp={false}
      className="p-6 bg-white rounded shadow w-full max-w-md mx-auto mt-20"
    >
      <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
      <div className="mb-4">
        <label className="block mb-1">Rating (0–5):</label>
        <input
          type="number"
          value={Number.isFinite(rating) ? rating : ""}
          onChange={(e) => setRating(Number(e.target.value))}
          min="0"
          max="5"
          step="1"
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button 
          onClick={onClose} 
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >Cancel</button>
        <button 
          onClick={handleSubmit} 
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit"}
        </button>
      </div>
    </Modal>
  );
}
