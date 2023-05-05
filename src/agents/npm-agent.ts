import type { Project } from '@/types';

import { exec } from './shell-agent';

export async function installNPM(packages: string | string[], dev = false) {
  if (typeof packages === 'string') {
    packages = [packages];
  }
  await exec('pnpm', ['add', ...packages, dev ? '-D' : '']);
}

export async function configNPMRegistry(project: Project) {
  await exec('nrm', ['use', project.ownerType === 'personal' ? 'taobao' : 'bnpm']);
}
