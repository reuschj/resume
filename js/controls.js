/**
 * Resume UI Controls & Theming Engine
 * Manages mode switching (system/light/dark), color palettes, and resume variation switching.
 */
(function () {
    const root = document.documentElement;

    function applyMode(mode) {
        if (mode === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
            root.setAttribute('data-theme', mode);
        }
    }

    function applyColor(color) {
        root.setAttribute('data-color', color || 'neutral');
    }

    // Apply saved preferences immediately
    const savedMode = localStorage.getItem('resume_mode') || 'system';
    const savedColor = localStorage.getItem('resume_color') || 'neutral';
    applyMode(savedMode);
    applyColor(savedColor);

    function initControls() {
        const themeSelect = document.getElementById('themeToggle');
        const colorSelect = document.getElementById('colorToggle');
        const resumeSelect = document.getElementById('resumeToggle');

        // Set initial dropdown values
        if (themeSelect) themeSelect.value = savedMode;
        if (colorSelect) colorSelect.value = savedColor;

        // Auto-detect current page for resume selector if present
        if (resumeSelect) {
            const path = window.location.pathname.toLowerCase();
            for (let i = 0; i < resumeSelect.options.length; i++) {
                const optVal = resumeSelect.options[i].value.toLowerCase();
                if (path.endsWith(optVal) || (path.endsWith('/') && (optVal.includes('index.html') || optVal === 'index.html'))) {
                    resumeSelect.selectedIndex = i;
                    break;
                }
            }

            resumeSelect.addEventListener('change', function (event) {
                const targetUrl = event.target.value;
                if (targetUrl && !window.location.pathname.endsWith(targetUrl)) {
                    window.location.href = targetUrl;
                }
            });
        }

        // Listeners for Theme Mode Changes
        if (themeSelect) {
            themeSelect.addEventListener('change', function (event) {
                const mode = event.target.value;
                applyMode(mode);
                localStorage.setItem('resume_mode', mode);
            });
        }

        // Listeners for Color Preset Changes
        if (colorSelect) {
            colorSelect.addEventListener('change', function (event) {
                const color = event.target.value;
                applyColor(color);
                localStorage.setItem('resume_color', color);
            });
        }

        // Auto-update if 'system' is selected and OS mode changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            const currentMode = localStorage.getItem('resume_mode') || 'system';
            if (currentMode === 'system') {
                applyMode('system');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initControls);
    } else {
        initControls();
    }
})();
