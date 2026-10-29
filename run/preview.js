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
    bgYellow:  '\x1b[43m\x1b[30m',
};
const prefix = `${c.bgCyan}${c.bold} Flutcom Preview ${c.reset}`;

// ════════════════════════════════════════════════════════════════════════════
// 2. UTILIDADES
// ════════════════════════════════════════════════════════════════════════════
function clearConsole() {
    process.stdout.write(
        process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
    );
}

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

function openBrowser(url) {
    const cmds = { win32: 'start', darwin: 'open', linux: 'xdg-open' };
    const cmd = cmds[process.platform] || 'xdg-open';
    spawn(cmd, [url], { shell: true, stdio: 'ignore', detached: true }).unref();
}

// ════════════════════════════════════════════════════════════════════════════
// 3. ARRANQUE DEL SERVIDOR DE PREVIEW
// ════════════════════════════════════════════════════════════════════════════
(async () => {
    const rootDir = path.resolve(__dirname, '..');
    const distDir = path.join(rootDir, 'dist');

    clearConsole();

    // Comprobar si dist existe
    if (!fs.existsSync(distDir)) {
        console.log();
        console.log(`${c.bgYellow}${c.bold} WARNING ${c.reset} ${c.yellow}No "dist" directory found.${c.reset}`);
        console.log(`Please run the build script first:`);
        console.log(`  ${c.cyan}npm run build${c.reset}`);
        console.log();
        process.exit(1);
    }

    const port    = await findFreePort(4173);
    const localIP = getLocalIP();
    const localURL   = `http://localhost:${port}/`;
    const networkURL = `http://${localIP}:${port}/`;

    console.log();
    console.log(`${prefix} ${c.bold}${c.green}Production Preview Mode${c.reset}`);
    console.log(`  ${c.dim}Serving directory: ${distDir}${c.reset}`);
    console.log(`  ${c.dim}┃${c.reset} Local    ${c.cyan}${localURL}${c.reset}`);
    console.log(`  ${c.dim}┃${c.reset} Network  ${c.cyan}${networkURL}${c.reset}`);
    console.log();
    console.log(`${c.dim}  Shortcuts: [o] open browser  [c] clear console  [q] quit${c.reset}`);
    console.log();

    const serve = spawn(`npx serve dist -p ${port}`, {
        cwd: rootDir,
        stdio: 'pipe',
        shell: true
    });

    serve.stdout.on('data', (data) => {
        if (data.toString().includes('Accepting connections')) {
            console.log(`${c.bgGreen}${c.bold} PREVIEW READY ${c.reset} ${c.green}Live at ${localURL}${c.reset}`);
            console.log();
        }
    });

    // Atajos de teclado interactivos
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (key) => {
            if (key === 'o' || key === 'O') {
                console.log(`${prefix} ${c.cyan}Opening ${localURL} in browser...${c.reset}`);
                openBrowser(localURL);
            } else if (key === 'c' || key === 'C') {
                clearConsole();
                console.log(`${prefix} ${c.green}Console cleared.${c.reset}`);
            } else if (key === 'q' || key === 'Q' || key === '\u0003') {
                shutdown();
            }
        });
    }

    function shutdown() {
        console.log();
        console.log(`${prefix} ${c.yellow}Stopping preview server... 👋${c.reset}`);
        serve.kill();
        process.exit(0);
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})();
