import fs from 'node:fs/promises';
import path from 'node:path';

import type { Project } from '@/types/Project';

import { ensureDirectoryExists } from './file-system-agent';

export async function renderTemplate(project: Project, templateFileName: string, targetFileName = templateFileName) {
  const templatePath = path.resolve(__dirname, '../../templates', project.template, templateFileName);
  const targetPath = path.resolve(project.rootPath, targetFileName);
  const targetDir = path.dirname(targetPath);
  await ensureDirectoryExists(targetDir);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const renderedContent = templateContent.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: keyof Project) => {
    return project[key];
  });
  await fs.writeFile(targetPath, renderedContent);
}
