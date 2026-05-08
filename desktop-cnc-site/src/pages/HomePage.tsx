import GitHubRepoReadMeViewer from "../components/GitHubMDViewer.tsx";
import Section from "../components/Section.js";
import UGSLaunchButton from "../components/UGSLaunchButton.js";

function HomePage() {
    return (
        <div style={{ 
            display: "grid", 
            placeItems: "center",
            backgroundColor: "rgb(248, 248, 248)"
        }}>
            <div>
                <UGSLaunchButton/>
                <GitHubRepoReadMeViewer owner={"Desktop-CNC"} repo={"Desktop-CNC-WebDocumentation"} file={"/CAM_UserGuide.md"}/>
                <Section title="Milling with Desktop CNC" variant="main" >
                    <div className="row align-items-center" id="#home">
                        <div className="col-md-8">
                            <p className="description-text">
                                This machine provides high-precision milling for lab-scale projects.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <img src="/assets/ugs_icon.svg" alt="UGS Interface" className="img-fluid border-round shadow-2" />
                        </div>
                    </div>
                </Section>

                <Section title="Getting Started" variant="main">
                    <div className="row align-items-center" id="#getting-started">
                        <div className="col-md-4">
                            <img src="/assets/getting_started.svg" alt="Getting Started" className="img-fluid border-round shadow-2" />
                        </div>
                        <div className="col-md-8">
                            <p className="description-text">
                                This will outline how to use the CNC from the website and where to find resources.
                            </p>
                        </div>
                    </div>
                </Section>

            </div>
        </div>
    )
}

export default HomePage;