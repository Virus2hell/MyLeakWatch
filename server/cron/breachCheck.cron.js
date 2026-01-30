const cron = require("node-cron")
const MonitoredEmail = require("../models/MonitoredEmail")
const { checkBreaches } = require("../services/hibp.service")
const { isNewBreach, logBreach } = require("../services/breach.service")
const { sendBreachMail } = require("../services/mail.service")

cron.schedule("0 2 * * *", async () => {
  console.log("⏰ Running breach scan...")

  const emails = await MonitoredEmail.find({ enabled: true })

  for (const record of emails) {
    const breaches = await checkBreaches(record.email)

    for (const breach of breaches) {
      const fresh = await isNewBreach(record.email, breach.Name)
      if (fresh) {
        await sendBreachMail(record.userEmail, breach)
        await logBreach(record.email, breach)
      }
    }
  }
})