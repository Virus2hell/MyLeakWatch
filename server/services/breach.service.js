const BreachLog = require("../models/BreachLog")

const isNewBreach = async (email, breachName) => {
  const exists = await BreachLog.findOne({ email, breachName })
  return !exists
}

const logBreach = async (email, breach) => {
  await BreachLog.create({
    email,
    breachName: breach.Name,
    breachDate: breach.BreachDate,
    notifiedAt: new Date(),
  })
}

module.exports = { isNewBreach, logBreach }
