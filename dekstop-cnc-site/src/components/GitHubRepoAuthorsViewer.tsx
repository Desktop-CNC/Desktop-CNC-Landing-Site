// GitHubRepoAuthorsViewer.jsx
import { useState, useEffect } from "react";

interface Props {
    owner: any;
    repo: any;
};

export default function GitHubRepoAuthorsViewer({ owner, repo }: Props) {
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                // wait and query contributors
                const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
                if(!contribRes.ok) throw new Error(`Failed: ${contribRes.status}`); // handle err for failed query

                const contribData = await contribRes.json(); // format contributor data to json
                const userLogins = contribData.map(user => user.login); 

                // query details on each user
                const userData = await Promise.all(
                    userLogins.map(async login => {
                        try {
                            // wait and query a user account info
                            const userRes = await fetch(`https://api.github.com/users/${login}`);
                            if(!userRes) throw new Error(`Failed: ${userRes.status}`); // handling err for failed query
                            const userAccountData = await userRes.json(); // format user account info to json
                            return {
                                name: userAccountData.name || login,
                                login: login,
                                avatarUrl: userAccountData.avatar_url
                            };
                        }
                        catch(e) {
                            console.error(`Error fetching user ${login}:`, e);
                            return { name: login, avatarUrl: null }; // fallback
                        }
                    })
                );
                
                setAuthors(userData.filter(Boolean)); // remove nulls
                console.log("Contributors:", userData);
            }
            catch(e) {
                setError("Error fetching contributors");
                console.error(e);
            }
        };

        fetchContributors();
    }, [owner, repo]);


    return (
        <div>
          <h2 style={{fontStyle: "italic", textAlign: "left", fontSize: "1.5rem"}}>Creators</h2>
          <ul style={{ display: "flex", gap: "1em", listStyle: "none", overflowX: "auto"}}>
            {authors.map((author) => (
              <li key={author.login} style={{ textAlign: "center" }}>
                <img
                  src={author.avatarUrl}
                  alt={author.login}
                  style={{ borderRadius: "50%", width: "5em" }}
                />
                <p style={{ fontWeight: "bold", margin: "4px 0 0" }}>{author.name}</p>
                <span style={{ fontSize: "0.8em", color: "var(--caption-text)" }}>({author.login})</span>
              </li>
            ))}
          </ul>
        </div>
      );
}