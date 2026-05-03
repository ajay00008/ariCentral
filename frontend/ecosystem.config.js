module.exports = {
  apps: [
    {
      name: 'ari-web-green',
      script: 'npm',
      cwd: __dirname,
      args: 'run start -- -p 3001',
      time: true,
      env_development: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
