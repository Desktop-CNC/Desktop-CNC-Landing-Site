// src/components/FileUpload.tsx

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ProgressBar } from 'react-bootstrap';

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
}
    const FileUploader: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
      const [processedFilesCount, setProcessedFilesCount] = useState<number>(0);
      const [uploadProgress, setUploadProgress] = useState<number>(0);

      const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        const total = acceptedFiles.length; 

        for (const file of acceptedFiles) {
          if (!file) continue;
          await onFilesUploaded([file]);

          setProcessedFilesCount((prev) => {
            const nextCount = prev + 1;
            setUploadProgress((nextCount / total) * 100);
            return nextCount;
          });
        }
      },
      [onFilesUploaded] 
    );

    React.useEffect(() => {
      if (uploadProgress === 100) {
        setTimeout(() => {
          setProcessedFilesCount(0);
          setUploadProgress(0);
        }, 1000); 
      }
    }, [processedFilesCount]);
    const { getRootProps, getInputProps,  } = useDropzone({ onDrop });

    return (
      <div>
        <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <input {...getInputProps()} />
          <img src="/assets/upload_icon.png" style={{opacity: 0.65, height: "50px", margin: "1rem"}} alt="Upload Icon"  />
          <p>Select or drop G-Code files here...</p>
          <ProgressBar striped variant="success" now={uploadProgress} />
        </div>
      </div>
    );
};

export default FileUploader;

