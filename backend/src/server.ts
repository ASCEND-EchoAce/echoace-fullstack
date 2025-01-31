import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { PythonShell } from 'python-shell';
import fs from 'fs';
import path from "path";

const app: Express = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Test Route
app.get('/', async (req: Request, res: Response) => {
  res.status(200).json('Hello world!');
});

// Audio Processing Route
app.post('/process-audio', upload.single('audio'), (req: Request, res: Response) => {
  const audioPath = req.file?.path; // Use optional chaining to handle the case where req.file might be undefined
  
  if (!audioPath) {
    return res.status(400).json({ error: 'No audio file uploaded.' });
  }

  console.log(`Received file: ${audioPath}`);

  const options = {
    pythonPath: 'python', // Adjust the Python path
    args: [audioPath],
  };

  const scriptPath = path.join(__dirname, "python", "transcribe.py");

  const shell = new PythonShell(scriptPath, options);   
  // const shell = new PythonShell('python/transcribe.py', options);

  // Collect output messages from the Python script
  const messages: string[] = [];

  shell.on('message', (message: string) => {
    console.log('PythonShell message:', message);
    messages.push(message); // Collect the message
  });

  shell.end((err: Error | null, code: number, signal: string | null) => {
    if (err) {
      console.error('Error running Python script:', err);
      return res.status(500).json({ error: 'Failed to process audio.' });
    }

    console.log(`Python script completed with code: ${code}, signal: ${signal}`);

    const transcription = messages.join('\n'); // Combine collected messages
    console.log("Final transcription:", transcription);

    fs.unlinkSync(audioPath); // Delete the uploaded file
    res.json({ transcription }); // Send transcription to the client
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Listening at port ${port}.`);
});

