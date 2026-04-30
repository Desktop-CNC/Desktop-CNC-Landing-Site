import React, { useState } from 'react';
import { Button } from 'primereact/button';
import PrimeReact from 'primereact/api';
import { Ripple } from 'primereact/ripple';

// btn ripple affect
PrimeReact.ripple = true;
        
const UGSLaunchButton: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleLaunch = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/launch-ugs', { 
            method: 'POST' 
          });
            if (!response.ok) throw new Error('Launch failed');
        } catch (error) {} finally {
            setLoading(false);
        }
  };
  
  const [hover, setHover] = React.useState(false);
  const textStyle: React.CSSProperties = {
    fontFamily: "'Goldman', display", // Apply Goldman here
    fontSize: "1.6rem",               // Goldman runs a bit small, so 1.6rem works well
    fontWeight: "700",
    color: "#4A4A4A",
    marginRight: "0.6rem",
    lineHeight: "1",
    // We can likely remove scaleY now as Goldman is naturally tall
  };

return (
    <Button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleLaunch}
        style={{
            width: "10rem",
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            border: "none",
            backgroundColor: hover ? "#fcdaa8" : "#cccccc", 
            transition: "all 0.2s ease", 
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            
        }}
    >
        <span style={{ 
            fontFamily: "Goldman",
            fontSize: "1.5rem", 
            fontWeight: "900", 
            transform: "scale(0.8, 1.3)", 
            display: "inline-block",
            marginRight: "0.2rem",
            color: "#5a5a5a" 
        }}>
            Launch
        </span>
        <img src="/assets/ugs_icon.svg" style={{ height: "60%" }} alt="logo" />
        <Ripple />
    </Button>
    );
};

export default UGSLaunchButton;
