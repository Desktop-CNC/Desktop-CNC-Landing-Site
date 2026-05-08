import express from 'express';
import { exec, spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(cors({ // listen to website
    origin: 'https://desktop-cnc-landing-site.onrender.com' 
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// listen for a launch signal from the website
app.post('/launch-ugs', (req, res) => {
    console.log("Launch signal received from browser activity.");
    const scriptPath = path.resolve(__dirname, './web_launch_ugs.sh');
    const child = spawn('bash', [scriptPath], {
        detached: true,
        stdio: 'ignore'
    });

    child.unref();
    res.status(200).send({ message: "UGS Launching..." });
});

// runs client-side server for running UGS application
app.listen(5000, '127.0.0.1', () => {
    console.log("Local Listener active on http://127.0.0.1:5000");
    console.log("Ready for activity from Render site.");
});