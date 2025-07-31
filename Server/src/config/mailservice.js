import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user : process.env.GOOGLE_APP_USER, // Use the email from .env
        pass : process.env.GOOGLE_APP_PASSWORD, // Use the password from .env
      },
    });

    const result = await transporter.sendMail({
      from: `DailyOrbit <${process.env.GOOGLE_APP_USER}>`, // Use the configured email address
      to,
      subject,
      text
    });
    
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error so calling code can handle it
  }
};

export default sendEmail;
