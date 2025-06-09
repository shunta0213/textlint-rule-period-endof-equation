"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reporter = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource } = context;
    const allowedMathEnvironments = options.allowedMathEnvironments || [
        "equation",
        "align",
        "gather",
        "multline",
        "split",
        "eqnarray",
    ];
    const allowedPunctuation = options.allowedPunctuation || [
        ".", ",", ";", "!", "?"
    ];
    // Regex patterns for different LaTeX math environments
    const mathPatterns = [
        // Display math: $$...$$
        /\$\$([\s\S]*?)\$\$/g,
        // Display math: \[...\]
        /\\\[([\s\S]*?)\\\]/g,
        // Environment-based math: \begin{equation}...\end{equation}, etc.
        new RegExp(`\\\\begin\\{(${allowedMathEnvironments.join("|")}[*]?)\\}([\\s\\S]*?)\\\\end\\{\\1\\}`, "g"),
    ];
    return {
        [Syntax.Document](node) {
            const text = getSource(node);
            mathPatterns.forEach((pattern) => {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    const fullMatch = match[0];
                    const mathContent = match[match.length - 1]; // Get the last capture group
                    const startIndex = match.index;
                    const endIndex = startIndex + fullMatch.length;
                    // Check if the math environment ends with punctuation
                    if (!hasPunctuationAtEnd(mathContent, fullMatch, allowedPunctuation)) {
                        // For environment-based math, we want to insert before \end{...}
                        let insertIndex = endIndex - 1;
                        if (fullMatch.includes("\\end{")) {
                            const endMatch = fullMatch.match(/\\end\{[^}]+\}$/);
                            if (endMatch) {
                                insertIndex = startIndex + fullMatch.indexOf(endMatch[0]);
                            }
                        }
                        const error = new RuleError("LaTeX math environment should end with punctuation", {
                            index: insertIndex,
                            fix: context.fixer
                                ? context.fixer.insertTextAfterRange([insertIndex, insertIndex], ".")
                                : undefined,
                        });
                        report(node, error);
                    }
                }
            });
        },
    };
};
function hasPunctuationAtEnd(mathContent, fullMatch, allowedPunctuation) {
    // Clean up the math content by removing whitespace and LaTeX commands at the end
    const trimmedContent = mathContent.trim();
    // Check if it ends with any of the allowed punctuation marks
    const escapedPunctuation = allowedPunctuation.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const punctuationRegex = new RegExp(`[${escapedPunctuation.join('')}]$`);
    if (punctuationRegex.test(trimmedContent)) {
        return true;
    }
    // Special case: if the math environment is empty or only contains whitespace/labels
    if (trimmedContent === "" ||
        trimmedContent.match(/^\s*\\label\{[^}]*\}\s*$/)) {
        return true;
    }
    return false;
}
exports.default = reporter;
//# sourceMappingURL=index.js.map