const nodemailer = require("nodemailer");
const constant = require("../constant");

const forgotPasswordEmail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            requireTLS: true,
            secure: true,
        });

        const mailOptions = {
            from: `"BVM Infotech HQ 👻" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: constant.TITLE.FORGOT_PASSWORD_SUBJECT_MESSAGE,
            html: `<p> Hii ${name}, Please copy this link and <a href="${process.env.CLIENT_URL}v1/auth/reset_password?token=${token}"> reset your password </a></p>`,
        };

        return await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(constant.ERROR.NODEMAILER_ERROR_MESSAGE);
                } else {
                    resolve();
                }
            });
        });
    } catch (err) {
        throw new Error(err);
    }

};

module.exports = {forgotPasswordEmail};
