import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 lg:px-8 py-12 lg:py-0">
      {/* Main Tagline */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl lg:text-6xl font-montserrat font-normal leading-tight mb-4">
          <span className="font-normal">Optimize Today</span>
          <br />
          <span className="font-dm-sans font-bold">Lead Tomorrow</span>
        </h1>
        
        <p className="text-crackterview-gray font-open-sans text-lg lg:text-2xl font-light leading-normal mb-12 max-w-lg mx-auto">
          transform your recruitment interview process with intelligent tools for greater efficiency and effectiveness
        </p>

        {/* CTA Button */}
        <div className="mb-16">
          <button className="group bg-black text-white rounded-full px-8 py-4 flex items-center space-x-4 mx-auto shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <span className="font-poppins text-xl font-bold">Get started for free</span>
            <svg 
              width="23" 
              height="16" 
              viewBox="0 0 23 16" 
              fill="none" 
              className="group-hover:translate-x-1 transition-transform duration-200"
            >
              <path 
                d="M22.7071 8.70711C23.0976 8.31658 23.0976 7.68342 22.7071 7.29289L16.3431 0.928932C15.9526 0.538408 15.3195 0.538408 14.9289 0.928932C14.5384 1.31946 14.5384 1.95262 14.9289 2.34315L20.5858 8L14.9289 13.6569C14.5384 14.0474 14.5384 14.6805 14.9289 15.0711C15.3195 15.4616 15.9526 15.4616 16.3431 15.0711L22.7071 8.70711ZM0 8V9H22V8V7H0V8Z" 
                fill="white"
              />
            </svg>
          </button>
        </div>

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
