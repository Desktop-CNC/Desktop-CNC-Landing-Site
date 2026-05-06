import React from "react";

function DivCard({ child }: { child: React.ReactNode }) {
    return (
        <div 
            className='card-container' 
            style={{
                width: '100%', 
                marginRight: '40px', 
                backgroundColor: "#ffffff",
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
            {child}
        </div>
    );
}

export default DivCard;