import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown"; // Fixed type-only import
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";


interface Heading {
  level: number;
  text: string;
  id: string;
}

interface Props {
  owner: string;
  repo: string;
  file: string; // Expected: "branch/path/to/readme.md"
  onHeadings?: (headings: Heading[]) => void;
}

export default function GitHubRepoReadMeViewer({ owner, repo, file, onHeadings }: Props) {
  const [markdown, setMarkdown] = useState<string>("Loading README...");
  const [headings, setHeadings] = useState<Heading[]>([]);

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const flattenText = (children: React.ReactNode): string => {
    return React.Children.toArray(children).reduce((text: string, child): string => {
      if (typeof child === "string" || typeof child === "number") {
        return text + String(child);
      }
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>;
        if (element.props.children) {
          return text + flattenText(element.props.children);
        }
      }
      return text;
    }, "");
  };

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${file}`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        let data = await res.text();

        // Fix relative image paths
        const pathParts = file.split("/");
        const branch = pathParts[0];
        const baseRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
        
        data = data.replace(
          /<img\s+([^>]*?)src=["']\.\/([^"']+)["']([^>]*?)>/g,
          (_, before, path, after) => `<img ${before}src="${baseRawUrl}${path}"${after}>`
        );

        // Header extraction
        const headerFormat = /^(#{1,6})[ \t]+(.*)$/gm;
        const headersFound: Heading[] = [];
        let token;
        while ((token = headerFormat.exec(data)) !== null) {
          const text = token[2].trim();
          headersFound.push({
            level: token[1].length,
            text,
            id: slugify(text),
          });
        }

        setHeadings(headersFound);
        if (onHeadings) onHeadings(headersFound);
        setMarkdown(data);
      } catch (e) {
        setMarkdown("## Error\nCould not fetch the README file. Please check your props.");
      }
    };

    fetchReadme();
  }, [owner, repo, file, onHeadings]);

  const MarkdownComponents: Components = {
    h1: ({ children }) => <h1 id={slugify(flattenText(children))}>{children}</h1>,
    h2: ({ children }) => <h2 id={slugify(flattenText(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(flattenText(children))}>{children}</h3>,
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={okaidia as any}
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
            backgroundColor: "rgba(0,0,0,0.05)",
            padding: "2px 6px",
            borderRadius: "4px",
            color: "steelblue",
          }}
          className={className}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {headings.length > 0 && (
        <div
          style={{
            position: "sticky",
            top: "10dvh",
            backgroundColor: "var(--accent-color, #eee)",
            padding: "0.75rem 1.5dvw",
            display: "flex",
            overflowX: "auto",
            whiteSpace: "nowrap",
            borderRadius: "2em",
            zIndex: 10,
            width: "48dvw",
            marginBottom: "1em",
            scrollbarWidth: "none",
          }}
        >
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              style={{
                flex: "0 0 auto",
                textDecoration: "none",
                color: "var(--highlight-text-color, #333)",
                padding: "0.5rem 1rem",
                margin: "0 0.25rem",
                borderRadius: "999px",
                backgroundColor: "var(--secondary-color, #fff)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                fontSize: "0.85rem",
              }}
            >
              {h.text}
            </a>
          ))}
        </div>
      )}

      <div
        style={{
          backgroundColor: "var(--secondary-color, #fff)",
          borderRadius: "1em",
          textAlign: "left",
          padding: "1px 3dvw 2rem 3dvw",
          width: "70dvw",
        }}
      >
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
