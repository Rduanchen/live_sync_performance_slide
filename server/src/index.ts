import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { statSync } from 'fs';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import program from './data/program.json';

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

// State
let currentId = program[0]?.id ?? null;

// Serve static assets
const imagesDir = path.resolve(__dirname, '../../images');
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));
app.use('/images', express.static(imagesDir));

// API Routes
app.get('/api/program', (_req, res) => {
  res.json(program.map(({ optionalSlideURL, ...slide }) => {
    if (optionalSlideURL) {
      const file = path.join(imagesDir, path.basename(optionalSlideURL));
      if (statSync(file, { throwIfNoEntry: false })?.isFile()) {
        return { ...slide, slideURL: optionalSlideURL };
      }
    }
    return slide;
  }));
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get(['/', '/admin-login', '/admin-panel'], (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
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
