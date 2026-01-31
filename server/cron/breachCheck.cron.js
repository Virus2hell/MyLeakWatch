const cron = require("node-cron")
const MonitoredEmail = require("../models/MonitoredEmail")
const { checkBreaches } = require("../services/hibp.service")
const { isNewBreach, logBreach } = require("../services/breach.service")
const { sendBreachMail } = require("../services/mail.service")

// ⏱ Runs daily at 2 AM (server time)
cron.schedule("0 2 * * *", async () => {
  console.log("⏰ Breach scan started:", new Date().toISOString())

  try {
    const emails = await MonitoredEmail.find({ enabled: true })
    console.log(`📧 Total monitored emails: ${emails.length}`)

    for (const record of emails) {
      console.log(`🔍 Checking breaches for: ${record.email}`)

      let breaches = []
      try {
        breaches = await checkBreaches(record.email)
        console.log(`🧨 Breaches found: ${breaches.length}`)
      } catch (err) {
        console.error(
          `❌ HIBP error for ${record.email}:`,
          err.response?.status || err.message
        )
        continue
      }

      for (const breach of breaches) {
        const fresh = await isNewBreach(record.email, breach.Name)

        if (fresh) {
          console.log(`🚨 New breach detected: ${breach.Name}`)

          try {
            await sendBreachMail(record.userEmail, breach)
            await logBreach(record.email, breach)
          } catch (err) {
            console.error(
              `❌ Failed processing breach ${breach.Name} for ${record.email}:`,
              err.message
            )
          }
        }
      }

      // ⏳ HIBP rate-limit safety (1 request / ~1.6 sec)
      await new Promise((r) => setTimeout(r, 1600))
    }

    console.log("✅ Breach scan completed")
  } catch (err) {
    console.error("🔥 Cron job crashed:", err.message)
  }
})
