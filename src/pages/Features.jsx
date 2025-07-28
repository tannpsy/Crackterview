import { Header } from "../components/Header";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Header></Header>
      <section className="w-full px-6 py-16 lg:py-24">
        <div className="max-w-[1360px] mx-auto">
          {/* Main Title */}
          <h2 className="text-[48px] leading-[39px] font-bold text-black mb-20 font-league-spartan">
            Our Features
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="w-[272px] h-[214px] mb-14 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/07482706d774c053a1c0e66eee6d3293e964e6d4?width=544"
                  alt="One-way Interview Video Call"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center mb-12 w-[240px]">
                <h3 className="text-[24px] font-bold text-black mb-4 font-open-sans leading-normal">
                  One-way Interview Video Call
                </h3>
                <p className="text-[20px] text-black font-open-sans font-normal leading-normal">
                  Automated interview questions that pop up whenever a candidate applies for an interview.
                </p>
              </div>
              <div className="text-left w-[299px]">
                <h4 className="text-[24px] font-bold text-black mb-4 font-poppins leading-normal">
                  Benefits:
                </h4>
                <p className="text-[20px] text-black font-poppins font-normal leading-normal">
                  Prevents bias from a possibly fatigued interviewee.
                  <br />
                  Allows for assistance as a preliminary/additional interview process for when the interviewer and interviewee could not meet on the spot.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="w-[232px] h-[214px] mb-14 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/bab8d77cd67b9f874aa55aedaef0a479ebeb9753?width=464"
                  alt="AI Voice-to-Text Transcript"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center mb-12 w-[267px]">
                <h3 className="text-[24px] font-bold text-black mb-4 font-open-sans leading-normal">
                  AI Voice-to-Text
                  <br />
                  Transcript
                </h3>
                <p className="text-[20px] text-black font-open-sans font-normal leading-normal">
                  Transcribing and highlighting important content from a finished interview.
                </p>
              </div>
              <div className="text-left w-[299px]">
                <h4 className="text-[24px] font-bold text-black mb-4 font-poppins leading-normal">
                  Benefits:
                </h4>
                <p className="text-[20px] text-black font-poppins font-normal leading-normal">
                  Reduces less accurate/energy and time-consuming from manual notetaking.
                  <br />
                  Improves productivity for the interviewer's side to remember details of each interviewee's replies.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="w-[199px] h-[214px] mb-14 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/7a4fda954bd7e8438b3408b61c791793cff51680?width=398"
                  alt="AI Interview Evaluation"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center mb-12 w-[265px]">
                <h3 className="text-[24px] font-bold text-black mb-4 font-open-sans leading-normal">
                  AI Interview
                  <br />
                  Evaluation
                </h3>
                <p className="text-[20px] text-black font-open-sans font-normal leading-normal">
                  Evaluates the transcribed interview process to determine whether meet the position's requirements.
                </p>
              </div>
              <div className="text-left w-[299px]">
                <h4 className="text-[24px] font-bold text-black mb-4 font-poppins leading-normal">
                  Benefits:
                </h4>
                <p className="text-[20px] text-black font-poppins font-normal leading-normal">
                  Improves efficiency and is an overall assisting tool for the interviewer to evaluate the interviewee's answers.
                  <br />
                  Quickens the interview process as the interviewer could take the AI evaluation as a reference for further considerations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

