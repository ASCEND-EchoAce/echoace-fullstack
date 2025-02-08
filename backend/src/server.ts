// import express, { Express, Request, Response } from 'express';
// import cors from 'cors';
// import multer from 'multer';
// import { PythonShell } from 'python-shell';
// import fs from 'fs';
// import path from "path";

// const app: Express = express();
// const port = 8080;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Multer setup for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Test Route
// app.get('/', async (req: Request, res: Response) => {
//   res.status(200).json('Hello world!');
// });

// // Audio Processing Route
// app.post('/process-audio', upload.single('audio'), (req: Request, res: Response) => {
//   const audioPath = req.file?.path; // Use optional chaining to handle the case where req.file might be undefined
  
//   if (!audioPath) {
//     return res.status(400).json({ error: 'No audio file uploaded.' });
//   }

//   console.log(`Received file: ${audioPath}`);

//   const options = {
//     pythonPath: 'python', // Adjust the Python path
//     args: [audioPath],
//   };

//   const scriptPath = path.join(__dirname, "python", "transcribe.py");

//   const shell = new PythonShell(scriptPath, options);   
//   // const shell = new PythonShell('python/transcribe.py', options);

//   // Collect output messages from the Python script
//   const messages: string[] = [];

//   shell.on('message', (message: string) => {
//     console.log('PythonShell message:', message);
//     messages.push(message); // Collect the message
//   });

//   shell.end((err: Error | null, code: number, signal: string | null) => {
//     if (err) {
//       console.error('Error running Python script:', err);
//       return res.status(500).json({ error: 'Failed to process audio.' });
//     }

//     console.log(`Python script completed with code: ${code}, signal: ${signal}`);

//     const transcription = messages.join('\n'); // Combine collected messages
//     console.log("Final transcription:", transcription);

//     fs.unlinkSync(audioPath); // Delete the uploaded file
//     res.json({ transcription }); // Send transcription to the client
//   });
// });



// // Start the server
// app.listen(port, () => {
//   console.log(`Listening at port ${port}.`);
// });




import express, { Express, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { PythonShell } from "python-shell";
import fs from "fs";
import path from "path";

const app: Express = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads, renaming with .wav extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save to uploads/ folder
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileName = originalName.replace(/\.[^/.]+$/, ""); // Remove any extension
    cb(null, `${fileName}.wav`); // Add .wav extension to the file
  }
});

const upload = multer({ storage });

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Hello world!");
});

// Audio Processing Route
app.post("/process-audio", upload.single("audio"), (req: Request, res: Response) => {
  console.log("📥 Received request at /process-audio");

  if (!req.file) {
    console.error("❌ No file received!");
    return res.status(400).json({ error: "No audio file uploaded." });
  }

  const audioPath = req.file.path;  // The new file name with .wav extension
  const selectedQuestion = req.body.question;

  if (!selectedQuestion) {
    console.error("❌ No question received!");
    return res.status(400).json({ error: "No question received." });
  }

  console.log(`✅ File received: ${req.file.originalname}, saved as ${audioPath}`);
  console.log(`✅ Received question: ${selectedQuestion}`);

  // Path to your Python transcription script
  const transcribeScript = path.join(__dirname, "python", "transcribe.py");

  const options = {
    pythonPath: "python",
    args: [audioPath], // Pass the audio file path as argument to Python script
  };

  const shell = new PythonShell(transcribeScript, options);
  const messages: string[] = [];

  shell.on("message", (message: string) => {
    console.log("📝 Transcribe.py output:", message);
    messages.push(message);
  });

  shell.end((err: Error | null) => {
    if (err) {
      console.error("❌ Error running transcribe.py:", err);
      return res.status(500).json({ error: "Failed to process audio." });
    }

    const transcription = messages.join("\n").trim();
    console.log("✅ Final transcription:", transcription);

    if (!transcription || transcription.length < 5) {
      console.error("❌ Transcription is empty or too short.");
      return res.status(500).json({ error: "No transcription received." });
    }

    // ✅ Now send the transcription and question to evaluator.py
    const evaluatorScript = path.join(__dirname, "python", "Inferencing", "evaluators.py");
    console.log("Resolved path to evaluator.py:", evaluatorScript);


    const evalOptions = {
      pythonPath: "python",
      args: [selectedQuestion, transcription],
    };

    console.log("✅ Sending to evaluator.py: ", evalOptions.args);

    console.log("Creating PythonShell for evaluator...");
    const evalShell = new PythonShell(evaluatorScript, evalOptions);
    console.log("PythonShell created for evaluator.");

    const evalMessages: string[] = [];

    evalShell.on("message", (message: string) => {
      console.log("🔍 Evaluator response:", message);
      evalMessages.push(message);
    });

    evalShell.end((evalErr: Error | null) => {
      if (evalErr) {
        console.error("❌ Error running evaluator.py:", evalErr);
        return res.status(500).json({ error: "Failed to evaluate response." });
      }

      const evaluationResult = evalMessages.join("\n").trim();
      console.log("✅ Evaluation Result:", evaluationResult);

      res.json({ transcription, evaluation: evaluationResult });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening at port ${port}.`);
});
