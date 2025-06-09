import { TextlintKernel } from "@textlint/kernel";
import markdownPlugin from "@textlint/textlint-plugin-markdown";
import rule from "./index";

describe("period-end-of-equation", () => {
  const kernel = new TextlintKernel();

  test("valid cases", async () => {
    const validTexts = [
      "This is an equation: $$x = y + z.$$",
      "Another equation: \\[a = b + c.\\]",
      "\\begin{equation}\nE = mc^2.\n\\end{equation}",
      "\\begin{align}\nx &= y + z.\n\\end{align}",
      "\\begin{equation}\nf(x) = x^2,\n\\end{equation}",
      "$$g(x) = \\sin(x);$$",
      "$$$$",
      "\\begin{equation}\n\\label{eq:empty}\n\\end{equation}",
    ];

    for (const text of validTexts) {
      const result = await kernel.lintText(text, {
        filePath: "test.md",
        ext: ".md",
        plugins: [
          {
            pluginId: "markdown",
            plugin: markdownPlugin,
            options: {}
          }
        ],
        rules: [
          {
            ruleId: "period-end-of-equation",
            rule: rule,
            options: {}
          }
        ]
      });
      if (result.messages.length > 0) {
        console.log(`Text: "${text}"`);
        console.log('Messages:', result.messages);
      }
      expect(result.messages).toHaveLength(0);
    }
  });

  test("invalid cases", async () => {
    const invalidCases = [
      "This equation has no period: $$x = y + z$$",
      "Missing period: \\[a = b + c\\]",
      "\\begin{equation}\nE = mc^2\n\\end{equation}",
      "\\begin{align}\nx &= y + z\n\\end{align}"
    ];

    for (const text of invalidCases) {
      const result = await kernel.lintText(text, {
        filePath: "test.md",
        ext: ".md",
        plugins: [
          {
            pluginId: "markdown",
            plugin: markdownPlugin,
            options: {}
          }
        ],
        rules: [
          {
            ruleId: "period-end-of-equation",
            rule: rule,
            options: {}
          }
        ]
      });
      expect(result.messages.length).toBeGreaterThan(0);
      expect(result.messages[0].message).toBe("LaTeX math environment should end with a period");
    }
  });
});