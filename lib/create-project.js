import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProject(projectDir, options) {
  const currentDir = process.cwd();
  const projectPath = path.join(currentDir, projectDir);
  
  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`Error: Directory ${projectDir} already exists.`));
    process.exit(1);
  }
  
  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });
  
  // Copy template files
  const spinner = ora('Creating project files...').start();
  try {
    const templateDir = path.join(__dirname, 'templates');
    await fs.copy(templateDir, projectPath);
    
    // Create package.json
    const packageJson = {
      name: projectDir.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        test: 'jest'
      },
      dependencies: {
        next: '^14.0.4',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@clerk/nextjs': '^4.29.1',
        convex: '^1.6.3',
        'next-intl': '^3.3.2',
        nodemailer: '^6.9.7',
        zod: '^3.22.4',
        'react-hook-form': '^7.49.2',
        '@hookform/resolvers': '^3.3.2',
        '@paypal/react-paypal-js': '^8.1.3',
        svix: '^1.15.0'
      },
      devDependencies: {
        '@testing-library/jest-dom': '^6.1.5',
        '@testing-library/react': '^14.1.2',
        '@types/node': '^20.10.5',
        '@types/react': '^18.2.45',
        '@types/react-dom': '^18.2.18',
        'autoprefixer': '^10.4.16',
        'eslint': '^8.56.0',
        'eslint-config-next': '^14.0.4',
        'jest': '^29.7.0',
        'jest-environment-jsdom': '^29.7.0',
        'postcss': '^8.4.32',
        'tailwindcss': '^3.4.0',
        'typescript': '^5.3.3'
      }
    };
    
    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
    
    // Create .env.local file
    const envContent = `# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Convex Database
NEXT_PUBLIC_CONVEX_URL=

# Email (Nodemailer)
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=

# Payment Processing
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=

# Deployment
NEXT_PUBLIC_APP_URL=
`;
    
    await fs.writeFile(path.join(projectPath, '.env.local'), envContent);
    
    spinner.succeed('Project files created successfully');
    
    // Install dependencies
    if (!options.skipInstall) {
      const installSpinner = ora('Installing dependencies...').start();
      try {
        process.chdir(projectPath);
        execSync('npm install', { stdio: 'ignore' });
        installSpinner.succeed('Dependencies installed successfully');
      } catch (error) {
        installSpinner.fail('Failed to install dependencies');
        console.error(chalk.red(error));
      }
    }
    
    // Success message
    console.log();
    console.log(chalk.green('Success!'), 'Created', chalk.bold(projectDir), 'at', chalk.bold(projectPath));
    console.log();
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan('  npm run dev'));
    console.log('    Starts the development server.');
    console.log();
    console.log(chalk.cyan('  npm run build'));
    console.log('    Builds the app for production.');
    console.log();
    console.log(chalk.cyan('  npm start'));
    console.log('    Runs the built app in production mode.');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(chalk.cyan('  cd'), projectDir);
    console.log(chalk.cyan('  npm run dev'));
    console.log();
    console.log('Happy coding!');
  } catch (error) {
    spinner.fail('Failed to create project files');
    console.error(chalk.red(error));
    process.exit(1);
  }
}