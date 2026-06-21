#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// --- COLORS ---
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  bgCyan: "\x1b[46m\x1b[30m",
};

// --- CONFIG ---
// REEMPLAZA "yBlour/flutcom" CON TU REPOSITORIO REAL DE GITHUB CUANDO LO SUBAS
const GITHUB_REPO = "Mrblour/Flutcom";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

async function main() {
  console.clear();
  console.log(`\n${colors.cyan}${colors.bold}   ███████╗██╗     ██╗   ██╗████████╗ ██████╗ ██████╗ ███╗   ███╗
   ██╔════╝██║     ██║   ██║╚══██╔══╝██╔════╝██╔═══██╗████╗ ████║
   █████╗  ██║     ██║   ██║   ██║   ██║     ██║   ██║██╔████╔██║
   ██╔══╝  ██║     ██║   ██║   ██║   ██║     ██║   ██║██║╚██╔╝██║
   ██║     ███████╗╚██████╔╝   ██║   ╚██████╗╚██████╔╝██║ ╚═╝ ██║
   ╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═════╝ ╚═╝     ╚═╝${colors.reset}`);
  console.log(`   ${colors.dim}The lightweight SPA framework for static sites.${colors.reset}\n`);

  console.log(`${colors.cyan}◆${colors.reset}  ${colors.bold}Welcome to Flutcom!${colors.reset}`);
  console.log(`${colors.cyan}│${colors.reset}`);

  // 1. Preguntar el nombre del proyecto
  let projectName = await ask(`${colors.cyan}◇${colors.reset}  ${colors.bold}Project name:${colors.reset} ${colors.dim}(my-flutcom-app)${colors.reset} `);
  projectName = projectName.trim() || 'my-flutcom-app';

  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(`${colors.cyan}│${colors.reset}`);
    console.log(`${colors.yellow}✖  Error: Directory "${projectName}" already exists.${colors.reset}`);
    process.exit(1);
  }

  // 2. Descargar la plantilla
  console.log(`${colors.cyan}│${colors.reset}`);
  console.log(`${colors.cyan}◇${colors.reset}  Cloning template from ${GITHUB_REPO}...`);
  try {
    // Usamos degit para clonar el repositorio limpiamente (sin .git)
    execSync(`npx degit ${GITHUB_REPO} ${projectName}`, { stdio: 'inherit' });
  } catch (e) {
    console.log(`${colors.cyan}│${colors.reset}`);
    console.log(`${colors.yellow}✖  Warning: Could not download the repository.${colors.reset}`);
    console.log(`   ${colors.dim}Make sure the repository '${GITHUB_REPO}' exists and is public.${colors.reset}`);
    process.exit(1);
  }

  // 3. Instalar dependencias
  console.log(`${colors.cyan}│${colors.reset}`);
  console.log(`${colors.cyan}◇${colors.reset}  Installing dependencies...`);
  try {
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
  } catch (e) {
    console.log(`${colors.cyan}│${colors.reset}`);
    console.log(`${colors.yellow}⚠  Warning: Could not install dependencies automatically. You can do it manually.${colors.reset}`);
  }

  // 4. Mensaje de éxito
  console.log(`${colors.cyan}│${colors.reset}`);
  console.log(`${colors.green}◆${colors.reset}  ${colors.bold}Success! Created ${projectName}${colors.reset}\n`);
  console.log(`Inside that directory, you can run several commands:\n`);
  
  console.log(`  ${colors.cyan}npm run dev${colors.reset}`);
  console.log(`    Starts the development server and Tailwind watcher.\n`);

  console.log(`We suggest that you begin by typing:\n`);
  console.log(`  ${colors.cyan}cd ${projectName}${colors.reset}`);
  console.log(`  ${colors.cyan}npm run dev${colors.reset}\n`);
  
  console.log(`${colors.magenta}Happy coding with Flutcom! 🚀${colors.reset}\n`);

  rl.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
