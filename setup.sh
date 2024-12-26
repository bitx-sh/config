#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Initializing bitx-config monorepo...${NC}"

# Create root project
# mkdir -p bitx-config
# cd bitx-config

# Initialize root package with Bun
echo -e "${GREEN}📦 Initializing root package with Bun...${NC}"
#bun init -y

# Update package.json for workspace
# cat >package.json <<EOF
# {
#   "name": "@bitx-sh/config",
#   "version": "0.0.1",
#   "type": "module",
#   "private": true,
#   "workspaces": [
#     "packages/*"
#   ],
#   "scripts": {
#     "build": "bun run --cwd packages/core build",
#     "dev": "bun run --cwd packages/core dev",
#     "test": "bun test",
#     "lint": "biome check .",
#     "format": "biome format . --write",
#     "clean": "rm -rf **/dist **/node_modules",
#     "prepare": "simple-git-hooks"
#   }
# }
# EOF

# Create necessary directories
echo -e "${GREEN}📁 Creating project structure...${NC}"
mkdir -p packages/{core,plugin-biome,plugin-vite,plugin-github,plugin-renovate}

# Initialize core package
echo -e "${GREEN}📦 Initializing core package...${NC}"
cd packages/core
bun init -y
cat >package.json <<EOF
{
  "name": "@bitx-sh/config",
  "version": "0.0.1",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "bin": {
    "bitx-config": "./bin/cli.ts"
  },
  "files": [
    "dist",
    "bin"
  ]
}
EOF
cd ../..

# Initialize plugin packages
for plugin in biome vite github renovate; do
    echo -e "${GREEN}📦 Initializing plugin-${plugin} package...${NC}"
    cd packages/plugin-${plugin}
    bun init -y
    cat >package.json <<EOF
{
  "name": "@bitx-sh/plugin-${plugin}",
  "version": "0.0.1",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts"
}
EOF
    cd ../..
done

# Initialize Biome
echo -e "${GREEN}🔧 Initializing Biome...${NC}"
bunx @biomejs/biome init

# Update Biome configuration
cat >biome.json <<EOF
{
  "$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingComma": "es5"
    }
  }
}
EOF

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
bun add -d @biomejs/biome typescript @types/node
bun add citty consola c12 unconfig mlly knitwork std-env pkg-types pathe scule
bun add zod quicktype unbuild unimport
bun add -d changelogen simple-git-hooks lint-staged publint knip

# Initialize git
echo -e "${GREEN}🔧 Initializing git repository...${NC}"
git init
cat >.gitignore <<EOF
node_modules
dist
.DS_Store
*.log
.env
.env.*
!.env.example
.cache
.temp
EOF

# Setup git hooks
cat >.simple-git-hooks.cjs <<EOF
module.exports = {
  'pre-commit': 'bun lint-staged',
}
EOF

cat >.lintstagedrc <<EOF
{
  "*": "biome check --apply"
}
EOF

# Create initial commit
git add .
git commit -m "chore: initial commit"

echo -e "${GREEN}✨ Setup complete! Project structure created successfully.${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. cd bitx-config"
echo -e "2. Review the generated structure"
echo -e "3. Start adding implementation files"
