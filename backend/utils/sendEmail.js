const nodemailer = require("nodemailer");

const sendEmail = async (arg1, arg2, arg3) => {
  try {
    let to = "";
    let subject = "";
    let text = "";
    let html = "";

    // Backward compatible
    // Old style: sendEmail(to, subject, text)
    // New style: sendEmail({ to, subject, text, html })
    if (typeof arg1 === "object" && arg1 !== null) {
      to = arg1.to || "";
      subject = arg1.subject || "";
      text = arg1.text || "";
      html = arg1.html || "";
    } else {
      to = arg1 || "";
      subject = arg2 || "";
      text = arg3 || "";
    }

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
      from: `"AURUM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("SEND EMAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = sendEmail;