const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ avoids local SSL issues
  },
})

// ✅ Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail service failed:", error.message)
  } else {
    console.log("✅ Mail service ready to send emails")
  }
})

const sendBreachMail = async (to, breach) => {
  try {
    const info = await transporter.sendMail({
      from: `"MyLeakWatch" <${process.env.MAIL_USER}>`,
      to,
      subject: `⚠️ Breach Alert: ${breach.Name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color:#e63946;">Security Alert</h2>
          <p>Your email was found in a data breach.</p>
          <hr />
          <p><b>Website:</b> ${breach.Name}</p>
          <p><b>Breach Date:</b> ${breach.BreachDate || "Unknown"}</p>
          <p><b>Compromised Data:</b></p>
          <ul>
            ${breach.DataClasses.map(d => `<li>${d}</li>`).join("")}
          </ul>
          <br/>
          <p style="color:#555;">– MyLeakWatch Security Team</p>
        </div>
      `,
    })

    console.log(`📨 Email sent to ${to} | MessageId: ${info.messageId}`)
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message)
    throw err
  }
}

module.exports = { sendBreachMail }
