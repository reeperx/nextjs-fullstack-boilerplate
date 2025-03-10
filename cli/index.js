#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import degit from 'degit';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   Next.js Full-Stack Boilerplate Generator        ║
║                                                   ║
║   Includes: Clerk, Convex, shadcn/ui,             ║
║   PayPal, PayFast, Nodemailer                     ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
`));

async function main() {
  try {
    // Get project name
    const { projectName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        validate: (input) => {
          if (!input) return 'Project name is required';
          if (fs.existsSync(path.join(process.cwd(), input))) {
            return `Directory ${input} already exists`;
          }
          return true;
        }
      }
    ]);

    const projectDir = path.join(process.cwd(), projectName);

    // Create Next.js app
    const spinner = ora('Creating Next.js project...').start();
    
    try {
      execSync(`npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --app`, { 
        stdio: 'ignore' 
      });
      spinner.succeed('Next.js project created');
    } catch (error) {
      spinner.fail('Failed to create Next.js project');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }

    // Change to project directory
    process.chdir(projectDir);

    // Install dependencies
    const dependenciesSpinner = ora('Installing dependencies...').start();
    try {
      execSync(`npm install @clerk/nextjs @clerk/clerk-react convex zod react-hook-form @hookform/resolvers/zod nodemailer @paypal/react-paypal-js svix`, { 
        stdio: 'ignore' 
      });
      dependenciesSpinner.succeed('Dependencies installed');
    } catch (error) {
      dependenciesSpinner.fail('Failed to install dependencies');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }

    // Install shadcn/ui
    const shadcnSpinner = ora('Setting up shadcn/ui...').start();
    try {
      execSync(`npx shadcn@latest init --yes`, { stdio: 'ignore' });
      execSync(`npx shadcn@latest add button card form input label select textarea toast switch`, { 
        stdio: 'ignore' 
      });
      shadcnSpinner.succeed('shadcn/ui setup complete');
    } catch (error) {
      shadcnSpinner.fail('Failed to setup shadcn/ui');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }

    // Create directory structure
    const dirSpinner = ora('Creating directory structure...').start();
    
    const directories = [
      'app/api/webhooks/clerk',
      'app/api/webhooks/convex',
      'app/api/webhooks/paypal',
      'app/api/webhooks/payfast',
      'app/api/email',
      'app/(auth)/sign-in/[[...sign-in]]',
      'app/(auth)/sign-up/[[...sign-up]]',
      'app/dashboard',
      'components/dashboard',
      'components/payments',
      'components/email',
      'providers',
      'lib/payment',
      'convex',
    ];
    
    try {
      directories.forEach(dir => {
        fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
      });
      dirSpinner.succeed('Directory structure created');
    } catch (error) {
      dirSpinner.fail('Failed to create directory structure');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }

    // Clone boilerplate files
    const cloneSpinner = ora('Cloning boilerplate files...').start();
    
    try {
      // Replace with your actual GitHub username and repository
      const emitter = degit('YOUR_USERNAME/nextjs-fullstack-boilerplate/template', {
        force: true,
        verbose: true,
      });
      
      await emitter.clone(projectDir);
      cloneSpinner.succeed('Boilerplate files cloned');
    } catch (error) {
      cloneSpinner.fail('Failed to clone boilerplate files');
      console.error(chalk.red('Error:'), error.message);
      
      // Create .env.local file with placeholders
      createEnvLocalFile(projectDir);
    }

    // Initialize Convex
    const convexSpinner = ora('Initializing Convex...').start();
    try {
      execSync(`npx convex init`, { stdio: 'ignore' });
      convexSpinner.succeed('Convex initialized');
    } catch (error) {
      convexSpinner.warn('Could not initialize Convex. You will need to run `npx convex init` manually.');
    }

    console.log(chalk.green('\n✅ Project setup complete!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.white('1. cd ' + projectName));
    console.log(chalk.white('2. Fill in your API keys in the .env.local file'));
    console.log(chalk.white('3. Run npm run dev to start the development server'));
    console.log(chalk.white('4. Visit http://localhost:3000 to see your app'));

  } catch (error) {
    console.error(chalk.red('Error setting up project:'), error);
    process.exit(1);
  }
}

function createEnvLocalFile(projectDir) {
  const envContent = `# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Convex
NEXT_PUBLIC_CONVEX_URL=

# Email (Gmail)
GMAIL_EMAIL=
GMAIL_APP_PASSWORD=

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# PayFast
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

  fs.writeFileSync(path.join(projectDir, '.env.local'), envContent);
  console.log(chalk.green('Created .env.local file with placeholders'));
}

main().catch(error => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});