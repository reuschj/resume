# Resume

Master HTML resumes for Justin Alexander Reusch, with downloadable PDFs and continuous deployment to GitHub Pages.

Supports multiple resume variations sharing unified styling, theming, dynamic controls, and PDF downloads:
- **Software Engineering** (`dev.html`) &ndash; Tailored for senior frontend, full-stack, and software engineering roles.
- **Creative** (`creative.html`) &ndash; Tailored for visual design, multimedia production, brand messaging, UI/UX, and digital content.
- **Film & Video Production** (`film.html`) &ndash; Tailored for directing, cinematography, lighting, video editing, and motion graphics.
- **General Purpose** (`general.html`) &ndash; Balanced, comprehensive resume highlighting cross-functional leadership across engineering, creative media, product marketing, and business analysis.

## Repository Structure

```
resume/
├── .github/workflows/
│   └── publish.yml       # GitHub Actions deployment to Pages
├── css/
│   ├── themes.css        # Base variables, dark mode, and 7 color palette presets
│   ├── resume.css        # Typography, layout, entry components, print engine & @page rules
│   └── controls.css      # Floating bottom toolbar, selectors, and download button
├── js/
│   └── controls.js       # Theming engine (system/light/dark), color switcher, persistence & conditional navigation
├── index.html            # Directory portal linking to all resume variations
├── dev.html              # Software Engineering resume
├── creative.html         # Creative & Multimedia Production resume
├── film.html             # Film & Video Production resume
├── general.html          # General-purpose master resume
└── README.md             # Project documentation
```

## Modular Architecture & Shared Components

- **Static Web Architecture**: Pure HTML5, CSS3, and vanilla JavaScript. Simply open any `.html` file directly in a web browser.
- **CSS Separation**:
  - `css/themes.css`: Defines the `:root` and `[data-theme="dark"]` CSS variables along with all color themes (`neutral`, `cherry`, `strawberry`, `orange`, `lemon`, `lime`, `blueberry`, `grape`).
  - `css/resume.css`: Handles core typography (Merriweather headers and Inter body), layout containers, job entries, multi-role stacking, responsive mobile adjustments, variation card visibility flags, and print layout rules (`@media print`, page break avoidance, margin rules).
  - `css/controls.css`: Styles the interactive bottom controls bar, theme dropdowns, Back button, and PDF download button.
- **Landing Page & Variation Flagging**:
  - `index.html` functions as the sole resume directory picker.
  - Cards in `index.html` use `data-enabled="true"` / `data-enabled="false"` flags. Variations set to `data-enabled="false"` are cleanly hidden from the landing page until ready to be turned back on.
- **Shared Theming Engine & Conditional Navigation (`js/controls.js`)**:
  - Manages OS theme synchronization (`prefers-color-scheme`), manual mode toggling, color theme selection, and persists choices in `localStorage` across all pages.
  - **Conditional Back Navigation**: When a visitor clicks into a resume from the landing page, a "Back" button appears in the bottom bar to return to `index.html`. When an employer is provided a direct link to a specific resume (e.g. `dev.html`), no Back button or version picker is shown, restricting access strictly to the targeted resume.
- **Adding a New Resume Variation**:
  1. Duplicate any existing resume HTML file to a new HTML file.
  2. Customize the content inside `<main class="page-container">`.
  3. Add a corresponding `<article class="variation-card" data-enabled="true">` card in `index.html`.
  4. Link the printable PDF in the floating controls bar's download button (`<a class="btn-download">`).

## Viewing Locally

Open any `.html` file directly in your web browser:
- Double-click `index.html` (portal), `dev.html`, `creative.html`, `film.html`, or `general.html`.

### PDF Downloads
Each resume page features a **Download PDF** button in the floating bottom controls bar linking directly to its printable PDF. You can also print directly from any browser (`Cmd+P` / `Ctrl+P`), which formats the document using the integrated `@media print` styles.

## GitHub Pages Deployment

The automated workflow in `.github/workflows/publish.yml` publishes the site and PDFs directly to GitHub Pages on every push to `main`.
