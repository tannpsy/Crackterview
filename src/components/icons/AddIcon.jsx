const AddIcon = () => {
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
          width: '17.5px',
          height: '17.5px',
          position: 'relative',
          background: 'transparent',
          borderRadius: '4px',
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
            d="M13.75 16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75V16.25Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
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
          width: '17.5px',
          height: '17.5px',
          position: 'relative',
          background: '#FEF7FF',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img 
          src="/src/assets/icons/Add.svg" 
          alt="Add"
          style={{
            width: '100%',
            height: '100%',
            color: 'currentColor'
          }}
        />
      </div>
    </div>
  );
};

export default AddIcon;
