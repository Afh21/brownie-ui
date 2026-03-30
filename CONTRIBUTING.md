# Contributing to Brownie UI

Thank you for your interest in contributing to Brownie UI! 🍫

## Development Workflow

### Setting up the project

```bash
# Clone your fork
git clone https://github.com/tu-usuario/brownie-ui.git
cd brownie-ui

# Install dependencies
pnpm install
```

### Creating a new component

1. Create a new package in `packages/`:
```bash
cd packages
mkdir my-component
cd my-component
```

2. Create the standard files:
   - `package.json`
   - `tsconfig.json`
   - `tsup.config.ts`
   - `src/index.ts`
   - `src/my-component.tsx`

3. Use the Button package as a template

### Development commands

```bash
# Start Storybook
pnpm storybook

# Build all packages
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint

# Create a changeset
pnpm changeset
```

### Adding a component to Storybook

1. Create a story file in `apps/docs/stories/`
2. Follow the Button.stories.tsx pattern
3. Include comprehensive examples

### Code style

- Use TypeScript for all new code
- Follow existing component patterns
- Use CVA for variant management
- Ensure accessibility (ARIA labels, keyboard nav)
- Add JSDoc comments for public APIs

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Add a changeset (`pnpm changeset`)
3. Ensure all tests pass (`pnpm type-check`, `pnpm lint`)
4. Update documentation in Storybook
5. Request review from maintainers

## Design Guidelines

- Keep the chocolate/amber color palette in mind
- Support dark mode when applicable
- Ensure smooth animations (200-300ms)
- Maintain WCAG 2.1 AA accessibility standards

## Questions?

Open an issue or reach out to the maintainers!
