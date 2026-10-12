
// Copy MediaPipe and ONNX Runtime assets into public/runtime.
// Supports package layouts that differ between installed versions.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from 'node:fs';
import { join } from 'node:path';

const candidates = [
  'node_modules/@mediapipe/tasks-vision/wasm',
  'node_modules/@mediapipe/tasks-vision/vision_bundle.mjs',
];

const source = candidates.find((path) => existsSync(path));

if (!source) {
  throw new Error(
    'MediaPipe assets not found. Check the installed @mediapipe/tasks-vision package.'
  );
}

const destination = 'public/runtime/mediapipe';
mkdirSync(destination, { recursive: true });

if (source.endsWith('.mjs')) {
  cpSync(source, join(destination, 'vision_bundle.mjs'));
} else {
  for (const file of readdirSync(source)) {
    cpSync(join(source, file), join(destination, file), {
      recursive: true,
    });
  }
}

console.log(`MediaPipe assets copied from ${source}`);

