import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        
        {/* Left Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/about" className="text-xl font-lato text-crackterview-black hover:text-crackterview-blue transition-colors ml-6 mr-6">
            About Us
          </Link>
          <Link to="/features" className="text-xl font-lato text-crackterview-black hover:text-crackterview-blue transition-colors">
            Features
          </Link>
        </nav>

        {/* Centered Logo */}
        <div className="flex items-center h-full">
          <Link
            to="/"
            className="font-league-spartan text-5xl leading-tight text-crackterview-black font-bold"
            style={{ lineHeight: '1' }} // 👈 or adjust with Tailwind `leading-none`
          >
            Crackterview
          </Link>
        </div>

        {/* Right Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/demo" className="text-xl font-lato text-crackterview-black hover:text-crackterview-blue transition-colors mr-6">
            Schedule a Demo
          </Link>
          <div className="flex items-center space-x-4 mr-6">
            <span className="text-base font-lato text-crackterview-gray">EN</span>
            <Link to="/help" className="text-base font-lato text-crackterview-black hover:text-crackterview-blue transition-colors">
              Need help?
            </Link>
          </div>
        </div>

        {/* Mobile Button */}
        <button className="lg:hidden flex flex-col justify-center items-center space-y-1 p-2">
          <span className="w-6 h-0.5 bg-crackterview-black"></span>
          <span className="w-6 h-0.5 bg-crackterview-black"></span>
          <span className="w-6 h-0.5 bg-crackterview-black"></span>
        </button>
      </div>
    </header>

  );
}
