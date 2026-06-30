# Use Microsoft's official Playwright image — comes with browsers + OS deps preinstalled
FROM mcr.microsoft.com/playwright:v1.47.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Default: run the full suite (unit -> api -> ui)
CMD ["npm", "run", "test:all"]
