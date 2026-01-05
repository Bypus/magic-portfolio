# Dev Container Setup

This folder contains the configuration for developing this Next.js portfolio in a Docker container.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Visual Studio Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

1. Open VS Code
2. Open this folder in VS Code
3. When prompted "Reopen in Container", click **Reopen in Container**
   - Or use the command palette (F1) and select **Dev Containers: Reopen in Container**

4. VS Code will build the Docker container and set up your development environment
   - This may take a few minutes the first time
   - Dependencies will be automatically installed via `npm install`

5. Once ready, open a new terminal in VS Code and start the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3001](http://localhost:3001) in your browser

## What's Included

- **Node.js 20 LTS**: Latest long-term support version
- **Git & GitHub CLI**: Version control and GitHub integration
- **VS Code Extensions**: 
  - Biome (formatter/linter)
  - ESLint
  - Tailwind CSS IntelliSense
  - MDX support
  - Docker support
  - GitHub Copilot (if you have it)

## Features

- **Port Forwarding**: Port 3001 is automatically forwarded for the Next.js dev server
- **Volume Mounting**: Your code is mounted into the container, changes sync automatically
- **Persistent node_modules**: Dependencies are stored in a Docker volume for better performance
- **Non-root User**: Runs as the `node` user for security

## Available Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run biome-write  # Format code with Biome
```

## Troubleshooting

### Container won't start
- Make sure Docker Desktop is running
- Try rebuilding: Command Palette → **Dev Containers: Rebuild Container**

### Port 3001 already in use
- Stop any local servers running on port 3001
- Or change the port in [compose.yaml](compose.yaml)

### Dependencies not installing
- Manually run `npm install` in the container terminal
- Check that you have internet connectivity from within the container

## Customization

- **Add Node packages**: Just run `npm install <package>` as usual
- **Add VS Code extensions**: Edit the `extensions` array in [devcontainer.json](devcontainer.json)
- **Change Node version**: Modify the version in the `features` section of [devcontainer.json](devcontainer.json)
- **Add system packages**: Edit [Dockerfile](Dockerfile) and rebuild
