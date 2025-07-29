import React, { useState } from "react";
import AddCandidateForm from "../frontend/AddCandidate";

export default function CandidateDashboard() {
	const [showForm, setShowForm] = useState(false);

	return (
		<div className="p-4">
			<button
				className="px-4 py-2 rounded-full bg-[#1976D2] text-white text-sm"
				onClick={() => setShowForm(true)}
			>
				➕ Add Candidates
			</button>

			{showForm && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
					<AddCandidateForm onClose={() => setShowForm(false)} />
				</div>
			)}
		</div>
	);
}
