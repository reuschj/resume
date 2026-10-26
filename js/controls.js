/**
 * Resume UI Controls & Theming Engine
 * Manages mode switching (system/light/dark), color palettes, conditional navigation, and themed PDF downloads.
 */
(function () {
    const root = document.documentElement;

    function updateDownloadLinks(color) {
        const activeColor = color || "neutral";
        const downloadLinks = document.querySelectorAll("a[download], .btn-download, .btn-pdf");
        downloadLinks.forEach(function (link) {
            let basePdf = link.getAttribute("data-base-pdf");
            if (!basePdf) {
                const currentHref = link.getAttribute("href") || "";
                const match = currentHref.match(/^(.+?)(?:_(?:neutral|blueberry|lime|cherry|strawberry|orange|lemon|grape))?.pdf$/i);
                if (match) {
                    basePdf = match[1];
                    link.setAttribute("data-base-pdf", basePdf);
                }
            }

            if (basePdf) {
                const themedFile = (activeColor === "blueberry")
                    ? `${basePdf}.pdf`
                    : `${basePdf}_${activeColor}.pdf`;
                link.setAttribute("href", themedFile);
                link.setAttribute("download", themedFile);
            }
        });
    }

    function applyMode(mode) {
        if (mode === "system") {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.setAttribute("data-theme", isDark ? "dark" : "light");
        } else {
            root.setAttribute("data-theme", mode);
        }
    }

    function applyColor(color) {
        const selectedColor = color || "neutral";
        root.setAttribute("data-color", selectedColor);
        updateDownloadLinks(selectedColor);
    }

    // Apply saved preferences immediately to avoid flash
    const savedMode = localStorage.getItem("resume_mode") || "system";
    const savedColor = localStorage.getItem("resume_color") || "neutral";
    applyMode(savedMode);
    applyColor(savedColor);

    const pathname = window.location.pathname.toLowerCase();
    const isIndexPage = pathname.endsWith("/index.html") || pathname.endsWith("/") || pathname === "";

    // If on the index landing page, record that user reached the directory portal
    if (isIndexPage) {
        try {
            sessionStorage.setItem("navigated_from_index", "true");
        } catch (e) {}
    }

    function checkNavigatedFromIndex() {
        let fromIndex = false;

        // 1. Check URL parameters (e.g. dev.html?from=index)
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get("from") === "index" || params.get("nav") === "index") {
                fromIndex = true;
                try {
                    sessionStorage.setItem("navigated_from_index", "true");
                } catch (e) {}
                // Clean parameter from URL to maintain a pristine address bar
                try {
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                } catch (e) {}
            }
        } catch (e) {}

        // 2. Check sessionStorage
        if (!fromIndex) {
            try {
                if (sessionStorage.getItem("navigated_from_index") === "true") {
                    fromIndex = true;
                }
            } catch (e) {}
        }

        // 3. Check document.referrer (same-origin index page)
        if (!fromIndex && document.referrer) {
            try {
                const refUrl = new URL(document.referrer);
                const currentUrl = new URL(window.location.href);
                if (refUrl.origin === currentUrl.origin) {
                    const refPath = refUrl.pathname.toLowerCase();
                    if (refPath.endsWith("/index.html") || refPath.endsWith("/") || refPath === "") {
                        fromIndex = true;
                        try {
                            sessionStorage.setItem("navigated_from_index", "true");
                        } catch (e) {}
                    }
                }
            } catch (e) {}
        }

        return fromIndex;
    }

    function initControls() {
        const themeSelect = document.getElementById("themeToggle");
        const colorSelect = document.getElementById("colorToggle");
        const backNav = document.getElementById("backNav");

        // On index page, attach click listeners to all view buttons
        if (isIndexPage) {
            document.querySelectorAll(".btn-view").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    try {
                        sessionStorage.setItem("navigated_from_index", "true");
                    } catch (e) {}
                });
            });
        }

        // On resume pages, conditionally reveal the Back button
        if (backNav) {
            if (!isIndexPage && checkNavigatedFromIndex()) {
                backNav.style.display = "inline-flex";
            } else {
                backNav.style.display = "none";
            }
        }

        // Set initial dropdown values
        if (themeSelect) themeSelect.value = savedMode;
        if (colorSelect) colorSelect.value = savedColor;

        // Ensure download links reflect initial color selection
        updateDownloadLinks(savedColor);

        // Listeners for Theme Mode Changes
        if (themeSelect) {
            themeSelect.addEventListener("change", function (event) {
                const mode = event.target.value;
                applyMode(mode);
                localStorage.setItem("resume_mode", mode);
            });
        }

        // Listeners for Color Preset Changes
        if (colorSelect) {
            colorSelect.addEventListener("change", function (event) {
                const color = event.target.value;
                applyColor(color);
                localStorage.setItem("resume_color", color);
            });
        }

        // Auto-update if "system" is selected and OS mode changes
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
            const currentMode = localStorage.getItem("resume_mode") || "system";
            if (currentMode === "system") {
                applyMode("system");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initControls);
    } else {
        initControls();
    }
})();
