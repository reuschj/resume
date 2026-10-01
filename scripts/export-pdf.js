const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

(async () => {
    const repoRoot = path.resolve(__dirname, '..');
    const outputDir = path.join(repoRoot, 'dist');
    const outputPath = path.join(outputDir, 'Justin_Alexander_Reusch_Resume.pdf');
    const indexPath = path.join(repoRoot, 'index.html');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileUrl = pathToFileURL(indexPath).href;
    console.log(`Loading resume from: ${fileUrl}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });

        // Ensure web fonts are completely loaded before generating PDF
        await page.evaluateHandle('document.fonts.ready');

        console.log(`Generating PDF to: ${outputPath}`);
        await page.pdf({
            path: outputPath,
            format: 'Letter',
            preferCSSPageSize: true,
            printBackground: false, // Relies on @media print transparent backgrounds
            margin: { top: '0', right: '0', bottom: '0', left: '0' } // Respects CSS @page rules
        });

        console.log('PDF generated successfully.');
    } finally {
        await browser.close();
    }
})();
