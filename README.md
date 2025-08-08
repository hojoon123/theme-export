<div align="center">

# 🎨 Theme Extractor

**AI-Powered Web Design System Extraction Tool**

[![GitHub Stars](https://img.shields.io/github/stars/hojoon123/theme-export?style=for-the-badge&logo=github&color=yellow)](https://github.com/hojoon123/theme-export/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-orange?style=for-the-badge&logo=playwright)](https://playwright.dev/)

*Automatically extract complete design systems, themes, and CSS variables from any website with just one command* ✨

[✨ **Try it now**](#-quick-start) | [📖 **Documentation**](#-documentation) | [🎯 **Examples**](#-what-gets-extracted) | [🤝 **Contribute**](#-contributing)

</div>

---

## 🚀 What is Theme Extractor?

Theme Extractor is a powerful automation tool that **reverse-engineers any website's design system** in seconds. Perfect for developers, designers, and anyone who wants to understand how beautiful websites are built.

### ✨ Why use Theme Extractor?

- 🎯 **One-click extraction** - Get complete design systems instantly
- 🎨 **Professional quality** - Extract production-ready design tokens  
- 🔍 **Deep analysis** - CSS variables, component styles, typography scales
- 📱 **Screenshot included** - Visual reference alongside data
- 🌍 **Any website** - Works with modern websites using CSS-in-JS, CSS variables, etc.
- 💻 **Developer friendly** - Clean JSON output ready for your design system

---

## 🎯 What Gets Extracted

<details>
<summary>🎨 <strong>Color System</strong></summary>

- Primary, secondary, accent colors
- Background and surface colors  
- Text colors (primary, secondary, muted)
- Border and outline colors
- CSS custom properties for colors
</details>

<details>
<summary>✍️ <strong>Typography System</strong></summary>

- Font families and fallbacks
- Font sizes, weights, and line heights
- Letter spacing and text transforms
- Heading scales (H1-H6)
- Body text styles
</details>

<details>
<summary>📐 <strong>Spacing & Layout</strong></summary>

- Margin and padding scales
- Gap and grid systems
- Border radius values
- Box shadows and effects
- Flexbox and Grid properties
</details>

<details>
<summary>🧩 <strong>Component Styles</strong></summary>

- Button variants and states
- Card and panel designs
- Navigation elements
- Form controls
- Interactive elements
</details>

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/hojoon123/theme-export.git
cd theme-export

# Install dependencies
npm install
```

### Basic Usage

```bash
# Extract theme from any website
node extract-linear-theme.js
```

### 📁 Output Files

After running, you'll get:

- `📄 linear-theme-YYYY-MM-DD.json` - Complete design system data
- `📸 linear-screenshot-YYYY-MM-DD.png` - Full page screenshot

---

## 🛠️ Customization

### 🎯 Target Different Websites

Simply change the URL in `extract-linear-theme.js`:

```javascript
await page.goto('https://your-target-website.com/', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
```

### 🔧 Extract Specific Elements

Use the built-in `extractSpecificElements` function:

```javascript
extractSpecificElements([
  '.primary-button',
  '.hero-section', 
  '.navigation',
  '.card-component'
]).then(data => console.log(data));
```

### ⚙️ Advanced Configuration

```javascript
// Increase loading time for heavy websites
await page.waitForTimeout(10000);

// Add custom selectors
navigation: document.querySelector('nav, header, [data-nav], .your-nav-class'),

// Run in headless mode
const browser = await chromium.launch({ headless: true });
```

---

## 📊 Sample Output Structure

```json
{
  "body": {
    "colors": {
      "backgroundColor": "rgb(8, 9, 10)",
      "color": "rgb(247, 248, 248)"
    },
    "typography": {
      "fontFamily": "Inter Variable, SF Pro Display",
      "fontSize": "16px",
      "fontWeight": "400"
    }
  },
  "cssVariables": {
    "--color-primary": "#5e6ad2",
    "--color-bg-primary": "#08090a",
    "--font-size-large": "1.125rem",
    "--radius-rounded": "9999px"
  },
  "buttons": [
    {
      "className": "primary-button",
      "colors": { "backgroundColor": "#5e6ad2" },
      "borderRadius": "8px"
    }
  ]
}
```

---

## 💡 Use Cases

### 🎨 **For Designers**
- Research design trends and patterns
- Create design system documentation  
- Analyze competitor interfaces
- Build mood boards and style guides

### 👩‍💻 **For Developers**
- Reverse-engineer CSS architectures
- Extract design tokens for your own projects
- Learn from well-designed websites
- Build component libraries

### 🏢 **For Teams**
- Standardize design systems across projects
- Document existing website styles
- Create consistent brand guidelines
- Onboard new team members faster

---

## 🔧 Troubleshooting

<details>
<summary><strong>🐌 Website loads slowly</strong></summary>

Increase the timeout duration:
```javascript
await page.waitForTimeout(15000); // 15 seconds
```
</details>

<details>
<summary><strong>🔍 Missing specific elements</strong></summary>

Add custom selectors:
```javascript
navigation: document.querySelector('nav, header, [role="navigation"], .your-nav-class'),
```
</details>

<details>
<summary><strong>🚫 Browser won't open</strong></summary>

Try headless mode:
```javascript
const browser = await chromium.launch({ headless: true });
```
</details>

<details>
<summary><strong>❌ Script fails on certain websites</strong></summary>

Some websites block automation. Try:
- Different User-Agent strings
- Adding delays between actions
- Using residential proxies
</details>

---

## 🏗️ Built With

- **[Playwright](https://playwright.dev/)** - Web automation and scraping
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **JavaScript** - Core language

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### 🌟 Quick Contributions
- ⭐ **Star this repo** if you find it useful
- 🐛 **Report bugs** via [Issues](https://github.com/hojoon123/theme-export/issues)
- 💡 **Suggest features** you'd like to see
- 📖 **Improve documentation** 

### 🔧 Code Contributions
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 Ideas for Contributions
- Support for more CSS frameworks (Tailwind, Bootstrap, etc.)
- Export to different formats (Figma tokens, Sketch, etc.)
- GUI interface for non-technical users
- Batch processing for multiple websites
- Integration with popular design tools

---

## 📋 Requirements

- **Node.js** 14.0 or higher
- **npm** or **yarn**
- **Internet connection**
- **Modern browser** (Chromium-based)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by design systems from Linear, Figma, and other beautiful websites
- Built with love for the design and development community
- Special thanks to all contributors and users

---

<div align="center">

### 🌟 If this tool helped you, please consider giving it a star!

[![GitHub Stars](https://img.shields.io/github/stars/hojoon123/theme-export?style=social)](https://github.com/hojoon123/theme-export/stargazers)

**Made with ❤️ by [hojoon123](https://github.com/hojoon123)**

[⬆ Back to top](#-theme-extractor)

</div>
