import express from 'express';
import type { Request, Response } from 'express';
import { exec, spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post('/launch-ugs', (req, res) => {
    const scriptPath = path.resolve(__dirname, './web_launch_ugs.sh');
    const child = spawn('bash', [scriptPath], { 
        detached: true, 
        stdio: 'ignore', 
        env: { ...process.env } 
    });
    child.unref();
    console.log("UGS launch signal sent.");
    res.json({ status: 'success' });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/:splat(*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
