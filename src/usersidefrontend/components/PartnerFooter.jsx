import React from "react";
import { Layout } from "antd";

import akcf from "../assets/akcf.webp";
import asean from "../assets/elice.jpg";
import elice from "../assets/elice.jpg";
import komdigi from "../assets/komdigi.png";
import ksa from "../assets/ksa.svg";
import nipa from "../assets/nipa.png";

const { Footer } = Layout;

const logoImages = [akcf, asean, komdigi, ksa, nipa];

export default function PartnerFooter() {
  return (
    <Footer className="!bg-white !py-4 !px-0 border-t border-gray-100 mt-14">
      {/* Logo Marquee */}
      <div className="relative h-10 overflow-hidden">
        <div className="flex w-max animate-logo-scroll">
          {logoImages.concat(logoImages).map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`partner-logo-${index}`}
              className="h-8 mx-6 grayscale opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-xs text-gray-400 mt-4 text-center">
        © {new Date().getFullYear()} WTV. All rights reserved.
      </div>
    </Footer>
  );
}
