import { ChevronDown } from "lucide-react";

export default function HeroLanding() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-0 lg:px-4 py-12 lg:py-0 mt-10">
        {/* Main Tagline */}
        <div className="text-center w-full max-w-5xl">
            <h1 className="text-4xl lg:text-7xl font-montserrat font-normal leading-tight mb-4 px-4">
            <span className="font-normal">Optimize Today,</span>
            <br />
            <span className="font-dm-sans font-bold">Lead Tomorrow</span>
            </h1>

            <p className="text-crackterview-gray font-open-sans text-lg lg:text-2xl font-light leading-normal mb-12 px-4 max-w-3xl mx-auto">
            transform your recruitment interview process with intelligent tools for greater efficiency and effectiveness
            </p>

        {/* Scroll Down Indicator */}
        <div className="flex justify-center">
          <div className="w-22 h-22 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer">
            <ChevronDown className="w-8 h-8 text-black" />
          </div>
        </div>
      </div>
    </div>
  );
}
