const nodemailer = require('nodemailer')

class Mail {

  async send(data) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true solo para el puerto 465, false para el resto
      auth: {
        user: 'darrelmasis@gmail.com',
        pass: 'cthvcedopedduxqs'
      }
    })

    await transporter.sendMail({
      from: data.from, // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.html, // html body
    })
  }

}

module.exports = new Mail