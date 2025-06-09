# textlint-rule-period-end-of-equation

A textlint rule to enforce periods at the end of LaTeX math environments in academic writing.

## Installation

### From npm (when published)
```bash
npm install textlint-rule-period-end-of-equation
```

### Local development/usage

1. **Clone and build the rule:**
   ```bash
   git clone <this-repo>
   cd period-endof-equation
   pnpm install
   pnpm run build
   ```

2. **Install textlint globally:**
   ```bash
   npm install -g textlint
   ```

3. **Link the rule locally:**
   ```bash
   # In the rule directory
   npm link
   
   # In your document directory
   npm link textlint-rule-period-end-of-equation
   ```

4. **Create a `.textlintrc` file in your document directory:**
   ```json
   {
     "plugins": ["@textlint/markdown"],
     "rules": {
       "period-end-of-equation": true
     }
   }
   ```

5. **Run textlint on your documents:**
   ```bash
   # Check a single file
   textlint your-document.md
   
   # Check and auto-fix
   textlint --fix your-document.md
   
   # Check all markdown files
   textlint "**/*.md"
   ```

## Configuration Options

You can customize which math environments to check:

```json
{
  "rules": {
    "period-end-of-equation": {
      "allowedMathEnvironments": ["equation", "align", "gather", "multline"]
    }
  }
}
```

## Alternative: Direct usage without global installation

If you prefer not to install textlint globally:

1. **Install textlint locally in your document project:**
   ```bash
   # In your document directory
   npm init -y
   npm install textlint @textlint/textlint-plugin-markdown
   npm link textlint-rule-period-end-of-equation
   ```

2. **Add scripts to your `package.json`:**
   ```json
   {
     "scripts": {
       "lint": "textlint *.md",
       "lint:fix": "textlint --fix *.md"
     }
   }
   ```

3. **Run with npm:**
   ```bash
   npm run lint
   npm run lint:fix
   ```

## What it checks

This rule enforces periods at the end of LaTeX math environments:

- Display math: `$$...$$`
- Display math: `\[...\]`
- Environment-based math: `\begin{equation}...\end{equation}`, `\begin{align}...\end{align}`, etc.

### Valid examples

```latex
This is correct: $$x = y + z.$$

Another correct example: \[a = b + c.\]

\begin{equation}
E = mc^2.
\end{equation}
```

### Invalid examples

```latex
This is wrong: $$x = y + z$$

Another wrong example: \[a = b + c\]

\begin{equation}
E = mc^2
\end{equation}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## License

MIT