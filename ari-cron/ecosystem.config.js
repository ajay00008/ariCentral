module.exports = {
  apps: [
    {
      name: 'walker-cron',
      script: 'npm',
      cwd: __dirname,
      args: 'run start',
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
