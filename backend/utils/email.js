const sendEmail = async(options) => {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        // in realtime project all the below details will be provided by client
        // for now we are using mailtrap.io for testing purpose
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    
    await transporter.sendMail(message);
}
module.exports = sendEmail;