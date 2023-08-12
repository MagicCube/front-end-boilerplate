const { renderTemplate, installNPM } = require('../../dist/agents');
const {
  generateTaskForDependencies,
  generateTaskForESLint,
  generateTaskForGit,
  generateTaskForPrettier,
  generateTasksForTypeScript,
} = require('../../dist/generate-tasks');

module.exports = (project) => {
  return [
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
        await installNPM(['classnames']);
      },
    },
    {
      title: 'Install less',
      async task() {
        await installNPM(['less'], true);
      },
    },
    generateTaskForDependencies(project),
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
  ];
};
