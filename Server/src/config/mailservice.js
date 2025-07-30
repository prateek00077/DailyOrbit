import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    // I have to make an email for dailyorbit and use that here
    user: "pandeyprateek560@gmail.com",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: "DailyOrbit <noreply@dailyorbit.com>",
            to,
            subject,
            text
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;
