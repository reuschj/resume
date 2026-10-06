import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';
import { logger } from './logger.js';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

const RESUMES = [
    {
        htmlFile: 'dev.html',
        pdfFiles: [
            'Justin_Alexander_Reusch_Dev_Resume.pdf'
        ]
    },
    {
        htmlFile: 'creative.html',
        pdfFiles: [
            'Justin_Alexander_Reusch_Creative_Resume.pdf'
        ]
    },
    {
        htmlFile: 'film.html',
        pdfFiles: [
            'Justin_Alexander_Reusch_Film_Resume.pdf'
        ]
    },
    {
        htmlFile: 'general.html',
        pdfFiles: [
            'Justin_Alexander_Reusch_Resume.pdf',
            'Justin_Alexander_Reusch_General_Resume.pdf'
        ]
    }
];

async function exportPdfs() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        for (const resume of RESUMES) {
            const htmlPath = path.join(repoRoot, resume.htmlFile);
            if (!fs.existsSync(htmlPath)) {
                logger.warn(`File not found: ${htmlPath}, skipping.`);
                continue;
            }

            const fileUrl = pathToFileURL(htmlPath).href;
            logger.info(`Loading resume from: ${fileUrl}`);

            const page = await browser.newPage();
            await page.goto(fileUrl, { waitUntil: 'networkidle0' });

            // Ensure web fonts are completely loaded before generating PDF
            await page.evaluateHandle('document.fonts.ready');

            for (const pdfFileName of resume.pdfFiles) {
                const pdfPath = path.join(repoRoot, pdfFileName);

                logger.info(`Generating PDF to: ${pdfPath}`);
                await page.pdf({
                    path: pdfPath,
                    format: 'Letter',
                    preferCSSPageSize: true,
                    printBackground: true,
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                });
            }

            await page.close();
        }

        logger.info('All PDFs generated successfully.');
    } finally {
        await browser.close();
    }
}

await exportPdfs();
