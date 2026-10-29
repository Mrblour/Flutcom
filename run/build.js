const { execSync } = require('child_process');
const fs           = require('fs');
const path         = require('path');

// ─── Asegurar Node.js en PATH (Windows) ──────────────────────────────────────
if (process.platform === 'win32') {
    const nodeDefaultPath = 'C:\\Program Files\\nodejs';
    if (fs.existsSync(nodeDefaultPath) && !process.env.PATH.includes(nodeDefaultPath)) {
        process.env.PATH = `${nodeDefaultPath};${process.env.PATH}`;
    }
}

// ════════════════════════════════════════════════════════════════════════════
// COLORES ANSI & FORMATO
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
    bgMagenta: '\x1b[45m\x1b[30m',
};
const prefix = `${c.bgCyan}${c.bold} Flutcom ${c.reset}`;

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(src)) return 0;
    fs.mkdirSync(dest, { recursive: true });
    let count = 0;
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            count += copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            count++;
        }
    }
    return count;
}

function getDirStats(dirPath) {
    let totalSize = 0;
    let fileCount = 0;

    function traverse(currentPath) {
        if (!fs.existsSync(currentPath)) return;
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                traverse(fullPath);
            } else {
                fileCount++;
                totalSize += fs.statSync(fullPath).size;
            }
        }
    }

    traverse(dirPath);
    return { totalSize, fileCount };
}

// ════════════════════════════════════════════════════════════════════════════
// BUILD PROCESS
// ════════════════════════════════════════════════════════════════════════════
(async () => {
    const startTime = Date.now();
    const rootDir   = path.resolve(__dirname, '..');
    const distDir   = path.join(rootDir, 'dist');

    console.log();
    console.log(`${prefix} ${c.bold}${c.green}Starting production build...${c.reset}`);
    console.log(`  ${c.dim}Target directory: ${distDir}${c.reset}`);
    console.log();

    // ── 1. Compilar Tailwind CSS para producción ────────────────────────────
    console.log(`${c.bgMagenta}${c.bold} CSS ${c.reset} ${c.magenta}Compiling & minifying Tailwind CSS...${c.reset}`);
    try {
        execSync(
            'npx tailwindcss -i ./src/input.css -o ./assets/vendor/tailwind/tailwind.css --minify',
            { cwd: rootDir, stdio: 'pipe' }
        );
        const cssPath = path.join(rootDir, 'assets/vendor/tailwind/tailwind.css');
        const cssSize = fs.existsSync(cssPath) ? fs.statSync(cssPath).size : 0;
        console.log(`  ${c.green}✓${c.reset} CSS minified (${formatBytes(cssSize)})`);
    } catch (err) {
        console.error(`${c.red}✖ Failed to build Tailwind CSS:${c.reset}`, err.message);
        process.exit(1);
    }

    // ── 2. Limpiar / Crear carpeta dist ──────────────────────────────────────
    console.log(`${c.cyan}◆${c.reset} Preparing distribution folder...`);
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });

    // ── 3. Copiar recursos requeridos al dist ────────────────────────────────
    const itemsToCopy = [
        { name: 'index.html',        type: 'file', optional: false },
        { name: 'flutcom.config.js', type: 'file', optional: false },
        { name: 'flutcom',           type: 'dir',  optional: false },
        { name: 'resources',         type: 'dir',  optional: false },
        { name: 'assets',            type: 'dir',  optional: false },
        { name: 'plugins',           type: 'dir',  optional: true  },
    ];

    let copiedFiles = 0;
    for (const item of itemsToCopy) {
        const srcPath = path.join(rootDir, item.name);
        const destPath = path.join(distDir, item.name);

        if (!fs.existsSync(srcPath)) {
            if (!item.optional) {
                console.error(`${c.red}✖ Missing required build asset:${c.reset} ${item.name}`);
            }
            continue;
        }

        if (item.type === 'dir') {
            const count = copyDirRecursive(srcPath, destPath);
            copiedFiles += count;
            console.log(`  ${c.green}✓${c.reset} Copied ${c.bold}${item.name}/${c.reset} ${c.dim}(${count} files)${c.reset}`);
        } else {
            fs.copyFileSync(srcPath, destPath);
            copiedFiles++;
            console.log(`  ${c.green}✓${c.reset} Copied ${c.bold}${item.name}${c.reset}`);
        }
    }

    // ── 4. Resumen final ────────────────────────────────────────────────────
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const { totalSize, fileCount } = getDirStats(distDir);

    console.log();
    console.log(`${c.bgGreen}${c.bold} SUCCESS ${c.reset} ${c.green}${c.bold}Build completed in ${duration}s!${c.reset}`);
    console.log(`  ${c.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`);
    console.log(`  ${c.bold}Files:${c.reset}       ${c.cyan}${fileCount}${c.reset}`);
    console.log(`  ${c.bold}Total Size:${c.reset}  ${c.cyan}${formatBytes(totalSize)}${c.reset}`);
    console.log(`  ${c.bold}Output:${c.reset}      ${c.dim}${distDir}${c.reset}`);
    console.log(`  ${c.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`);
    console.log();
    console.log(`  To preview your production build locally:`);
    console.log(`  ${c.cyan}$ npm run preview${c.reset}`);
    console.log();
})();
