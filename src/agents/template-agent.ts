import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { Project } from '@/types/Project';

import { ensureDirectoryExists } from './file-system-agent';

export async function renderTemplate(project: Project, sourceFileName: string, targetFileName = sourceFileName) {
  const templatePath = path.resolve(getTemplatePath(project.template), sourceFileName);
  const targetPath = path.resolve(project.rootPath, targetFileName);
  const targetDir = path.dirname(targetPath);
  await ensureDirectoryExists(targetDir);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const renderedContent = templateContent.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: keyof Project) => {
    return project[key] ? project[key].toString() : '';
  });
  await fs.writeFile(targetPath, renderedContent);
}

export function existsTemplate(template: string) {
  const templatePath = getTemplatePath(template);
  return existsSync(templatePath);
}

function getTemplatePath(template: string) {
  return path.resolve(__dirname, '../../templates', template);
}
