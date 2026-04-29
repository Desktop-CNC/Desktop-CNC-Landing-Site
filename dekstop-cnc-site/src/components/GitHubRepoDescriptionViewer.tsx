// GitHubRepoDescriptionViewer.jsx
import { useState, useEffect } from "react";

interface Props {
    owner: any;
    repo: any;
};

export default function GitHubRepoDescriptionViewer({ owner, repo }: Props) {
    const [description, setDescription] = useState("Loading Description...");
    const [error, setError] = useState(null);

    useEffect(() => { 
        // get description content; dont wait (async)
        const fetchDescription = async () => {
            // try to get description content 
            try { // try to pull github repo description with a given format
                // wait for the fetch (blocking)
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                if(!res.ok) throw new Error(`Failed: ${res.status}`); // error handling
                const data = await res.json(); // blocking for conversion
                setDescription(data.description || "No description available.");
            }
            catch(e) {
                
                console.error(e);
            }
        } 

        // call description content request and formatting
        fetchDescription();
    },  [owner, repo]);

    // error handling should something fail
    if(error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h2 style={{fontStyle: "italic", textAlign: "left", fontSize: "1.5rem"}}>At a Glance</h2>
            <p style={{fontSize: "1.2rem"}}>{description}</p>
        </div>
    );
}