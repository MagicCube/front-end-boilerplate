import Listr from 'listr';

import { ensureDirectoryExists } from './agents/file-system-agent';
import { configGitRepo, initGitRepo } from './agents/git-agent';
import { configNPMRegistry, installNPM } from './agents/npm-agent';
import { cd } from './agents/shell-agent';
import { renderTemplate } from './agents/template-agent';
import type { Project } from './types/Project';

export function generateTasks(project: Project) {
  if (project.template === 'react') {
    return generateTasksForReactProject(project);
  } else if (project.template === 'node') {
    return generateTasksForNodeProject(project);
  } else {
    throw new Error(`Unsupported template "${project.template}".`);
  }
}

function generateTasksForTypeScript(project: Project) {
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

function generateTaskForPrettier(project: Project) {
  return {
    title: 'Setup Prettier',
    async task() {
      await installNPM(['prettier', '@vue/compiler-sfc', '@trivago/prettier-plugin-sort-imports'], true);
      if (project.template === 'react') {
        await installNPM(['@vitejs/plugin-react'], true);
      }
      await renderTemplate(project, '.prettierrc.js');
    },
  };
}

function generateTaskForESLint(project: Project) {
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

function generateTaskForGit(project: Project) {
  return {
    title: 'Initialize git repository',
    async task() {
      await renderTemplate(project, 'gitignore', '.gitignore');
      await initGitRepo();
      await configGitRepo(project);
    },
  };
}

function generateTasksForReactProject(project: Project) {
  return new Listr([
    ...generateTasksForTypeScript(project),
    {
      title: 'Install React',
      async task() {
        await installNPM(['react', 'react-dom']);
        await installNPM(['@types/react', '@types/react-dom'], true);
      },
    },
    {
      title: 'Setup Vite',
      async task() {
        await installNPM(['vite', 'vite-tsconfig-paths', 'vite-plugin-css-injected-by-js'], true);
        await installNPM(['@vitejs/plugin-react'], true);
        await renderTemplate(project, 'vite.config.ts');
      },
    },
    generateTaskForPrettier(project),
    generateTaskForESLint(project),
    {
      title: 'Install classnames',
      async task() {
        await installNPM(['classnames'], true);
      },
    },
    {
      title: 'Install less',
      async task() {
        await installNPM(['less'], true);
      },
    },
    {
      title: 'Create React application',
      async task() {
        await renderTemplate(project, 'index.html');
        await renderTemplate(project, 'src/index.tsx');
        await renderTemplate(project, 'src/app/index.tsx');
        await renderTemplate(project, 'src/app/index.module.less');
      },
    },
    generateTaskForGit(project),
  ]);
}

function generateTasksForNodeProject(project: Project) {
  return new Listr([
    ...generateTasksForTypeScript(project),
    {
      title: 'Install Vite Node',
      async task() {
        await installNPM(['vite-node', 'vite-tsconfig-paths'], true);
      },
    },
    generateTaskForPrettier(project),
    generateTaskForESLint(project),
    {
      title: 'Create Node application',
      async task() {
        await renderTemplate(project, 'src/index.ts');
        await renderTemplate(project, 'bin/index.js');
      },
    },
    generateTaskForGit(project),
  ]);
}
