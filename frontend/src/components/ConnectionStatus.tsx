import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  userCount: number;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, userCount }) => {
  const statusColor = isConnected ? '#28a745' : '#dc3545';
  const statusText = isConnected ? 'Connected' : 'Disconnected';

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: statusColor
      }} />
      <span>{statusText}</span>
      {isConnected && (
        <span style={{ color: '#666' }}>
          ({userCount} {userCount === 1 ? 'user' : 'users'})
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;