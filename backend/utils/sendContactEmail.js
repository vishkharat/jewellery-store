const nodemailer = require("nodemailer");

const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER,
    subject: `New Contact Inquiry: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 12px; background: #f7f7f7; border-radius: 8px;">
          ${message}
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendContactEmail;