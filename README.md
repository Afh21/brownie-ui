# 🍫 Brownie UI

> A beautiful, modern UI component library for React - Inspired by Pinterest designs

[![npm version](https://img.shields.io/npm/v/@brownie-ui/button.svg)](https://www.npmjs.com/package/@brownie-ui/button)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🎨 **Beautiful by default** - Carefully crafted components with Pinterest-inspired aesthetics
- 🔧 **Fully customizable** - Built with Tailwind CSS and CVA for easy theming
- ♿ **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation
- 📱 **Responsive** - Mobile-first design approach
- ⚡ **Performance** - Tree-shakeable, lightweight, and fast
- 🔥 **TypeScript** - Full type safety and IntelliSense support
- 🎯 **shadcn compatible** - Works seamlessly with shadcn/ui ecosystem

## 🚀 Quick Start

### Prerequisites

- React 18+ or 19+
- Tailwind CSS 3.4+
- TypeScript 5.0+

### Installation

```bash
# Using pnpm (recommended)
pnpm add @brownie-ui/core @brownie-ui/button

# Using npm
npm install @brownie-ui/core @brownie-ui/button

# Using yarn
yarn add @brownie-ui/core @brownie-ui/button
```

### Usage

```tsx
import { Button } from '@brownie-ui/button';

function App() {
  return (
    <div className="p-8">
      <Button variant="primary" size="lg">
        Get Started
      </Button>
      
      <Button variant="glass" className="ml-4">
        Glass Effect
      </Button>
      
      <Button variant="gradient" size="xl" fullWidth>
        Beautiful Gradient
      </Button>
    </div>
  );
}
```

## 🎨 Design Philosophy

Brownie UI draws inspiration from:
- **Rich chocolate palette** - Warm browns, ambers, and earthy tones
- **Pinterest aesthetics** - Glassmorphism, gradients, and soft touches
- **Modern interactions** - Smooth animations and micro-interactions
- **Clean minimalism** - Uncluttered, focused design

## 📚 Available Components

| Component | Status | Description |
|-----------|--------|-------------|
| Button | ✅ Ready | Versatile button with 10+ variants |
| Card | 🚧 Coming soon | Beautiful content containers |
| Input | 🚧 Coming soon | Form inputs with validation |
| Badge | 🚧 Coming soon | Status indicators |
| Avatar | 🚧 Coming soon | User profile pictures |
| Dialog | 🚧 Coming soon | Modal dialogs |
| Dropdown | 🚧 Coming soon | Context menus |

## 🛠️ Development

This is a monorepo managed with:
- **pnpm** - Package manager and workspaces
- **Turborepo** - Build system and caching
- **Storybook** - Component documentation
- **tsup** - TypeScript bundler

### Setup

```bash
# Clone the repository
git clone https://github.com/tu-usuario/brownie-ui.git
cd brownie-ui

# Install dependencies
pnpm install

# Start Storybook for development
pnpm storybook

# Build all packages
pnpm build

# Run type checking
pnpm type-check
```

### Project Structure

```
brownie-ui/
├── apps/
│   └── docs/              # Storybook documentation
├── packages/
│   ├── tsconfig/          # Shared TypeScript configs
│   ├── core/              # Utilities, themes, types
│   ├── button/            # Button component
│   └── ...                # More components
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 🎭 Button Variants

Our Button component comes with unique variants inspired by modern design trends:

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Dark stone background | Standard actions |
| `primary` | Warm amber | Primary CTAs |
| `secondary` | Light stone | Secondary actions |
| `outline` | Bordered style | Alternative actions |
| `ghost` | Transparent | Low emphasis |
| `destructive` | Red background | Danger actions |
| `link` | Text with underline | Navigation |
| `glass` | Frosted glass effect | Modern overlays |
| `gradient` | Amber to orange | Featured CTAs |
| `soft` | Pastel amber | Gentle emphasis |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [shadcn/ui](https://ui.shadcn.com/) - The brilliant component library
- Design inspiration from [Pinterest](https://pinterest.com) creators
- Built with [Tailwind CSS](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/)

---

<p align="center">
  Made with ❤️ and 🍫
</p>
