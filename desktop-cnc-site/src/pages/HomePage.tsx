import GitHubRepoReadMeViewer from "../components/GitHubMDViewer.tsx";
import Section from "../components/Section.js";
import UGSLaunchButton from "../components/UGSLaunchButton.js";
import CarouselImages from "../components/CarouselImages.tsx";
import '/src/App.css'

/**
 * @brief The website homepage. 
 */
function HomePage() {
    return (<>
        <CarouselImages owner="Desktop-CNC" repo="Desktop-CNC-WebDocumentation" root="assets/dashboard" 
        files={["A.JPG", "B.png", "C.png", "D.png", "E.png", "F.jpg", "G.jpg"]} />
        <div style={{ 
            display: "flex", 
            placeItems: "center",
            backgroundColor: "rgb(248, 248, 248)"
        }}>
            <div style={{width: "75%", padding: 0, paddingTop: "3rem", margin: 0, marginLeft: "auto"}}> 
                <Section title="" variant="main" >
                    <div className="col-md-8">
                            <h1>Milling with Desktop CNC</h1>
                            <p className="description-text">
                                Welcome to the Desktop CNC website. This page has how-to resources and documentation for using the desktop CNC milling machines in the WPI MME Teaching Lab. Additionally, this page serves as a single-sign on G-Code cloud storage service. This page will be accessible on the Desktop CNC, in lab, to make accessing your stored G-Code files quickly and easily. 
                            </p>
                            <h4>G-Code Cloud Service</h4>
                            <p className="description-text">
                                <strong>You can upload G-Code files to the cloud storage by signing in with an email via single-sign on (SSO).</strong> Files can be uploaded, downloaded, and previewed on the <strong>My Gcode</strong> page of this website.
                            </p>
                            <h4>CNC User Guides</h4>
                            <p className="description-text">
                                User guides show you how to use various Desktop CNC machine features. These can be found under the <strong>User Guides</strong> page of this website. These are currently maintained and updated. 
                            </p>
                            <h4>CNC Documentation</h4>
                            <p className="description-text">
                                Additional documentation related to how the Desktop CNC was designed can be found under the <strong>About CNC</strong> page of this website.
                            </p>
                        </div>
                </Section>
                
                <Section title="" variant="main">
                    <h1>Getting Started</h1>
                    
                        <div className="row align-items-center" id="#getting-started" style={{display: "flex", gap: "1rem"}}>
                            <div className="col-md-8" style={{width: "50%"}}>
                                <p className="description-text">
                                    Feel free to make or sign into your Desktop CNC account to store your G-Code files. The Desktop CNC machines in the MME Teaching lab are run using <strong>Universal G-Code Sender (UGS)</strong>.
                                </p>
                                <p className="description-text">
                                    When in the lab and on the Desktop CNC machine's computer: <strong> UGS can be run by clicking the button below.</strong>
                                </p>
                                <UGSLaunchButton />
                            </div>
                             <img 
                                  src="/assets/ugs_icon.svg" 
                                  alt="UGS Interface" 
                                  className="img-fluid border-round shadow-2" 
                                  style={{ width: "fit-content", marginBottom: "auto"}} 
                                />
                            <div  style={{ display: "flex", alignItems: "center", gap: "0rem" }}>
                               
                            </div>
                        </div>
                    
                </Section>

            </div>
            
        </div>

    </>)
}

export default HomePage;