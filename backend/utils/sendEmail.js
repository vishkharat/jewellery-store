const nodemailer = require("nodemailer");

const sendEmail = async (arg1, arg2, arg3) => {
  try {
    let to = "";
    let subject = "";
    let text = "";
    let html = "";

    // Support both formats
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

    // ✅ PROPER SMTP CONFIG (IMPORTANT CHANGE)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ VERIFY CONNECTION (VERY IMPORTANT)
    await transporter.verify();
    console.log("✅ Email server ready");

    const mailOptions = {
      from: `"AURUM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.response);

    return info;
  } catch (error) {
    console.error("❌ SEND EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;