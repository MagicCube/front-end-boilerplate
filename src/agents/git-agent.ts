import { exec } from './shell-agent.js';
import type { Project } from '@/types/Project.js';

export async function initGitRepo() {
  await exec('git', ['init']);
}

export async function configGitRepo(project: Project) {
  if (project.author === 'Li Xin <lixin.henry@bytedance.com>') {
    await exec('git', ['config', 'user.email', 'lixin.henry@bytedance.com']);
    await exec('git', ['config', 'user.name', 'Li Xin']);
  }
}
