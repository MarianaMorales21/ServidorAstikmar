const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'Grupo Astikmar Email API running' })
})

app.post('/api/send-email', async (req, res) => {
  try {
    const { nombre, correo, telefono, empresa, servicio, mensaje, fecha } = req.body

    if (!nombre || !correo || !telefono || !servicio || !mensaje) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({ error: 'SMTP no configurado en el servidor' })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1D2939,#334e68);padding:24px 30px;">
          <h1 style="color:#F97316;margin:0;font-size:20px;">Nuevo requerimiento desde el sitio web</h1>
          <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Grupo Astikmar - Portal de contacto</p>
        </div>
        <div style="padding:24px 30px;background:#f9fafb;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600;width:140px;">Nombre</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1D2939;font-weight:700;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600;">Correo</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;"><a href="mailto:${correo}" style="color:#F97316;text-decoration:none;">${correo}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600;">Teléfono</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1D2939;"><a href="tel:${telefono}" style="color:#1D2939;text-decoration:none;">${telefono}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600;">Empresa</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1D2939;">${empresa || 'No especificada'}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600;">Servicio</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1D2939;font-weight:700;">${servicio}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600;">Fecha deseada</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1D2939;">${fecha || 'No especificada'}</td>
            </tr>
          </table>
          <div style="margin-top:20px;">
            <p style="color:#6b7280;font-weight:600;font-size:13px;margin:0 0 8px;">Mensaje:</p>
            <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:14px;color:#1D2939;font-size:14px;line-height:1.6;">
              ${mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div style="background:#1D2939;padding:16px 30px;text-align:center;">
          <p style="color:#94a3b8;margin:0;font-size:11px;">Este mensaje fue enviado desde el formulario de contacto de grupoastikmar.com</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"Grupo Astikmar - Web" <${smtpUser}>`,
      to: 'moralesmar277@gmail.com',
      replyTo: correo,
      subject: `Nuevo requerimiento - ${nombre} (${servicio})`,
      html: htmlBody,
      text: `Nuevo requerimiento - ${nombre}\n\nNombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono}\nEmpresa: ${empresa || 'No especificada'}\nServicio: ${servicio}\nFecha deseada: ${fecha || 'No especificada'}\n\nMensaje:\n${mensaje}`,
    })

    res.json({ success: true, message: 'Correo enviado correctamente' })
  } catch (err) {
    console.error('Email error:', err.message)
    res.status(500).json({ error: 'Error al enviar el correo' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
