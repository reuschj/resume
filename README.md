# Resume

Master HTML resumes for Justin Alexander Reusch, with automated PDF generation via Puppeteer and continuous deployment to GitHub Pages.

Supports multiple resume variations sharing unified styling, theming, dynamic controls, and PDF export:
- **Software Engineering** (`dev.html`) &ndash; Tailored for senior frontend, full-stack, and software engineering roles.
- **Creative** (`creative.html`) &ndash; Tailored for visual design, multimedia production, brand messaging, UI/UX, and digital content.
- **Film & Video Production** (`film.html`) &ndash; Tailored for directing, cinematography, lighting, video editing, and motion graphics.
- **General Purpose** (`general.html`) &ndash; Balanced, comprehensive resume highlighting cross-functional leadership across engineering, creative media, product marketing, and business analysis.

## Repository Structure

```
resume/
├── .github/workflows/
│   └── publish.yml       # GitHub Actions pipeline (generates PDFs & deploys to Pages)
├── css/
│   ├── themes.css        # Base variables, dark mode, and 7 color palette presets
│   ├── resume.css        # Typography, layout, entry components, print engine & @page rules
│   └── controls.css      # Floating bottom toolbar, selectors, and download button
├── js/
│   └── controls.js       # Theming engine (system/light/dark), color switcher, persistence & resume routing
├── scripts/
│   ├── export-pdf.js     # Headless Puppeteer script generating print-ready PDFs
│   └── logger.js         # Logging utility for CLI output
├── index.html            # Directory portal linking to all resume variations
├── dev.html              # Software Engineering resume
├── creative.html         # Creative & Multimedia Production resume
├── film.html             # Film & Video Production resume
├── general.html          # General-purpose master resume
├── package.json          # Dependencies and PDF export scripts
├── pnpm-lock.yaml        # Pinned pnpm lockfile
└── README.md             # Project documentation
```

## Modular Architecture & Shared Components

- **Zero-Build Static HTML**: The resumes are pure HTML5, CSS3, and vanilla JavaScript. They require no compilation, bundler, or build step—simply open any `.html` file directly in a web browser.
- **CSS Separation**:
  - `css/themes.css`: Defines the `:root` and `[data-theme="dark"]` CSS variables along with all color themes (`neutral`, `cherry`, `strawberry`, `orange`, `lemon`, `lime`, `blueberry`, `grape`).
  - `css/resume.css`: Handles core typography (Merriweather headers and Inter body), layout containers, job entries, multi-role stacking, responsive mobile adjustments, and print layout rules (`@media print`, page break avoidance, margin rules).
  - `css/controls.css`: Styles the interactive bottom controls bar, theme dropdowns, and PDF download button.
- **Shared Theming Engine (`js/controls.js`)**:
  - Manages OS theme synchronization (`prefers-color-scheme`), manual mode toggling, color theme selection, and persists choices in `localStorage` across all pages.
  - Handles the variation switcher to easily navigate between different resume versions (`dev.html`, `creative.html`, `film.html`, `general.html`).
- **Adding a New Resume Variation**:
  1. Duplicate any existing resume HTML file to a new HTML file.
  2. Customize the content inside `<main class="page-container">`.
  3. Add an `<option>` to the `<select id="resumeToggle">` across pages.
  4. Register the new resume file and its target PDF in `scripts/export-pdf.js`.

## Viewing & Local Development

### 1. Direct Viewing (No Build Required)
Because these are simple static files, you can open any of them directly in your web browser:
* Double-click `index.html` (portal), `dev.html`, `creative.html`, `film.html`, or `general.html`.
* Or run any simple local HTTP server:
  ```bash
  python3 -m http.server 8000
  # or
  npx serve .
  ```

### 2. Generating PDFs
When you want to update the printable PDFs locally:
```bash
# Install Puppeteer (only dependency)
pnpm install

# Generate PDFs directly in the repo root
pnpm run pdf
```
This renders and saves the PDFs right alongside the HTML files where the download buttons link:
- `Justin_Alexander_Reusch_Dev_Resume.pdf` (from `dev.html`)
- `Justin_Alexander_Reusch_Creative_Resume.pdf` (from `creative.html`)
- `Justin_Alexander_Reusch_Film_Resume.pdf` (from `film.html`)
- `Justin_Alexander_Reusch_Resume.pdf` (from `general.html`)
- `Justin_Alexander_Reusch_General_Resume.pdf` (alias copy of general resume)

## GitHub Pages Deployment

The automated workflow in `.github/workflows/publish.yml` triggers on every push to `main`:
1. Checks out the code and sets up Node.js with `pnpm`.
2. Installs dependencies using `pnpm install --frozen-lockfile`.
3. Runs `pnpm run pdf` to generate fresh PDFs.
4. Stages the HTML, CSS, JS, and PDFs for deployment and publishes directly to GitHub Pages.
