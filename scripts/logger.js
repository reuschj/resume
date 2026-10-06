/**
 * Utility function to generate formatted step header strings.
 *
 * @param {number|string|{ step: number|string, title: string }} stepOrConfig - The step number, config object, or full step text.
 * @param {string} [title] - The step description/title.
 * @returns {string} Formatted step header string, e.g. "=== Step 1: Generating PDFs ==="
 */
export function formatStep(stepOrConfig, title) {
    if (typeof stepOrConfig === 'object' && stepOrConfig !== null) {
        return formatStep(stepOrConfig.step, stepOrConfig.title);
    }

    if (title === undefined) {
        return `=== ${stepOrConfig} ===`;
    }

    return `=== Step ${stepOrConfig}: ${title} ===`;
}

/**
 * General application logger with support for step formatting.
 */
export class Logger {
    constructor() {
        this._currentStep = 0;
    }

    /**
     * Formats a step header.
     *
     * @param {number|string|{ step: number|string, title: string }} stepOrConfig
     * @param {string} [title]
     * @returns {string}
     */
    formatStep(stepOrConfig, title) {
        return formatStep(stepOrConfig, title);
    }

    /**
     * Logs a formatted step banner.
     *
     * Supports either:
     * - `logger.step(1, 'Generating PDFs')`
     * - `logger.step('Generating PDFs')` (auto-increments step count)
     * - optional `{ newline: boolean }` parameter to control leading newline
     *
     * @param {number|string} stepOrTitle - Step number or step title if auto-incrementing.
     * @param {string|{ newline?: boolean }} [titleOrOptions] - Step title or options object.
     * @param {{ newline?: boolean }} [options] - Options object.
     * @returns {string} The formatted step string that was logged.
     */
    step(stepOrTitle, titleOrOptions, options = {}) {
        let stepNum;
        let stepTitle;
        let opts = options;

        if (typeof titleOrOptions === 'string') {
            stepNum = stepOrTitle;
            stepTitle = titleOrOptions;
        } else {
            // Auto-increment step number
            this._currentStep += 1;
            stepNum = this._currentStep;
            stepTitle = stepOrTitle;
            if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
                opts = titleOrOptions;
            }
        }

        if (typeof stepNum === 'number') {
            this._currentStep = stepNum;
        } else if (!Number.isNaN(Number(stepNum))) {
            this._currentStep = Number(stepNum);
        }

        const formatted = this.formatStep(stepNum, stepTitle);
        const shouldAddLeadingNewline = opts.newline !== undefined
            ? Boolean(opts.newline)
            : (typeof stepNum === 'number' && stepNum > 1);

        const prefix = shouldAddLeadingNewline ? '\n' : '';
        this.log(`${prefix}${formatted}`);
        return formatted;
    }

    /**
     * Resets internal auto-increment step counter.
     * @param {number} [start=0]
     */
    resetStep(start = 0) {
        this._currentStep = start;
    }

    log(...args) {
        console.log(...args);
    }

    info(...args) {
        console.info(...args);
    }

    warn(...args) {
        console.warn(...args);
    }

    error(...args) {
        console.error(...args);
    }

    success(...args) {
        console.log(...args);
    }
}

export const logger = new Logger();
export default logger;
