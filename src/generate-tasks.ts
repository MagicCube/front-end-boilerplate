import Listr from 'listr';

import {
  cd,
  configGitRepo,
  configNPMRegistry,
  ensureDirectoryExists,
  initGitRepo,
  installNPM,
  renderTemplate,
} from './agents';
import type { Project } from './types/Project';

export async function generateTasks(project: Project) {
  const { default: generator } = (await import(`../templates/${project.template}/.boilerplate.js`)) as unknown as {
    default: (project: Project) => Listr.ListrTask[];
  };
  const tasks = generator(project);
  return new Listr(tasks);
}

export function generateTasksForTypeScript(project: Project) {
  return [
    {
      title: 'Create project directory',
      async task() {
        await ensureDirectoryExists(project.rootPath);
        await cd(project.rootPath);
      },
    },
    {
      title: 'Create package.json',
      async task() {
        await renderTemplate(project, 'package.json');
        await configNPMRegistry(project);
      },
    },
    {
      title: 'Setup TypeScript',
      async task() {
        await installNPM(['@types/node', 'typescript'], true);
        await renderTemplate(project, 'tsconfig.json');
      },
    },
  ];
}

export function generateTaskForPrettier(project: Project) {
  return {
    title: 'Setup Prettier',
    async task() {
      await installNPM(['prettier@^2', '@vue/compiler-sfc', '@trivago/prettier-plugin-sort-imports'], true);
      if (project.template === 'react') {
        await installNPM(['@vitejs/plugin-react'], true);
      }
      await renderTemplate(project, '.prettierrc.js');
    },
  };
}

export function generateTaskForESLint(project: Project) {
  return {
    title: 'Setup ESLint',
    async task() {
      await installNPM(
        [
          'eslint',
          '@typescript-eslint/eslint-plugin',
          '@typescript-eslint/parser',
          'eslint-config-prettier',
          'eslint-plugin-prettier',
        ],
        true
      );
      if (project.template === 'react') {
        await installNPM(['eslint-plugin-react', 'eslint-plugin-react-hooks'], true);
      }
      await renderTemplate(project, '.eslintrc.js');
    },
  };
}

export function generateTaskForGit(project: Project) {
  return {
    title: 'Initialize git repository',
    async task() {
      await renderTemplate(project, 'gitignore', '.gitignore');
      await initGitRepo();
      await configGitRepo(project);
    },
  };
}
