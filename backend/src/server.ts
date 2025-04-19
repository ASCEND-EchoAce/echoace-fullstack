import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { spawn } from 'child_process';
import interviewRouter from './routes/interview/interview.router';
import userRouter from './routes/users/user.router';
import userProfileRouter from './routes/user-profiles/userProfile.router';

const app: Express = express();
const port = 8080;
const PYTHON_SERVER_URL = 'http://127.0.0.1:5000';

// Set up base paths
const BASE_DIR = path.resolve(__dirname);

// Start Python server
const startPythonServer = () => {
  const pythonServer = spawn('python', [path.join(BASE_DIR, 'python', 'model_server.py')]);

  pythonServer.stdout.on('data', (data) => {
    console.log(`Python server: ${data}`);
  });

  pythonServer.stderr.on('data', (data) => {
    console.error(`Python server error: ${data}`);
  });

  // Handle server exit
  pythonServer.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python server exited with code ${code}`);
    }
  });
};

// Start the Python server when Node.js server starts
// startPythonServer();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads, renaming with .wav extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(BASE_DIR, '..', 'uploads');
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileName = originalName.replace(/\.[^/.]+$/, ''); // Remove any extension
    cb(null, `${fileName}.wav`); // Add .wav extension to the file
  }
});

const upload = multer({ storage });

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json('Hello world!');
});

// Audio Processing Route
app.post('/process-audio', upload.single('audio'), async (req: Request, res: Response) => {
  console.log('📥 Received request at /process-audio');

  if (!req.file) {
    console.error('❌ No file received!');
    return res.status(400).json({ error: 'No audio file uploaded.' });
  }

  const audioPath = req.file.path;
  const selectedQuestion = req.body.question;

  if (!selectedQuestion) {
    console.error('❌ No question received!');
    return res.status(400).json({ error: 'No question received.' });
  }

  console.log(`✅ File received: ${req.file.originalname}, saved as ${audioPath}`);
  console.log(`✅ Received question: ${selectedQuestion}`);

  try {
    // Get transcription
    const transcribeResponse = await axios.post(`${PYTHON_SERVER_URL}/transcribe`, {
      audio_path: audioPath
    });
    const transcription = transcribeResponse.data.transcription;

    if (!transcription || transcription.length < 5) {
      console.error('❌ Transcription is empty or too short.');
      return res.status(500).json({ error: 'No transcription received.' });
    }

    console.log('✅ Final transcription:', transcription);

    // Get evaluation
    const evaluateResponse = await axios.post(`${PYTHON_SERVER_URL}/evaluate`, {
      question: selectedQuestion,
      response: transcription
    });

    console.log('✅ Evaluation result:', evaluateResponse.data.evaluation);
    res.json({
      transcription,
      evaluation: evaluateResponse.data.evaluation
    });
  } catch (error) {
    console.error('❌ Error processing request:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

// Route to handle messages
app.post('/process-message', async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message received.' });
  }

  console.log(`📥 Received message: ${message}`);

  try {
    const response = await axios.post(`${PYTHON_SERVER_URL}/chat`, {
      message
    });

    console.log('✅ LLM Reply:', response.data.reply);
    res.json({ reply: response.data.reply });
  } catch (error) {
    console.error('❌ Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.use('/api/interview', interviewRouter);
app.use('/api/users', userRouter);
app.use('/api/user-profiles', userProfileRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
  console.log(`Base directory: ${BASE_DIR}`);
});
