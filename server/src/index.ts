import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for dev
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Load program.json
const programPath = path.join(__dirname, 'data', 'program.json');
let program: any[] = [];
try {
  const data = fs.readFileSync(programPath, 'utf-8');
  program = JSON.parse(data);
} catch (e) {
  console.error("Failed to load program.json", e);
}

// State
let currentId = program.length > 0 ? program[0].id : null;

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.get('/api/program', (req, res) => {
  res.json(program);
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Socket.io
io.on('connection', (socket) => {
  // Send current status immediately upon connection
  socket.emit('sync', { currentId });

  socket.on('admin:update', (data) => {
    // Basic verification could go here
    if (data.id) {
      currentId = data.id;
      io.emit('sync', { currentId });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
