import React from 'react';

/**
 * ChatBubble Component
 * @param {Object} props
 * @param {string} [props.className] 
 */
export default function ChatBubble({ className = "" }) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Chat Bubble Background */}
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 109"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_4px_rgba(0,0,0,0.3)]"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="chatBubbleShadow"
            x="-100"
            y="-100"
            width="300"
            height="300"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="10" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
        <g filter="url(#chatBubbleShadow)">
          <path
            d="M83.333 7.83325C85.7583 7.83325 87.8473 8.70301 89.5723 10.428C91.2969 12.1528 92.1659 14.2412 92.166 16.6663V66.6663C92.166 69.0915 91.2971 71.1806 89.5723 72.9055C87.8473 74.6305 85.7583 75.5002 83.333 75.5002H25.207L8.68652 92.0198L7.83301 92.8733V16.6663C7.83309 14.2411 8.70285 12.1529 10.4277 10.428C12.1526 8.70309 14.2408 7.83333 16.666 7.83325H83.333Z"
            fill="white"
            stroke="#979797"
          />
        </g>
      </svg>

      {/* Robot Avatar */}
      <div 
        className="absolute top-[15px] left-[26px] w-12 h-12 rounded-full bg-purple-700 backdrop-blur-sm flex items-center justify-center"
        role="img"
        aria-label="AI Assistant Avatar"
      >
        <svg
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.5475 17.2484C21.7099 17.9924 19.7264 18.4513 17.6518 18.5702C17.294 18.5907 16.9335 18.6011 16.5706 18.6011C16.2077 18.6011 15.8472 18.5907 15.4894 18.5702C13.4143 18.4513 11.4304 17.9922 9.59245 17.2479C5.7354 15.6859 2.52144 12.8676 0.458008 9.30056C3.67423 3.74067 9.68559 0 16.5706 0C23.4557 0 29.467 3.74067 32.6833 9.30056C30.6196 12.868 27.4051 15.6865 23.5475 17.2484Z"
            fill="white"
          />
          <path
            d="M9.5925 18.6958C9.14816 18.5158 8.71235 18.3192 8.28585 18.1067C6.89977 19.0831 5.72802 20.2992 4.8457 21.6866C6.34541 24.0449 8.68132 25.9082 11.4846 26.9409C12.8204 27.433 14.2624 27.7365 15.7706 27.8151H17.3422C18.85 27.7365 21.5002 29.2303 17.6519 32.9999C20.4556 31.9673 26.7672 24.0452 28.267 21.6866C27.3872 20.3032 26.2197 19.09 24.8387 18.115C24.4172 18.3246 23.9865 18.5186 23.5476 18.6963C21.71 19.4403 19.7265 19.8992 17.6519 20.0181C17.2941 20.0386 16.9336 20.049 16.5707 20.049C16.2078 20.049 15.8473 20.0386 15.4895 20.0181C13.4144 19.8992 11.4304 19.4401 9.5925 18.6958Z"
            fill="white"
          />
          <rect x="8.80078" y="6.92139" width="15.573" height="5.5618" rx="2.7809" fill="#162550" />
          <circle cx="20.882" cy="9.67152" r="1.01966" fill="#04FED1" />
          <circle cx="16.5558" cy="23.3905" r="1.01966" fill="#162550" />
          <circle cx="12.4777" cy="9.67152" r="1.01966" fill="#04FED1" />
          <circle cx="12.4777" cy="23.3905" r="1.01966" fill="#162550" />
          <circle cx="20.6349" cy="23.3905" r="1.01966" fill="#162550" />
        </svg>
      </div>
    </div>
  );
}