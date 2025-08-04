import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import PartnerFooter from "../components/PartnerFooter";

export default function Faq() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-crackterview-black mb-4">This page doesn’t seem to exist.</h1>
          <p className="text-lg text-crackterview-gray mb-8">
            It looks like the link pointing here was faulty. Drop the message below.
          </p>
        </div>

        <span className="text-black text-[32px] font-bold ml-[91px] mr-[156px] mb-6 block">
          {"Send a Message"}
        </span>

        {/* Name */}
        <div className="flex flex-col items-start self-stretch mb-[21px] mx-[159px] ">
          <div className="flex flex-col items-center pb-[1px]">
            <span className="text-black text-base font-bold">Name</span>
          </div>
          <div className="flex flex-col items-start self-stretch pt-2.5 pb-[11px] pl-2.5 pr-[31px] rounded-[10px] border-[3px] border-solid border-[#D9D9D9]">
            <input
              type="text"
              placeholder="Your Name"
              className="text-[#000] text-[10px]  w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col items-start self-stretch mb-[18px] mx-[159px]">
          <div className="flex flex-col items-center pb-[1px]">
            <span className="text-black text-base font-bold">Email address</span>
          </div>
          <div className="flex flex-col items-start self-stretch pt-2.5 pb-[11px] pl-2.5 pr-[33px] rounded-[10px] border-[3px] border-solid border-[#D9D9D9]">
            <input
              type="email"
              placeholder="Your email"
              className="text-[#000] text-[10px] w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col items-start self-stretch mb-6 mx-[159px]">
          <div className="flex flex-col items-center pb-[1px]">
            <span className="text-black text-base font-bold">Subject</span>
          </div>
          <div className="flex flex-col items-start self-stretch pt-2.5 pb-[11px] pl-2.5 pr-[29px] rounded-[10px] border-[3px] border-solid border-[#D9D9D9]">
            <input
              type="text"
              placeholder="Write your subject"
              className="text-[#000] text-[10px]  w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col items-start self-stretch mb-4 mx-[159px]">
          <div className="flex flex-col items-center pb-[1px]">
            <span className="text-black text-base font-bold">Message</span>
          </div>
          <div className="flex flex-col items-start self-stretch pt-2.5 pb-[11px] pl-2.5 pr-[19px] rounded-[10px] border-[3px] border-solid border-[#D9D9D9]">
            <textarea
              placeholder="Write your message"
              className="text-[#000] text-[10px] w-full bg-transparent focus:outline-none resize-none"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* Button */}
        <div className="flex flex-col items-end self-stretch mb-[15px] px-[159px]">
          <button
            className="px-6 py-2 bg-[#1976D2] text-white text-base font-bold rounded-xl"
            onClick={() => alert("Pressed!")}
          >
            Send Message
          </button>
        </div>
      </main>
      <PartnerFooter />
    </div>
  );
}
