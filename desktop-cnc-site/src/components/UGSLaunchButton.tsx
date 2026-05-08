import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
        
const UGSLaunchButton: React.FC = () => {
    const handleLaunch = async () => {
     try {
       // target 127.0.0.1 localhost 
       const response = await fetch('http://127.0.0.1:5000/launch-ugs', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
       });
     } catch (err) {
       console.error("Local listener not found. Is your local server running?", err);
       alert("Error: Ensure your local listener is booted manually.");
     }
    };
  
  const [hover, setHover] = React.useState(false);
  const textStyle: React.CSSProperties = {
    fontFamily: "'Goldman', display", 
    fontSize: "1.6rem",               
    fontWeight: "700",
    color: "#4A4A4A",
    marginRight: "0.6rem",
    lineHeight: "1",
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
