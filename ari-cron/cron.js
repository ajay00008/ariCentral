require('dotenv').config()
require('./instrument')

const { CronJob } = require('cron')
const Sentry = require('@sentry/node')

async function updateCurrentCurrencyOnDB () {
  try {
    await fetch(`${process.env.PUBLIC_URL}/api/rate/rates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    Sentry.captureException(err)
  }
}

async function updateRestorationLinksInDB () {
  try {
    await fetch(`${process.env.PUBLIC_URL}/api/control-tokens`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    Sentry.captureException(err)
  }
}

const currencyJob = new CronJob('0 0 0 * * *', async () => {
  console.info('Running currency update cron job')
  await updateCurrentCurrencyOnDB()
})

const restorationLinksJob = new CronJob('0 0 * * * *', async () => {
  console.info('Running restoration links update cron job')
  await updateRestorationLinksInDB()
})

currencyJob.start()
restorationLinksJob.start()
