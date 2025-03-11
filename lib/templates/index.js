#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ASCII art for the CLI
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

// Ask for project name
rl.question(chalk.green('What is your project name? '), (projectName) => {
  // Validate project name
  if (!projectName) {
    console.log(chalk.red('Project name is required'));
    rl.close();
    process.exit(1);
  }

  const projectDir = path.join(process.cwd(), projectName);

  // Check if directory already exists
  if (fs.existsSync(projectDir)) {
    console.log(chalk.red(`Directory ${projectName} already exists`));
    rl.close();
    process.exit(1);
  }

  console.log(chalk.yellow('\nCreating your Next.js project...'));
  
  try {
    // Create Next.js app with TypeScript, Tailwind, and App Router
    execSync(`npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --app`, { stdio: 'inherit' });
    
    console.log(chalk.yellow('\nInstalling additional dependencies...'));
    
    // Change to project directory
    process.chdir(projectDir);
    
    // Install dependencies
    execSync(`npm install @clerk/nextjs @clerk/clerk-react convex zod react-hook-form @hookform/resolvers/zod nodemailer @paypal/react-paypal-js svix`, { stdio: 'inherit' });
    
    // Install shadcn/ui
    console.log(chalk.yellow('\nSetting up shadcn/ui...'));
    execSync(`npx shadcn@latest init --yes`, { stdio: 'inherit' });
    
    // Install common shadcn/ui components
    execSync(`npx shadcn@latest add button card form input label select textarea toast switch`, { stdio: 'inherit' });
    
    // Create directory structure
    console.log(chalk.yellow('\nCreating directory structure...'));
    
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
    
    directories.forEach(dir => {
      fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
    });
    
    // Clone the boilerplate files from your repository
    console.log(chalk.yellow('\nCloning boilerplate files...'));
    
    // Here you would typically clone files from a GitHub repository
    // For this example, we'll just create a few placeholder files
    
    // Create .env.example file
    fs.writeFileSync(
      path.join(projectDir, '.env.example'),
      `# Clerk Authentication
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
NEXT_PUBLIC_APP_URL=http://localhost:3000`
    );
    
    // Create convex.json file
    fs.writeFileSync(
      path.join(projectDir, 'convex.json'),
      `{
  "project": "${projectName}",
  "team": "your-team-name",
  "functions": {
    "runtime": "nodejs",
    "customDomains": []
  }
}`
    );
    
    // Initialize Convex
    console.log(chalk.yellow('\nInitializing Convex...'));
    execSync(`npx convex init`, { stdio: 'inherit' });
    
    console.log(chalk.green('\n✅ Project setup complete!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.white('1. cd ' + projectName));
    console.log(chalk.white('2. Copy .env.example to .env.local and fill in your API keys'));
    console.log(chalk.white('3. Run npm run dev to start the development server'));
    console.log(chalk.white('4. Visit http://localhost:3000 to see your app'));
    
    rl.close();
  } catch (error) {
    console.error(chalk.red('Error setting up project:'), error);
    rl.close();
    process.exit(1);
  }
});

