# Resume

Automated repository housing the master HTML resume for Justin Alexander Reusch, with continuous deployment to GitHub Pages and headless PDF compilation via Puppeteer.

## Repository Structure

```
resume/
├── .github/workflows/
│   └── publish.yml       # GitHub Actions pipeline (builds PDF & deploys to Pages)
├── scripts/
│   └── export-pdf.js     # Puppeteer script generating print-ready PDF
├── .gitignore            # Ignores node_modules, dist, and PDFs
├── index.html            # Master HTML resume
├── package.json          # Puppeteer dependency and build scripts
└── README.md             # Project documentation
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate PDF Locally
Run the export script to generate the PDF from `index.html`:
```bash
npm run build:pdf
```
The compiled PDF will be written to `dist/Justin_Alexander_Reusch_Resume.pdf`.

### 3. Previewing the HTML Resume
You can open `index.html` directly in your browser or run a simple local HTTP server:
```bash
npx serve .
# or
python3 -m http.server 8000
```

## GitHub Pages Deployment

The automated workflow in `.github/workflows/publish.yml` triggers on every push to `main`:
1. Checks out the code and sets up Node.js.
2. Installs Puppeteer.
3. Generates the PDF resume in headless Chrome (`dist/Justin_Alexander_Reusch_Resume.pdf`).
4. Bundles `index.html` and the PDF into `dist/`.
5. Publishes both directly to GitHub Pages.

### Enabling GitHub Pages in Repository Settings
To allow the GitHub Actions workflow to publish your site:
1. Go to your GitHub repository -> **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
