const FilterIcon = () => {
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
            d="M27.5 3.75H2.5L12.5 15.575V23.75L17.5 26.25V15.575L27.5 3.75Z" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
  return (
    <div style={{
      width: '32px',
      height: '32px',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <img 
          src="/src/assets/icons/Filter.svg" 
          alt="Add"
          style={{
            width: '100%',
            height: '100%',
            color: 'currentColor'
          }}
        />
      <div style={{
        width: '25px',
        height: '22.5px',
        position: 'relative',
        outline: '3px #B3B3B3 solid',
        outlineOffset: '-1.5px'
      }} />
    </div>
  );
};

export default FilterIcon;
