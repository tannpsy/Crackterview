import { Link } from "react-router-dom";

export default function DashboardHeader() {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-100 flex items-center px-2 sm:px-4 lg:px-6">
      {/* Logo */}
      <div className="flex-shrink-0">
        <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-8 text-black font-['League_Spartan']">
          Crackterview
        </h1>
      </div>

      {/* Dashboard Title - Center */}
      <div className="flex-1 text-center">
        <h2 className="text-[24px] sm:text-[30px] lg:text-[36px] font-semibold leading-8 text-black font-['DM_Sans']">
          Dashboard
        </h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        {/* Need help? - Hidden on mobile */}
        <div className="hidden lg:block">
          <span className="text-base font-normal text-black font-['Lato']">
            Need help?
          </span>
        </div>

        {/* Language Selector - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-center w-8 h-8">
          <span className="text-base font-light text-[#5A5A5D] font-['Lato']">
            EN
          </span>
        </div>

        {/* Notification Icon */}
        <button className="w-[30px] h-[30px] flex-shrink-0 hover:opacity-80 transition-opacity">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/4af274703497c1e23beb9469cb293b55509c4a0f?width=60" 
            alt="Notifications" 
            className="w-full h-full object-contain"
          />
        </button>

        {/* Settings Icon */}
        <button className="w-[30px] h-[30px] flex-shrink-0 hover:opacity-80 transition-opacity">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/ba168a5b50ac17a221e4472342b56c3801d14800?width=60" 
            alt="Settings" 
            className="w-full h-full object-contain"
          />
        </button>

        {/* User Account */}
        <div className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1 transition-colors cursor-pointer">
          {/* Avatar */}
          <div className="w-[30px] h-[30px] rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
            <svg width="30" height="30" viewBox="0 0 30 30" className="w-full h-full">
              <circle cx="15" cy="15" r="15" fill="url(#pattern0_46_91)" />
              <defs>
                <pattern id="pattern0_46_91" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <image
                    href="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                    width="1"
                    height="1"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              </defs>
            </svg>
          </div>

          {/* User Name and Dropdown - Hidden on small screens */}
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-xs font-normal text-[#5A5A5D] font-['Lato'] text-right">
              Joye Duan
            </span>
            <svg width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0">
              <path d="M6 7L12 7L9 11L6 7Z" fill="#5A5A5D" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
