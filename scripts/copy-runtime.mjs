
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from 'node:fs';
import { join } from 'node:path';

const source = 'node_modules/@mediapipe/tasks-vision/wasm';
const destination = 'public/runtime/mediapipe';

console.log('Checking MediaPipe WASM:', source);

if (!existsSync(source)) {
  throw new Error(
    'MediaPipe WASM folder is missing on Vercel. Check npm installation and lockfile.'
  );
}

const files = readdirSync(source);
console.log('MediaPipe WASM files:', files);

if (files.length === 0) {
  throw new Error('MediaPipe WASM folder is empty.');
}

mkdirSync(destination, { recursive: true });

cpSync(source, destination, {
  recursive: true,
  force: true,
});

console.log('MediaPipe WASM assets copied successfully.');

