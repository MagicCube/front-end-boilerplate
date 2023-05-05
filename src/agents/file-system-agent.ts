import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';

export async function ensureDirectoryExists(path: string) {
  if (!existsSync(path)) {
    await fs.mkdir(path);
  }
}
