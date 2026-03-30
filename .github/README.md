# GitHub Workflows

This directory contains GitHub Actions workflows for automating the Brownie UI library.

## 🔄 Workflows

### 1. CI (`ci.yml`)
Runs on every push and pull request:
- ✅ Installs dependencies
- ✅ Builds all packages
- ✅ Runs type checking
- ✅ Runs linting
- ✅ Runs tests

### 2. Release (`release.yml`)
Runs when you push a tag or manually:
- 📦 Builds packages
- 🚀 Publishes to npm (requires `NPM_TOKEN` secret)
- 📝 Creates GitHub Release

### 3. Storybook Deploy (`storybook.yml`)
Runs on pushes to main that affect docs/packages:
- 📚 Builds Storybook
- 🌐 Deploys to GitHub Pages

### 4. Version (`version.yml`)
Manual workflow to bump versions:
- 🔢 Bumps package versions (patch/minor/major)
- 📝 Creates a PR with version changes

## 🔐 Required Secrets

Go to **Settings > Secrets and variables > Actions** and add:

| Secret | Description | Required By |
|--------|-------------|-------------|
| `NPM_TOKEN` | Your npm access token | Release workflow |
| `GITHUB_TOKEN` | Auto-provided by GitHub | All workflows |

### How to get NPM_TOKEN

1. Go to https://www.npmjs.com/settings/tokens
2. Create a **Granular Access Token**
3. Permissions needed:
   - Read and Publish
   - Packages: `brownie-ui-*`
4. Copy the token and add it to GitHub Secrets

## 🏷️ Creating a Release

### Option 1: Using Git Tags

```bash
# Create and push a tag
git tag v0.1.4
git push origin v0.1.4
```

The Release workflow will trigger automatically.

### Option 2: Using Version Workflow

1. Go to **Actions > Version**
2. Click **Run workflow**
3. Select version type (patch/minor/major)
4. A PR will be created
5. Merge the PR
6. Create and push a tag manually

## 📋 Pull Request Template

When creating a PR, you'll see a template that helps you:
- Describe your changes
- Check affected packages
- Ensure quality standards

## 🐛 Issue Templates

We provide templates for:
- Bug reports
- Feature requests
