import { Header } from "../components/Header";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Header></Header>
      <section className="w-full px-6 py-16 lg:py-24">
        <div className="max-w-[1360px] mx-auto">
          {/* Main Title */}
          <h2 className="text-[48px] leading-[39px] font-bold text-black mb-5 font-league-spartan">
            Our Features
          </h2>
          <p className="font-montserrat text-lg lg:text-2xl text-black leading-[35px] max-w-[807px] mb-8 lg:mb-[131px]">
                Our platform's features were developed in response to the specific challenges experienced by Human Resources (HR) Departments.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="w-[272px] h-[214px] mb-14 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/25dde1ee8c16193f00da71483771d06ab6b3eb16?width=352"
                  alt="Candidate Management System"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center mb-12 w-[240px]">
                <h3 className="text-[24px] font-bold text-black mb-4 font-open-sans leading-normal">
                  Candidate Management System
                </h3>
                <p className="text-[20px] text-black font-open-sans font-normal leading-normal">
                  Overseeing interviewed candidates to ensure smooth evaluations and timely feedback.
                </p>
              </div>
              <div className="text-left w-[299px]">
                <h4 className="text-[24px] font-bold text-black mb-4 font-poppins leading-normal">
                  Benefits:
                </h4>
                <p className="text-[20px] text-black font-poppins font-normal leading-normal">
                  Speeds up post-interview coordination with organized candidate data
                  <br />
                  <br />
                  Supports quicker decisions with a clear view of evaluation progress.
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