const { spawn }       = require('child_process');
const os              = require('os');
const fs              = require('fs');
const path            = require('path');
const { createServer } = require('net');

// ─── Asegurar Node.js en PATH (Windows) ──────────────────────────────────────
if (process.platform === 'win32') {
    const nodeDefaultPath = 'C:\\Program Files\\nodejs';
    if (fs.existsSync(nodeDefaultPath) && !process.env.PATH.includes(nodeDefaultPath)) {
        process.env.PATH = `${nodeDefaultPath};${process.env.PATH}`;
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 1. COLORES ANSI
// ════════════════════════════════════════════════════════════════════════════
const c = {
    reset:     '\x1b[0m',
    bold:      '\x1b[1m',
    dim:       '\x1b[2m',
    cyan:      '\x1b[36m',
    green:     '\x1b[32m',
    yellow:    '\x1b[33m',
    magenta:   '\x1b[35m',
    red:       '\x1b[31m',
    white:     '\x1b[37m',
    bgCyan:    '\x1b[46m\x1b[30m',
    bgGreen:   '\x1b[42m\x1b[30m',
    bgMagenta: '\x1b[45m\x1b[30m',
    bgYellow:  '\x1b[43m\x1b[30m',
    bgRed:     '\x1b[41m\x1b[37m',
};
const prefix = `${c.bgCyan}${c.bold} Flutcom ${c.reset}`;

// ════════════════════════════════════════════════════════════════════════════
// 2. UTILIDADES
// ════════════════════════════════════════════════════════════════════════════

function clearConsole() {
    process.stdout.write(
        process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
    );
}

/** Obtiene la IP de red local real (WiFi/Ethernet) */
function getLocalIP() {
    const ifaces = os.networkInterfaces();
    for (const name of Object.keys(ifaces)) {
        for (const iface of ifaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

/** Encuentra un puerto libre comenzando desde startPort */
function findFreePort(startPort) {
    return new Promise((resolve) => {
        const server = createServer();
        server.listen(startPort, () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
        server.on('error', () => resolve(findFreePort(startPort + 1)));
    });
}

/** Abre la URL en el navegador predeterminado */
function openBrowser(url) {
    const cmds = { win32: 'start', darwin: 'open', linux: 'xdg-open' };
    const cmd = cmds[process.platform] || 'xdg-open';
    spawn(cmd, [url], { shell: true, stdio: 'ignore', detached: true }).unref();
}

// ════════════════════════════════════════════════════════════════════════════
// 3. BANNER
// ════════════════════════════════════════════════════════════════════════════
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
console.log(`${c.cyan}${deco}${c.reset}`);

// ════════════════════════════════════════════════════════════════════════════
// 4. ARRANQUE CON PUERTO DINÁMICO
// ════════════════════════════════════════════════════════════════════════════
(async () => {
    const port    = await findFreePort(3000);
    const localIP = getLocalIP();
    const localURL   = `http://localhost:${port}/`;
    const networkURL = `http://${localIP}:${port}/`;

    console.log(`  ${c.bold}${c.green}Flutcom Framework${c.reset} ${c.dim}v1.0.3${c.reset}`);
    console.log(`  ${c.dim}┃${c.reset} Author       ${c.magenta}yBlour${c.reset}`);
    console.log(`  ${c.dim}┃${c.reset} Environment  ${c.yellow}development (dev)${c.reset}`);
    console.log(`  ${c.dim}┃${c.reset} Local        ${c.cyan}${localURL}${c.reset}`);
    console.log(`  ${c.dim}┃${c.reset} Network      ${c.cyan}${networkURL}${c.reset}`);
    console.log();
    console.log(`${prefix} ${c.dim}Starting background services...${c.reset}`);
    console.log();
    console.log(`${c.dim}  Shortcuts: [o] open browser  [c] clear console  [q] quit${c.reset}`);
    console.log();

    // ── A) Tailwind CSS (Watch Mode) ─────────────────────────────────────────
    const tailwind = spawn(
        'npx tailwindcss -i ./src/input.css -o ./assets/vendor/tailwind/tailwind.css --watch',
        { stdio: 'pipe', shell: true }
    );
    tailwind.stdout.on('data', (data) => {
        const text = data.toString().trim();
        if (text.includes('Done in')) {
            console.log(`${c.bgMagenta}${c.bold} CSS ${c.reset} ${c.magenta}Styles compiled successfully${c.reset}`);
        }
    });
    tailwind.stderr.on('data', (data) => {
        const text = data.toString().trim();
        if (text.includes('Rebuilding')) {
            console.log(`${c.bgYellow}${c.bold} WAIT ${c.reset} ${c.yellow}Rebuilding CSS...${c.reset}`);
        } else if (text.includes('Done')) {
            console.log(`${c.bgMagenta}${c.bold} CSS ${c.reset} ${c.magenta}Styles updated.${c.reset}`);
        }
    });

    // ── B) Servidor Web con puerto dinámico ───────────────────────────────────
    const serve = spawn(
        `npx serve . -p ${port}`,
        { stdio: 'pipe', shell: true }
    );
    serve.stdout.on('data', (data) => {
        if (data.toString().includes('Accepting connections')) {
            console.log(`${c.bgGreen}${c.bold} SERVER ${c.reset} ${c.green}Ready → ${localURL}${c.reset}`);
            if (port !== 3000) {
                console.log(`${c.bgYellow}${c.bold} INFO ${c.reset} ${c.yellow}Port 3000 was busy — using port ${port}${c.reset}`);
            }
            console.log();
        }
    });

    // ── C) Atajos de Teclado Interactivos ─────────────────────────────────────
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (key) => {
            if (key === 'o' || key === 'O') {
                console.log(`${prefix} ${c.cyan}Opening ${localURL} in your browser...${c.reset}`);
                openBrowser(localURL);
            } else if (key === 'c' || key === 'C') {
                clearConsole();
                console.log(`${prefix} ${c.green}Console cleared.${c.reset}`);
            } else if (key === 'q' || key === 'Q' || key === '\u0003') {
                shutdown();
            }
        });
    }

    // ── D) Cierre limpio ──────────────────────────────────────────────────────
    function shutdown() {
        console.log();
        console.log(`${prefix} ${c.yellow}Closing services... See you later! 👋${c.reset}`);
        tailwind.kill();
        serve.kill();
        process.exit(0);
    }
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})();
