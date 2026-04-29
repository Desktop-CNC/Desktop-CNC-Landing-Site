import React, { useState } from 'react';

const UGSLaunchButton: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleLaunch = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/launch-ugs', { 
            method: 'POST' 
          });
            if (!response.ok) throw new Error('Launch failed');
            alert('App Started!');
        } catch (error) {
            //console.error(error);
        } finally {
            setLoading(false);
        }
  };

  return (
    <button onClick={handleLaunch} disabled={loading}>
      {loading ? 'Launching...' : 'Open Application'}
    </button>
  );
};

export default UGSLaunchButton;
