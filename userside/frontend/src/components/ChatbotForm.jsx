import React from "react";

export default function ChatbotForm({ onClose }) {
  const botProfileImage = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/n9rtidyy_expires_30_days.png"; 
  const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
      <svg
        className="w-6 h-6 text-gray-500"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col w-[360px] h-[600px] bg-white rounded-3xl border border-solid border-[#979797]"
        style={{ boxShadow: "0px 10px 4px #0000004D" }}>

        {/* Header */}
        <div className="flex items-center justify-between bg-[#F3A115] p-6 rounded-t-[20px]"
            style={{ boxShadow: "0px 24px 34px #AE090970" }}>
            <div className="flex items-center gap-2">
                <img
                    src={botProfileImage}
                    className="w-[46px] h-[42px] object-fill"
                    alt="CrackBot Icon"
                />
                <span className="text-white text-2xl font-bold">
                    {"CrackBot"}
                </span>
            </div>
            <button onClick={onClose}>
                <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/xlas6kmc_expires_30_days.png"}
                    className="w-6 h-6 object-fill"
                    alt="Minimize"
                />
            </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F8F9FA] flex flex-col gap-6">
            <div className="flex items-start justify-end gap-2">
                <div className="flex items-start justify-end gap-2">
                    <div className="bg-[#DEE2E6] text-[#444444] p-3 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow-sm max-w-[80%]">
                        <span>Minimum text check, Hide check icon</span>
                    </div>
                    <UserAvatar />
                </div>
            </div>
            
            <div className="flex flex-col items-start gap-1">
                <div className="flex items-start gap-2">
                    {/* Bot avatar */}
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/bxwdn5ym_expires_30_days.png"}
                        className="w-10 h-10 rounded-full bg-[#7B2CBF] p-1 object-fill"
                        alt="Bot Avatar"
                    />
                    {/* Chat bubble */}
                    <div className="bg-[#3C096C] text-white p-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-sm max-w-[80%] relative">
                        <p className="whitespace-pre-line">
                            {"Rapidly build stunning Web Apps with Frest 🚀\nDeveloper friendly, Highly customizable & Carefully crafted HTML Admin Dashboard Template."}
                        </p>
                    </div>
                </div>
                {/* Action icons */}
                <div className="flex self-start items-center ml-12 mt-2 bg-[#7B2CBF] p-1 gap-2 rounded-lg">
                    <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/tmg8rpyb_expires_30_days.png"} className="w-4 h-4 rounded-lg object-fill cursor-pointer" alt="Save Icon" />
                    <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/9je2wrrn_expires_30_days.png"} className="w-4 h-4 rounded-lg object-fill cursor-pointer" alt="Like Icon" />
                    <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/uzmx0fvt_expires_30_days.png"} className="w-4 h-4 rounded-lg object-fill cursor-pointer" alt="Dislike Icon" />
                </div>
            </div>

            <div className="flex items-start justify-end gap-2">
                <div className="bg-[#DEE2E6] text-[#444444] p-3 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow-sm max-w-[80%]">
                    <span>More no. of lines text and showing complete list of features like time stamp + check icon READ</span>
                </div>
                <UserAvatar />
            </div>
        </div>

        {/* Chat Input */}
        <div className="flex flex-col bg-white py-4 rounded-b-[20px]"
            style={{ boxShadow: "0px -4px 16px #00000012" }}>
            <div className="flex items-center self-stretch bg-[#E8EBF0] p-3 mx-4 rounded-2xl">
                <input
                    type="text"
                    placeholder="Type your message here..."
                    className="flex-1 bg-transparent text-[#444444] text-lg outline-none"
                />
                <button className="flex-shrink-0 ml-2">
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dPj38vYMjM/pxy1jeeu_expires_30_days.png"}
                        className="w-6 h-6 rounded-2xl object-fill"
                        alt="Send Icon"
                    />
                </button>
            </div>
        </div>
    </div>
  );
}