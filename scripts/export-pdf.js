import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";
import { logger } from "./logger.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const colorArg = process.argv.find(arg => arg.startsWith("--color=") || arg.startsWith("--theme="));
const specificColor = colorArg ? colorArg.split("=")[1] : (process.env.RESUME_COLOR || null);

const ALL_THEMES = [
    "blueberry",
    "neutral",
    "lime",
    "cherry",
    "strawberry",
    "orange",
    "lemon",
    "grape"
];

const RESUMES = [
    {
        htmlFile: "dev.html",
        pdfFiles: [
            "Justin_Alexander_Reusch_Dev_Resume.pdf"
        ]
    },
    {
        htmlFile: "creative.html",
        pdfFiles: [
            "Justin_Alexander_Reusch_Creative_Resume.pdf"
        ]
    },
    {
        htmlFile: "film.html",
        pdfFiles: [
            "Justin_Alexander_Reusch_Film_Resume.pdf"
        ]
    },
    {
        htmlFile: "general.html",
        pdfFiles: [
            "Justin_Alexander_Reusch_Resume.pdf",
            "Justin_Alexander_Reusch_General_Resume.pdf"
        ]
    }
];

async function exportPdfs() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const themesToExport = specificColor ? [specificColor] : ALL_THEMES;

    try {
        logger.info(`Starting PDF export for themes: ${themesToExport.join(", ")}`);

        for (const resume of RESUMES) {
            const htmlPath = path.join(repoRoot, resume.htmlFile);
            if (!fs.existsSync(htmlPath)) {
                logger.warn(`File not found: ${htmlPath}, skipping.`);
                continue;
            }

            const fileUrl = pathToFileURL(htmlPath).href;
            logger.info(`Loading resume from: ${fileUrl}`);

            const page = await browser.newPage();
            await page.goto(fileUrl, { waitUntil: "networkidle0" });
            await page.evaluateHandle("document.fonts.ready");

            for (const theme of themesToExport) {
                await page.evaluate((col) => {
                    document.documentElement.setAttribute("data-color", col);
                    document.documentElement.setAttribute("data-theme", "light");
                }, theme);

                for (const pdfFileName of resume.pdfFiles) {
                    const baseName = pdfFileName.replace(/\.pdf$/i, "");
                    const themedPdfName = `${baseName}_${theme}.pdf`;
                    const themedPdfPath = path.join(repoRoot, themedPdfName);

                    logger.info(`Generating ${theme} PDF to: ${themedPdfName}`);
                    await page.pdf({
                        path: themedPdfPath,
                        format: "Letter",
                        preferCSSPageSize: true,
                        printBackground: true,
                        margin: { top: "0", right: "0", bottom: "0", left: "0" }
                    });

                    // If exporting default theme (blueberry) or specific target, also update main un-suffixed PDF
                    if (theme === "blueberry" || specificColor) {
                        const defaultPdfPath = path.join(repoRoot, pdfFileName);
                        if (themedPdfPath !== defaultPdfPath) {
                            fs.copyFileSync(themedPdfPath, defaultPdfPath);
                        }
                    }
                }
            }

            await page.close();
        }

        logger.info("All themed PDFs generated successfully.");
    } finally {
        await browser.close();
    }
}

await exportPdfs();
