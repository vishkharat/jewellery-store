const nodemailer = require("nodemailer");

// ✅ reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password required
  },
});

const sendEmail = async (arg1, arg2, arg3) => {
  try {
    let to = "";
    let subject = "";
    let text = "";
    let html = "";

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

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL env variables missing");
    }

    if (!to) {
      throw new Error("Recipient email missing");
    }

    const mailOptions = {
      from: `"AURUM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 EMAIL SENT SUCCESS:", {
      to,
      subject,
      messageId: info.messageId,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ EMAIL FAILED:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;