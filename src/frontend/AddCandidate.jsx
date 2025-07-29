import React from "react";

export default function AddCandidateForm({ onClose }) {
    return (
        <div className="flex flex-col bg-white p-6 w-[400px] rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Add New Candidate</h2>
                <button onClick={onClose}>
                    <img
                        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/lf75tuaa_expires_30_days.png"
                        alt="Close"
                        className="w-[24px] h-[24px]"
                    />
                </button>
            </div>

            <form className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-black mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Name candidate"
                        className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-black mb-1">Email address</label>
                    <input
                        type="email"
                        placeholder="Email candidate"
                        className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-black mb-1">Position</label>
                    <input
                        type="text"
                        placeholder="Applied for"
                        className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-black mb-1">Applied at</label>
                    <div className="relative">
                        <input
                            type="date"
                            defaultValue="2025-08-17"
                            className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                        />
                        <span className="absolute right-3 top-2.5">
                            <img
                                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/nsosbk4l_expires_30_days.png"
                                alt="Calendar"
                                className="w-6 h-6"
                            />
                        </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">MM/DD/YYYY</span>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-black mb-1">Upload Video/Audio</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl py-14 px-6 text-center text-sm text-gray-600 cursor-pointer">
                        Click to browse or <br /> drag and drop your files
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        className="border border-gray-400 text-gray-500 px-6 py-2 rounded-xl"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-[#1976D2] text-white px-6 py-2 rounded-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            alert("Add Candidates");
                        }}
                    >
                        Add Candidates
                    </button>
                </div>
            </form>
        </div>
    );
};