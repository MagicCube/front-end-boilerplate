const { installNPM, renderTemplate } = require('../../dist/agents');
const {
  generateTaskForESLint,
  generateTaskForGit,
  generateTaskForPrettier,
  generateTasksForTypeScript,
} = require('../../dist/generate-tasks');

module.exports = (project) => {
  return [
    ...generateTasksForTypeScript(project),
    {
      title: 'Install Vite Node',
      async task() {
        await installNPM(['vite-node', 'vite-tsconfig-paths'], true);
      },
    },
    {
      title: 'Install rimraf',
      async task() {
        await installNPM(['rimraf'], true);
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
  ];
};
