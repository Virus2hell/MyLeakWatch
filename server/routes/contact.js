const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // Or use "outlook", "yahoo", etc.
      auth: {
        user: process.env.MAIL_USER, // Your email
        pass: process.env.MAIL_PASS, // App password
      },
      tls: {
        rejectUnauthorized: false, // ✅ ignore self-signed certificates
      },
    });

    await transporter.sendMail({
      from: `"My Website Contact" <${process.env.MAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER || process.env.MAIL_USER,
      subject: `New message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
