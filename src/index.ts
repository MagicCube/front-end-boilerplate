import { exec } from 'child_process';
import { prompt } from 'enquirer';

import { existsTemplate } from './agents/template-agent';
import { generateTasks } from './generate-tasks';
import type { Project } from './types';

export async function main(args: string[]) {
  let template = '';
  if (args[0] && args[0].startsWith('--template=')) {
    template = args[0].split('=')[1];
    if (!existsTemplate(template)) {
      console.error(`Template "${template}" not found.`);
      process.exit(404);
    }
    args = args.slice(1);
  }

  const { default: chalk } = await import('chalk');

  const projectName = args[0] || 'test-project';
  const project: Project = {
    name: projectName,
    template,
    rootPath: `${process.cwd()}/${projectName}`,
    author: 'Henry Li <henry1943@163.com>',
    ownerType: 'personal',
  };

  await inputProjectName(project);
  if (!template) {
    await chooseTemplate(project);
  }
  await selectAuthor(project);
  const { launchVSCode } = await prompt<{ launchVSCode: boolean }>({
    type: 'confirm',
    name: 'launchVSCode',
    initial: 'Y',
    message: 'Do you want to launch VSCode after the project is created?',
  });

  const tasks = await generateTasks(project);
  await tasks.run();

  console.info(chalk.green(`\n\nProject "${project.name}" created successfully!\n`));

  console.info(`Next steps:\n`);
  console.info(chalk.blue(`  cd ${project.name} && code .`));
  console.info(chalk.blue(`  pnpm dev\n`));

  if (launchVSCode) {
    await exec(`cd ${project.name} && code .`);
  }
}

async function inputProjectName(project: Project) {
  const { default: chalk } = await import('chalk');

  if (project.name !== 'test-project') {
    console.info(`${chalk.bold('✔ Project name')} · ${project.name}`);
  } else {
    const response = await prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      initial: project.name,
      message: 'Project name',
    });
    project.name = response.name;
    project.rootPath = `${process.cwd()}/${project.name}`;
  }
}

async function chooseTemplate(project: Project) {
  const res = await prompt<{ template: string }>({
    type: 'select',
    name: 'template',
    message: 'Choose a template to get started:',
    choices: [
      { name: 'React', value: 'react' },
      { name: 'Node.js', value: 'node' },
    ],
  });
  project.template = res.template;
}

async function selectAuthor(project: Project) {
  let ownerType: Project['ownerType'];
  if (project.rootPath.includes('/workspaces/bytedance/')) {
    ownerType = 'bytedance';
  } else if (project.rootPath.includes('/workspaces/magiccube/')) {
    ownerType = 'personal';
  } else {
    const response = await prompt<{ ownerType: 'Personal' | 'ByteDance' }>({
      type: 'select',
      name: 'ownerType',
      message: 'Personal or ByteDance?',
      choices: ['Personal', 'ByteDance'],
    });
    ownerType = response.ownerType.toLowerCase() as Project['ownerType'];
  }
  project.ownerType = ownerType;
  if (project.ownerType === 'bytedance') {
    project.author = 'Li Xin <lixin.henry@bytedance.com>';
  } else {
    project.author = 'Henry Li <henry1943@163.com>';
  }
}

const DEV_MODE = process.env.NODE_ENV === 'development';
if (DEV_MODE) {
  main(['--template=node', 'test-project']);
}
