import React from "react";
import { Header } from "../components/Header";
import { HeroLanding } from "./HeroLanding";
import Features from "../pages/Features";
import PartnerFooter from "../components/PartnerFooter";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
        <Header></Header>
        <br></br>
        <br></br>
        <HeroLanding></HeroLanding>
        
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 pt-16 pb-8 mt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="font-league-spartan text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-none">
              Crackterview
            </h1>
            <p className="font-montserrat text-xl sm:text-2xl lg:text-2xl text-black leading-relaxed max-w-2xl">
              An AI-powered interview platform designed to provide real job interviews, assess candidate profiles, and real-time feedback to support HR department which all aligned with industry hiring standards.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/74c7bbadf4e708585fcf7600e7012bb720bb437c?width=1092"
              alt="Crackterview Platform Demo"
              className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto"
            />
          </div>
        </div>
      </section>

      {/* Build For Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="space-y-4 mb-12">
          <h2 className="font-montserrat text-2xl font-bold text-black">Build for :</h2>
          <p className="font-montserrat text-3xl sm:text-4xl text-[#5A5A5D] uppercase tracking-wide">
            RECRUITERS & INDUSTRIES
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Feature 1 */}
          <div className="text-center space-y-6">
            <div className="aspect-[390/233] w-full">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/3a3868abfd63137adf354143739aca1f97d901e8?width=780"
                alt="Pre-screen candidates illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-montserrat text-xl sm:text-2xl text-black leading-relaxed">
              Pre-screen candidates more efficiently and support unbiased, scalable evaluations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center space-y-6">
            <div className="aspect-[26/21] w-full">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/699d8802b72e7858a6c5b57cfba219a0596f5406?width=780"
                alt="Reduce time-to-hire illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-montserrat text-xl sm:text-2xl text-black leading-relaxed">
              Reduce time-to-hire and improve candidate-role fit, especially in high-volume recruitment environments.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center space-y-6">
            <div className="aspect-[195/131] w-full">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/87f99a7a975d50e31421342cfe11832d16ed610b?width=780"
                alt="Future-ready workforce illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-montserrat text-xl sm:text-2xl text-black leading-relaxed">
              Build a future-ready workforce aligned with digital transformation goals, such as AI adoption initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-16">
        <div className="text-center mb-12">
          <h2 className="font-league-spartan text-4xl sm:text-5xl text-black">
            <span className="font-bold">MEET</span>
            <span className="font-normal text-2xl"> the </span>
            <span className="font-bold">TEAM</span>
          </h2>
        </div>

        {/* Team Photos */}
        <div className="mb-12">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/1579c4ba05951543839948cfa9d0c70306f16247?width=2542"
            alt="Team Photos"
            className="w-full h-auto"
          />
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Member 1 */}
          <div className="text-center space-y-2">
            <h3 className="font-montserrat text-xl font-bold text-black">Giovaldi Ramadhan</h3>
            <p className="font-open-sans text-lg sm:text-xl text-[#5A5A5D] leading-relaxed">
              Project Manager &<br />
              Full Stack Engineer
            </p>
          </div>

          {/* Member 2 */}
          <div className="text-center space-y-2">
            <h3 className="font-montserrat text-xl font-bold text-black">Frensen Salim</h3>
            <p className="font-open-sans text-lg sm:text-xl text-[#5A5A5D]">UI UX Designer</p>
          </div>

          {/* Member 3 */}
          <div className="text-center space-y-2">
            <h3 className="font-montserrat text-xl font-bold text-black">Dhruv Menghani</h3>
            <p className="font-open-sans text-lg sm:text-xl text-[#5A5A5D] leading-relaxed">
              Cloud Engineer &<br />
              Front End Engineer
            </p>
          </div>

          {/* Member 4 */}
          <div className="text-center space-y-2">
            <h3 className="font-montserrat text-xl font-bold text-black">Intan Pasya</h3>
            <p className="font-open-sans text-lg sm:text-xl text-[#5A5A5D]">Front End Engineer</p>
          </div>

          {/* Member 5 */}
          <div className="text-center space-y-2">
            <h3 className="font-montserrat text-xl font-bold text-black">Davina Amarina</h3>
            <p className="font-open-sans text-lg sm:text-xl text-[#5A5A5D]">Back End Engineer</p>
          </div>
        </div>
      </section>
      <Features></Features>

      <PartnerFooter />

    </div>
  );
}

