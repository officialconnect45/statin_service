const path = require("path");

module.exports = {
  apps: [
    {
      name: "statin-service-api",
      cwd: path.resolve(__dirname, "apps/api"),
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 4001,
      },
    },
    {
      name: "statin-service-web",
      cwd: path.resolve(__dirname, "apps/web"),
      script: path.resolve(__dirname, "node_modules/next/dist/bin/next"),
      args: "start -p 3001",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
