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
      </div>
    </div>
  );
}
