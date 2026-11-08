const { execSync }     = require('child_process');
const fs               = require('fs');
const path             = require('path');
const { pathToFileURL } = require('url');

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
        { name: 'robots.txt',        type: 'file', optional: true  },
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

    // ── 4. Generar sitemap.xml dinámico desde flutcom.config.js ─────────────
    console.log(`${c.cyan}◆${c.reset} Generating sitemap.xml from routes...`);
    try {
        const configUrl = pathToFileURL(path.join(rootDir, 'flutcom.config.js')).href;
        const { routes, site } = await import(configUrl);
        const baseUrl = (site.url || '').replace(/\/$/, '');
        const today   = new Date().toISOString().split('T')[0];

        const urlEntries = [
            // Raíz siempre incluida con prioridad máxima
            `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
            // Una entrada por cada ruta pública
            ...Object.keys(routes).map((key, i) => {
                const r = routes[key];
                // Omitir rutas marcadas como noindex
                const robots = typeof r === 'object' ? (r.robots || '') : '';
                if (robots.includes('noindex')) return null;
                const priority = i === 0 ? '0.9' : '0.8';
                return `  <url>\n    <loc>${baseUrl}/#${key}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
            }).filter(Boolean),
        ];

        const sitemapXml =
            `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            urlEntries.join('\n') + '\n' +
            `</urlset>\n`;

        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
        // También actualizar la copia fuente para mantenerla en sync
        fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf8');
        copiedFiles++;
        console.log(`  ${c.green}✓${c.reset} Generated ${c.bold}sitemap.xml${c.reset} ${c.dim}(${Object.keys(routes).length + 1} URLs)${c.reset}`);
    } catch (err) {
        console.warn(`  ${c.yellow}⚠${c.reset} Could not auto-generate sitemap.xml: ${err.message}`);
        // Fallback: copiar el sitemap.xml existente si lo hay
        const sitemapSrc = path.join(rootDir, 'sitemap.xml');
        if (fs.existsSync(sitemapSrc)) {
            fs.copyFileSync(sitemapSrc, path.join(distDir, 'sitemap.xml'));
            copiedFiles++;
            console.log(`  ${c.green}✓${c.reset} Copied ${c.bold}sitemap.xml${c.reset} ${c.dim}(fallback)${c.reset}`);
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
