import express from 'express'
import nodemailer from 'nodemailer'

import {config} from "dotenv"
config()

const PORT = 3132;

const app = express()
app.use(express.json())

app.post('/api/test/finish',  (req,res) => {
  sendMail(req.body).then(result => {
    res.status(200).json(result)
  })
})

app.get('/api/test/test', (req,res) => {
  res.status(200).json('ok')
})

app.post('/api/test/body', (req,res) => {
  res.status(200).json(req.body)
})

app.listen(PORT, () => console.log('Started on: ' + PORT))

const sendMail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: process.env.AuthEmail,
        pass: process.env.AuthPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    const mailOptions = {
      from: `${process.env.FromName} <${process.env.FromEmail}>`,
      to: `${data.name} <${data.email}>, Site <neo.diagnostika@mail.ru>`,
      subject: 'Результаты тестирования',
      html: data.html,
    }

    return await transporter.sendMail(mailOptions, err => {
      console.log(err)
    })
  } catch (e) {
    return e
  }

}
