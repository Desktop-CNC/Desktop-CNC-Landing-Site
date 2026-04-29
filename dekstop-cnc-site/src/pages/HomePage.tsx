import UGSLaunchButton from "../components/UGSLaunchButton";

function HomePage() {
    return (
        <div style={{ display: "grid", placeItems: "center"}}>
            <div>
                <UGSLaunchButton/>
                <section aria-labelledby="features-title" id="#home">
                    <h2>Milling with Desktop CNC</h2>
                    <p>This is sample text that will be replaced later</p>
                </section>
                <section aria-labelledby="features-title" id="#getting-started">
                    <h2>Getting Started</h2>
                    <p>This will outline how to use the CNC from the website and where to find resources.</p>
                </section>
            </div>
        </div>
    )
}

export default HomePage;