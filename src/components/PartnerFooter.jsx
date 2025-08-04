import React from "react";
import { Layout } from "antd";

import akcf from '../assets/akcf.webp';
import asean from '../assets/elice.jpg';
import elice from '../assets/elice.jpg';
import komdigi from '../assets/komdigi.png';
import ksa from '../assets/ksa.svg';
import nipa from '../assets/nipa.png';

const { Footer } = Layout;

const logoImages = [akcf, asean, komdigi, ksa, nipa];

export default function PartnerFooter() {
  return (
    <Footer style={{ textAlign: 'center', backgroundColor: '#fff', overflow: 'hidden' }}>
      <div style={{ height: '60px', overflow: 'hidden', width: '100%' }}>
        <div className="logo-marquee flex animate-logo-scroll w-max">
          {logoImages.concat(logoImages).map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`partner-logo-${index}`}
              style={{
                height: '40px',
                filter: 'grayscale(100%)',
                margin: '0 2rem',
                objectFit: 'contain'
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 84 }}>
        Copyright ©{new Date().getFullYear()} WTV. All rights reserved.
      </div>
    </Footer>
  );
}
