---
title: Monorepo Guide
description: A guide to the Noony framework's monorepo architecture and development workflow
sidebar_position: 3
---

# Noony Framework Monorepo Guide

This repository has been migrated to a high-performance monorepo architecture using **pnpm + Turborepo + SWC + Changesets**.

## 🏗️ Architecture Overview

```
noony-monorepo/
├── packages/
│   ├── core/                    # @noony-serverless/core (main framework)
│   ├── examples/
│   │   ├── hello-world-simple/  # @noony-examples/hello-world-simple
│   │   ├── fastify-production/  # @noony-examples/fastify-production
│   │   └── guard-showcase/      # @noony-examples/guard-showcase
│   ├── plugins/                 # Future middleware plugins
│   └── tools/                   # Development and build tools
├── .changeset/                  # Version management
├── scripts/                     # Monorepo scripts
└── turbo.json                   # Turborepo configuration
```

## 🚀 Performance Stack

- **pnpm**: Ultra-fast package manager with workspace support
- **Turborepo**: Intelligent build system with remote caching
- **SWC**: Rust-based TypeScript compiler (20x faster than tsc)
- **Changesets**: Independent package versioning and publishing

## 📦 Package Management

### Install Dependencies
```bash
# Install all packages
pnpm install

# Install for specific package
pnpm --filter @noony-serverless/core install

# Add dependency to specific package
pnpm --filter @noony-examples/hello-world-simple add lodash
```

### Workspace Dependencies
Examples automatically reference the core package using `workspace:*`:
```json
{
  "dependencies": {
    "@noony-serverless/core": "workspace:*"
  }
}
```

## 🛠️ Development Commands

### Global Commands (from root)
```bash
# Build all packages
pnpm build

# Build only core package
pnpm build:core

# Development mode (all packages)
pnpm dev

# Development mode (core only)
pnpm dev:core

# Development mode (examples only)
pnpm dev:examples

# Run tests
pnpm test

# Run tests for core only
pnpm test:core

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Clean all build outputs
pnpm clean:dist

# Reset entire monorepo
pnpm reset
```

### Package-Specific Commands
```bash
# Work in specific package
cd packages/core
pnpm build
pnpm test
pnpm dev

# Or use filters from root
pnpm --filter @noony-serverless/core build
pnpm --filter @noony-examples/hello-world-simple dev
```

## ⚡ Performance Benefits

### Build Performance
- **SWC compilation**: 5-10x faster than TypeScript
- **Turborepo caching**: Only rebuilds changed packages
- **Parallel builds**: Independent packages build simultaneously

### Development Experience
- **Hot reload**: &lt;1s compilation with SWC watch mode
- **Selective builds**: Only affected packages rebuild
- **Shared tooling**: Consistent configs across packages

### CI/CD Optimization
- **Remote caching**: Builds cached across CI runs
- **Change detection**: Only tests/builds affected packages
- **Parallel execution**: Multiple packages processed simultaneously

## 📋 Version Management with Changesets

### Creating a Changeset
```bash
# Interactive changeset creation
pnpm changeset

# This will prompt you to:
# 1. Select which packages changed
# 2. Choose version bump type (major/minor/patch)
# 3. Write a description of changes
```

### Releasing Packages
```bash
# Version packages (updates package.json, creates CHANGELOG)
pnpm changeset:version

# Publish to npm
pnpm changeset:publish

# Or use the complete release script
pnpm release
```

### Independent Versioning
Each package maintains its own version:
- `@noony-serverless/core`: Follows semantic versioning
- Examples: Private packages (not published)
- Plugins: Independent versioning when added

## 🧪 Testing Strategy

### Jest with SWC
All packages use a shared Jest configuration with SWC for fast test execution:

```javascript
// jest.config.base.js (shared config)
module.exports = {
  preset: '@swc/jest',
  // ... shared configuration
};

// packages/core/jest.config.js
const baseConfig = require('../../jest.config.base.js');
module.exports = {
  ...baseConfig,
  displayName: '@noony-serverless/core'
};
```

### Test Commands
```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific package tests
pnpm --filter @noony-serverless/core test

# Watch mode
pnpm --filter @noony-serverless/core test:watch
```

## 🔧 Build System (Turborepo)

### Pipeline Configuration
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Cache Optimization
- **Local cache**: `.turbo/` directory
- **Remote cache**: Configured for CI/CD
- **Cache keys**: Based on file contents and dependencies

## 🚀 CI/CD Pipeline

### GitHub Actions
- **CI Workflow**: Runs on PRs and pushes
  - Builds all packages
  - Runs tests and linting
  - Uses Turborepo caching for speed
  
- **Release Workflow**: Automated publishing
  - Uses Changesets for version management
  - Publishes to npm registry
  - Creates GitHub releases

### Performance Optimizations
- **pnpm caching**: Dependencies cached between runs
- **Turborepo caching**: Build outputs cached
- **Parallel execution**: Multiple jobs run simultaneously

## 🔄 Migration from Single Package

### What Changed
1. **Package structure**: Moved from root to `packages/core/`
2. **Build system**: TypeScript → SWC compilation
3. **Package manager**: npm → pnpm
4. **Build orchestration**: Added Turborepo
5. **Version management**: Added Changesets

### Backward Compatibility
- **API unchanged**: Core package maintains same exports
- **Import paths**: Still `@noony-serverless/core`
- **Examples updated**: Use workspace dependencies

## 🎯 Adding New Packages

### Plugin Package Template
```bash
# Create new plugin package
mkdir packages/plugins/my-plugin
cd packages/plugins/my-plugin

# Create package.json
{
  "name": "@noony-plugins/my-plugin",
  "version": "1.0.0",
  "dependencies": {
    "@noony-serverless/core": "workspace:*"
  }
}

# Copy base configurations
cp ../../core/.swcrc .
cp ../../core/jest.config.js .
```

### Update Workspace
Add to `pnpm-workspace.yaml` if needed (already includes `packages/plugins/*`).

## 📚 Best Practices

### Development Workflow
1. **Make changes** in appropriate package
2. **Add changeset** if publishing: `pnpm changeset`
3. **Test locally**: `pnpm test`
4. **Build locally**: `pnpm build`
5. **Create PR**: Automated CI will run
6. **Merge**: Release workflow handles publishing

### Package Dependencies
- **Use workspace:*** for internal dependencies
- **Pin versions** for external dependencies
- **Shared dev dependencies** in root package.json

### Performance Tips
- **Use filters** for targeted operations
- **Leverage caching** - don't clean unless necessary
- **Run builds before tests** for best caching

## 🔍 Troubleshooting

### Common Issues
```bash
# Clear all caches
pnpm clean && rm -rf .turbo && pnpm install

# Rebuild everything
pnpm clean:dist && pnpm build

# Check workspace setup
pnpm list --depth 0

# Verify package links
pnpm --filter @noony-examples/hello-world-simple list
```

### Build Failures
- Check SWC configuration in `.swcrc`
- Verify TypeScript paths in `tsconfig.json`
- Ensure all dependencies are installed

## 📈 Metrics

### Expected Performance Improvements
- **Build time**: 5-10x faster (TypeScript → SWC)
- **Test time**: 3-5x faster (ts-jest → @swc/jest)
- **Development**: Hot reload &lt;1s
- **CI/CD**: 60-80% faster with caching
- **Disk usage**: 30-70% reduction (pnpm hard links)

This monorepo setup provides a solid foundation for scaling the Noony Framework with multiple packages while maintaining high performance and developer experience.