import { useState, useEffect } from 'react';
import { Paper, Text, ScrollArea, ActionIcon, CloseButton } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import '@mantine/core/styles.css';           
import '@mantine/code-highlight/styles.css'; 
import { gcodeService } from '../services/GcodeService.js';
import GcodePreviewer from '../components/GcodePreview.js';
import FileUploader from '../components/FileUploader.js';
import { supabase } from '../utils/supabase.js';

import { Navigate, redirect, useNavigate } from 'react-router-dom';
import '/src/App.css'
import DivCard from '../components/DivCard.tsx';

function MyGcodePage() {
    const [files, setFiles] = useState<any[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState<string | null>(null);
    const [previewFileContent, setPreviewFileContent] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // check authentication status
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };
        checkSession();
    }, []);


    const refreshFiles = async () => {
        try {
            const data = await gcodeService.listMyGcode();
            setFiles(data || []);
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };

    useEffect(() => {
        refreshFiles();
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                window.URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleUpload = async (files: File[]) => {
        if (files.length === 0) {
            return;
        }

        const file = files[0];
        try {
            await gcodeService.uploadGcode(file);
            refreshFiles();
        } catch (err: any) {
            alert("Upload failed: " + err.message);
        }
    };

    const handleDownload = async (fileName: string) => {
        try {
            const blob = await gcodeService.downloadFile(fileName);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); 
            
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Could not download file. Check if you are signed in.");
        }
    };

    const handlePreview = async (fileName: string) => {
        try {
             const blob = await gcodeService.downloadFile(fileName);
             const blobContent = blob.text ? await blob.text() : null;
             // clean up the old URL to prevent memory leaks
             if (previewUrl) {
                window.URL.revokeObjectURL(previewUrl);
             }

            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewFileName(fileName);
            setPreviewFileContent(blobContent);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Could not preview file. Check if you are signed in.");
        }
    }

    const handleDelete = async (fileName: string) => {
        if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

        try {
            await gcodeService.deleteGcode(fileName);
            setFiles((prev) => prev.filter((f) => f.name !== fileName));
        } catch (error: any) {
            console.error("Error deleting file:", error.message);
            alert("Delete failed.");
        }
    };

    if(isAuthenticated === null) {
        return <div>Loading...</div>;
    }
    else if(!isAuthenticated) {
        return <Navigate to="/signin" />;
    }
    
    return (
        <section className="section-alt p-4">
            
            <div style={{display: 'inline-flex', width: '100%'}}>
                <DivCard child={<>
                    <h2 className="title-goldman" style={{margin: "0 0 1rem 0.2rem"}}>My G-Code Files</h2>
                    <div style={{ borderRadius: '8px', backgroundColor: '#f8f9fa', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                        <ul className="list-group" >
                            {files.length === 0 ? (
                                <li className="list-group-item">No files found.</li>
                            ) : (
                                files.map((file) => (
                                    <li key={file.id} className="d-flex justify-content-between p-3 border-bottom align-items-center bg-white">
                                        <span className="text-dark"><strong>{file.name}</strong></span>

                                        <div>
                                            <button 
                                                className="btn btn-primary btn-sm me-2 mtb-1"
                                                onClick={() => handlePreview(file.name)}
                                            >
                                                Preview
                                            </button>

                                            <button 
                                                className="btn btn-primary btn-sm me-2 mtb-1"
                                                onClick={() => handleDownload(file.name)}
                                            >
                                                Download
                                            </button>

                                            <button 
                                                className="btn btn-outline-danger btn-sm mtb-1"
                                                onClick={() => handleDelete(file.name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </>}/>
                <DivCard child={
                    <>
                        <h2 className="title-goldman" style={{margin: "0 0 1rem 0.2rem"}}>Upload G-Code File</h2>
                        <div style={{ borderRadius: '8px', backgroundColor: '#f8f9fa', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                            <FileUploader onFilesUploaded={handleUpload} />
                        </div>
                    </>
                }/>
            </div>

                    

            {previewUrl ? (<>
                <div style={{display: "inline-flex", width: '100%', marginTop: '2rem', gap: '2rem'}}>
                    <DivCard child={<>
                        <div style={{display: 'flex'}}>
                            <h3>Preview of {previewFileName} </h3>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'right',
                              padding: '0.1rem',
                              borderBottom: 'none',
                              borderRadius: '50%', 
                              backgroundColor: '#f0f0f0',
                              width: 'fit-content',
                              marginLeft: 'auto',
                              marginBottom: 'auto'
                            }}>
                              <CloseButton 
                                aria-label="Close preview" 
                                onClick={() => setPreviewUrl(null)} 
                                size="md"
                                variant="transparent"
                              />
                            </div></div>
                        <div style={{width: '100%'}}>
                            <div style={{display: 'flex', gap: '2rem'}}>
                                <div style={{width: "40%"}}><GcodePreviewer url={previewUrl} /></div>
                                <Paper  
                                  p="md" 
                                  withBorder 
                                  style={{ backgroundColor: "#ffffff", width: '60%' }} 
                                >
                                  <Text size="s" color="dimmed" mb="sm">
                                    <strong>PREVIEW OF FILE TOOLPATH</strong>
                                  </Text>
                                  <div style={{ borderRadius: '8px', backgroundColor: '#f8f9fa', padding: '0px', maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
                                    <ScrollArea h={"100%"} type="always" offsetScrollbars>
                                      <div style={{ display: 'flex', width: '100%' }}>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                          
                                          <div style={{ 
                                            textAlign: 'right', 
                                            userSelect: 'none', 
                                            color: '#555', 
                                            paddingTop: '0.6rem', // Removed top padding to align with the 'pre' padding
                                            fontFamily: '"JetBrains Mono", "Fira Code", monospace', // Match the font!
                                            fontSize: '1rem' 
                                          }}>
                                            {previewFileContent?.split('\n').map((_, idx) => (
                                              <div key={idx} style={{ lineHeight: '1.5', borderRightWidth: "2px", borderRightColor: '#3a3939', borderRightStyle: 'solid', paddingRight: '1rem' }}>
                                                {idx + 1}
                                              </div>
                                            ))}
                                          </div>
                                        

                                          <div style={{ flex: 1 }}>
                                            <CodeHighlight
                                              code={previewFileContent || ''}
                                              language="bash" 
                                              withCopyButton={false}
                                              styles={{ 
                                                code: {
                                                  fontSize: '1rem',
                                                  lineHeight: '1.5',
                                                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                                },
                                                pre: {
                                                  backgroundColor: 'transparent',
                                                  padding: '0rem', 
                                                  margin: '0rem'
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </ScrollArea>
                                  </div>
                                </Paper>
                            </div>
                        </div></>}/>
                    </div>
                </>
            ) : (
                <div style={{marginTop: '2rem'}}/>
            )}
        </section>
    );
}

export default MyGcodePage;