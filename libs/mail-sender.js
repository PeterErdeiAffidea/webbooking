const nodemailer = require('nodemailer');

exports.createTransporter = (emailConfig) => {
  if (emailConfig.test === undefined) {
    emailConfig.test = false;
  }
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: !emailConfig.test,
    auth: {
      user: emailConfig.username,
      pass: emailConfig.password
    }
  });
};

exports.sendmail = (mailOptions) => {
  let transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
};
