const DownloadIcon = () => {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg 
          width="30" 
          height="30" 
          viewBox="0 0 30 30" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M26.25 18.75V23.75H3.75V18.75H6.25V21.25H23.75V18.75H26.25ZM15 17.5L7.5 10L9.375 8.125L13.75 12.5V2.5H16.25V12.5L20.625 8.125L22.5 10L15 17.5Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default DownloadIcon;
