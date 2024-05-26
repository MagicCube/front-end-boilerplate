const { installNPM, renderTemplate } = require('../../dist/agents');
const {
  generateTaskForDependencies,
  generateTaskForESLint,
  generateTaskForGit,
  generateTasksForTypeScript,
} = require('../../dist/generate-tasks');

module.exports = (project) => {
  return [
    ...generateTasksForTypeScript(project),
    {
      title: 'Install tsc-alias',
      async task() {
        await installNPM(['tsc-alias'], true);
      },
    },
    {
      title: 'Install tsx',
      async task() {
        await installNPM(['tsx'], true);
      },
    },
    {
      title: 'Install rimraf',
      async task() {
        await installNPM(['rimraf'], true);
      },
    },
    generateTaskForESLint(project),
    generateTaskForDependencies(project),
    {
      title: 'Create Node application',
      async task() {
        await renderTemplate(project, 'src/index.ts');
        await renderTemplate(project, 'bin/index.js');
        await renderTemplate(project, '.env');
      },
    },
    generateTaskForGit(project),
  ];
};
