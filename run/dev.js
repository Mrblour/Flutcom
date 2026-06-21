const { spawn }      = require('child_process');
const os             = require('os');
const fs             = require('fs');
const path           = require('path');

// ==========================================
// 1. ESTILOS DE TERMINAL (ANSI COLORS)
// ==========================================
const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",

    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m",
    white: "\x1b[37m",

    bgCyan: "\x1b[46m\x1b[30m", // Fondo cyan, texto negro
    bgGreen: "\x1b[42m\x1b[30m", // Fondo verde, texto negro
    bgMagenta: "\x1b[45m\x1b[30m", // Fondo magenta, texto negro
};

// Prefijo [Flutcom] hermoso
const prefix = `${colors.bgCyan}${colors.bold} Flutcom ${colors.reset}`;

// ==========================================
// 2. FUNCIÓN PARA LIMPIAR LA PANTALLA
// ==========================================
function clearConsole() {
    process.stdout.write(
        process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
    );
}

// ==========================================
// 3. UI DE ARRANQUE (TIPO ASTRO)
// ==========================================
clearConsole();
console.log();
const deco = `░░░░░░░░░░░▒░░░░▒░░░░░░░░░░░░░
░░░░░░░░░░▒▒░░░░▒▒░░░░░░░░░░░░
░░░░░░░░▒▒▒▒░░░░▒▒▒▒░░░░░░░░░░
░░░░░░░▒▒▒▒▒░░░░▒▒▒▒▒░░░░░░░░░
░▒░░░░░▒▒▒▒▒░░░░▒▒▒▒▒░░░░░▒░░░
░▒▒░░░▒▒▒▒▒▒░░░░▒▒▒▒▒▒░░░▒▒░░░
░▒▒▒░▒▒▒▒▒▒▒░░░▒▒▒▒▒▒▒▒░▒▒▒░░░   ███████╗██╗     ██╗   ██╗████████╗ ██████╗ ██████╗ ███╗   ███╗
░░▒▒▒░░░░░░▒▒▒▒▒▒▒▒░░░░▒▒▒▒░░░   ██╔════╝██║     ██║   ██║╚══██╔══╝██╔════╝██╔═══██╗████╗ ████║
░░░▒░░░░▒▒▒▒▒▒▒▒▒▒░░░░░▒▒▒░░░░   █████╗  ██║     ██║   ██║   ██║   ██║     ██║   ██║██╔████╔██║
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒░░░░░   ██╔══╝  ██║     ██║   ██║   ██║   ██║     ██║   ██║██║╚██╔╝██║
░▒▒▒▒▒▒▒▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▒░░░░   ██║     ███████╗╚██████╔╝   ██║   ╚██████╗╚██████╔╝██║ ╚═╝ ██║
░▒▒▒▒▒▒▒▒▒▒░░░░░▒▒▒▒▒▒▒▒▒▒░░░░   ╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
▒▒▒▒▒▒▒▒░░░░░░░░░░░▒▒▒▒▒▒▒▒░░░
▒▒▒▒▒▒░░░░░░░▒▒▒░░░░░▒▒▒▒▒▒░░░
░▒▒░░░░░░░░░▒▒▒▒▒░░░░░░░▒▒░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░▒▒░░░▒▒░░░░░░░░░░░░
░░░░░░░░░░░░▒▒▒▒▒░░░░░░░░░░░░░
░░░░░░░░░░░░░▒▒▒░░░░░░░░░░░░░░`;
console.log(`${colors.cyan}${deco}${colors.reset}`);
console.log(`  ${colors.bold}${colors.green}Flutcom Framework${colors.reset} ${colors.dim}v1.0.3${colors.reset}`);
console.log(`  ${colors.dim}┃${colors.reset} Author       ${colors.magenta}yBlour${colors.reset}`);
console.log(`  ${colors.dim}┃${colors.reset} Environment  ${colors.yellow}development (dev)${colors.reset}`);
console.log(`  ${colors.dim}┃${colors.reset} Local        ${colors.cyan}http://localhost:3000/${colors.reset}`);
console.log(`  ${colors.dim}┃${colors.reset} Network      ${colors.cyan}http://127.0.0.1:3000/${colors.reset}`);
console.log();
console.log(`${prefix} ${colors.dim}Starting background services...${colors.reset}`);

// ==========================================
// 4. EJECUCIÓN DE SERVICIOS
// ==========================================

// A) Tailwind CSS (Watch Mode)
const tailwind = spawn(
    'npx tailwindcss -i ./src/input.css -o ./assets/vendor/tailwind/tailwind.css --watch',
    { stdio: 'pipe', shell: true }
);

tailwind.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (text.includes('Done in')) {
        console.log(`${colors.bgMagenta}${colors.bold} CSS ${colors.reset} ${colors.magenta}Styles compiled successfully${colors.reset}`);
    } else if (text && !text.includes('Rebuilding') && !text.includes('tailwindcss')) {
        // Ignorar textos basuras
    }
});

tailwind.stderr.on('data', (data) => {
    const text = data.toString().trim();
    if (text.includes('Rebuilding')) {
        console.log(`${colors.bgYellow}${colors.bold} WAIT ${colors.reset} ${colors.yellow}Rebuilding CSS...${colors.reset}`);
    } else if (text.includes('Done')) {
        console.log(`${colors.bgMagenta}${colors.bold} CSS ${colors.reset} ${colors.magenta}Styles updated.${colors.reset}`);
    }
});

// B) Servidor Web (Serve)
const serve = spawn(
    'npx serve . -p 3000',
    { stdio: 'pipe', shell: true }
);

serve.stdout.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Accepting connections')) {
        console.log(`${colors.bgGreen}${colors.bold} SERVER ${colors.reset} ${colors.green}Ready and listening on port 3000${colors.reset}`);
        console.log();
    }
});

// ==========================================
// 5. MANEJO DE CIERRE (Ctrl + C)
// ==========================================
process.on('SIGINT', () => {
    console.log();
    console.log(`${prefix} ${colors.yellow}Closing services... See you later!${colors.reset}`);
    tailwind.kill();
    serve.kill();
    process.exit(0);
});
