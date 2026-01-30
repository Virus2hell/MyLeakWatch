const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendBreachMail = async (to, breach) => {
  await transporter.sendMail({
    from: `"MyLeakWatch" <${process.env.EMAIL_USER}>`,
    to,
    subject: `⚠️ Breach Alert: ${breach.Name}`,
    html: `
      <h3>Your email was found in a breach</h3>
      <p><b>Site:</b> ${breach.Name}</p>
      <p><b>Date:</b> ${breach.BreachDate}</p>
      <p><b>Data:</b> ${breach.DataClasses.join(", ")}</p>
    `,
  })
}

module.exports = { sendBreachMail }
