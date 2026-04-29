// GitHubRepoReadMeViewer.jsx
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Heading {
    level: number;
    text: string;
    id: string;
}

interface Props {
    owner: any;
    repo: any;
    onHeadings?: (headings: Heading[]) => void;
};

export default function GitHubRepoReadMeViewer({ owner, repo, onHeadings }: Props) {
    const [markdown, setMarkdown] = useState("Loading README...");
    const [headings, setHeadings] = useState<Heading[]>([]);

    const fileTypes = [
        ["main", "README.md"], ["main", "readme.md"], 
        ["master", "README.md"], ["master","readme.md"]];
    let loadedMarkdown = false;

    useEffect(() => {
        // get readme content; dont wait (async)
        const fetchReadme = async () => {
            // try to get readme content by different file type formats 
            for(let i = 0; !loadedMarkdown && i < fileTypes.length; i++) { 
                try { // try to pull github content with a given format 
                    loadedMarkdown = true; // assume the pull was successful; wait for the fetch (blocking)
                    const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${fileTypes[i][0]}/${fileTypes[i][1]}`);
                
                    // try to pull successful text conversion of contents and base public url of online github content    
                    if (!res.ok) throw new Error(`Failed to fetch README: ${res.status}`);
                    let data = await res.text(); // blocking for conversion   
                    // Fix relative image paths
                    const baseRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${fileTypes[i][0]}/`;
                    // build regex for identifying before and after src arg in img tag found within the data; 
                    // for everywhere this regex/img tag is found, reformat it with the found groups to let src be specified by
                    // github url (no relative urls)
                    data = data.replace(
                        /<img\s+([^>]*?)src=["']\.\/([^"']+)["']([^>]*?)>/g,
                        (match, before, path, after) => `<img ${before}src="${baseRawUrl}${path}"${after}>`
                    );  

                    const headerFormat = /^(#{1,6})[ \t]+(.*)$/gm;
                    const headersFound = []; // found headers 
                    let token;
                    while((token = headerFormat.exec(data)) !== null) {
                        const level = token[1].length;
                        const text = token[2].trim();

                        const id = slugify(text);
                        headersFound.push({ level, text, id });
                    }
                    // set found headers from data
                    setHeadings(headersFound)
                    // set markdown to the formatted data
                    setMarkdown(data);
                } 
                catch (e) {
                    loadedMarkdown = false; // loading failed 
                }
            }
        };
        
        // call readme content request and formatting
        fetchReadme();
    },  [owner, repo]);

    function slugify(text: string) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }
      
    function flattenText(children: any): string {
        if (typeof children === "string") return children;
        if (Array.isArray(children)) return children.map(flattenText).join("");
        return "";
    }      

    return (
        <div>
            {headings.length > 0 && (
                <div
                  style={{
                    position: "sticky",
                    top: "10dvh",
                    backgroundColor: "var(--accent-color)",
                    padding: "0.75rem 1.5dvw",
                    display: "flex",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    borderRadius: "2em",
                    zIndex: 10,
                    /*boxShadow: "0 2px 4px rgba(0,0,0,0.05)",*/
                    scrollbarWidth: "none",
                    width: "48dvw",
                    marginBottom: "1em"
                  }}
                >
                  {headings.map(h => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      style={{
                        flex: "0 0 auto",
                        textDecoration: "none",
                        color: "var(--highlight-text-color)",
                        padding: "0.5rem .5rem",
                        marginLeft: "0.25rem",
                        marginRight: "0.25rem",
                        marginTop: "0",
                        marginBottom: "0",
                        borderRadius: "999px", // pill shape
                        backgroundColor: "var(--secondary-color)", 
                        boxShadow: "0 8px 100px rgba(0,0,0,0.1)",
                        transition: "background-color 0.2s",
                      }}
                    >
                      {h.text}
                    </a>
                  ))}
                </div>
            )}

            <div style={{ 
                    backgroundColor: "var(--secondary-color)", 
                    borderRadius: "1em", 
                    textAlign: "left", 
                    paddingLeft: "3dvw",
                    paddingRight: "3dvw",
                    paddingTop: "1px", 
                    width: "70dvw",
                    /*boxShadow: "0 8px 100px rgba(0,0,0,0.1)"*/
                }}>
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        h1: ({ node, ...props }) => <h1 id={slugify(flattenText(props.children))} {...props} />,
                        h2: ({ node, ...props }) => <h2 id={slugify(flattenText(props.children))} {...props} />,
                        h3: ({ node, ...props }) => <h3 id={slugify(flattenText(props.children))} {...props} />,

                        code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={"okaidia"}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    borderRadius: "12px",
                                    padding: "1rem",
                                    fontSize: "0.9rem",
                                    margin: "1rem 0",
                                }}
                                {...props}
                            >
                            {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    color: "steelblue"
                                }}
                                className={className}
                                {...props}
                            >
                            {children}
                            </code>
                        );
                    },
                    }}

                >{markdown}</ReactMarkdown>
            </div>
        </div>
    );
}
