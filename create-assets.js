import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'server', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const files = [
  'slide-1.png', 'slide-2.png', 
  'member-alice.png', 'member-bob.png', 'member-charlie.png'
];

files.forEach(f => {
  fs.writeFileSync(path.join(assetsDir, f), 'fake image data');
});
console.log('Created dummy assets');
