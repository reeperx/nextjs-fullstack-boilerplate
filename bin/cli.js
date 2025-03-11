#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject } from '../lib/create-project.js';

const program = new Command();

program
  .name('create-nextjs-enterprise')
  .description('CLI tool for creating Next.js enterprise applications')
  .version('1.0.0');

program
  .argument('[project-directory]', 'Directory to create the project in')
  .option('-y, --yes', 'Skip all prompts and use defaults')
  .action(async (projectDirectory, options) => {
    console.log(chalk.bold.blue('Next.js Enterprise Boilerplate Generator'));
    console.log(chalk.blue('-------------------------------------------'));
    
    let projectDir = projectDirectory;
    
    if (!projectDir && !options.yes) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectDir',
          message: 'What is the name of your project?',
          default: 'my-nextjs-app'
        }
      ]);
      projectDir = answers.projectDir;
    } else if (!projectDir && options.yes) {
      projectDir = 'my-nextjs-app';
    }
    
    try {
      await createProject(projectDir, options);
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

program.parse();