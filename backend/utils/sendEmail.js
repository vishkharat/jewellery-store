const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing");
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM is missing");
    }

    if (!to) {
      throw new Error("Recipient email is missing");
    }

    const payload = {
      from: process.env.EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html,
    };

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("❌ RESEND EMAIL FAILED:", error);
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    console.log("✅ RESEND EMAIL SENT:", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("❌ EMAIL FAILED:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmail;