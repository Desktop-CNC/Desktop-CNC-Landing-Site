import React, { useEffect, useRef } from 'react';
import * as GcodePreviewLib from 'gcode-preview';

interface GcodePreviewProps {
  url: string;
}

const GcodePreview: React.FC<GcodePreviewProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    const gridSide = 152; // set a fixed grid size 
    // initialize the CNC-optimized viewer
    previewRef.current = GcodePreviewLib.init({
      canvas: canvasRef.current,
      buildVolume: { x: gridSide, y: gridSide, z: 50 },
      lineWidth: 1.0,
      renderTubes: true,
      renderExtrusion: true,
      renderTravel: true,
      travelColor: '#0000ff',
      backgroundColor: '#f0f0f0',
    });

    fetch(url)
      .then(res => res.text())
      .then(gcode => {
        previewRef.current.camera.position.set(200, 150, 200); 
        previewRef.current.camera.lookAt(0, 0, 0);
        previewRef.current.processGCode(gcode)
      })

       const handleResize = () => {
          if (previewRef.current) {
            previewRef.current.resize();
          }
        };
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [url]);

  return (
    <div style={{ width: '100%', height: '500px', background: '#1a1a1a', borderRadius: '8px' }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', borderRadius: '8px' }} 
      />
    </div>
  );
};

export default GcodePreview;
