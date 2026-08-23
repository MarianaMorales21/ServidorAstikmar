const express = require('express')
const cors = require('cors')

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

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TO_EMAIL = process.env.TO_EMAIL || 'Moralesmar277@gmail.com'

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'API key no configurada en el servidor' })
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 16px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

              <!-- HEADER -->
              <tr>
                <td style="background:linear-gradient(135deg,#1D2939 0%,#0f172a 50%,#1D2939 100%);padding:32px 36px;position:relative;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="display:inline-block;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);border-radius:20px;padding:4px 14px;margin-bottom:12px;">
                          <span style="font-size:10px;font-weight:700;color:#F97316;letter-spacing:0.12em;text-transform:uppercase;">REQUERIMIENTO TECNICO</span>
                        </div>
                        <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">Nuevo requerimiento desde<br>el sitio web</h1>
                        <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">Recibido el ${new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </td>
                      <td align="right" style="vertical-align:top;">
                        <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#F97316,#ea580c);display:flex;align-items:center;justify-content:center;">
                          <span style="font-size:22px;">⚓</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CLIENTE INFO -->
              <tr>
                <td style="padding:28px 36px 0;">
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">Datos del cliente</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding:6px 0;">
                          <span style="font-size:11px;color:#94a3b8;display:block;">Nombre</span>
                          <span style="font-size:14px;font-weight:700;color:#1D2939;">${nombre}</span>
                        </td>
                        <td width="50%" style="padding:6px 0;">
                          <span style="font-size:11px;color:#94a3b8;display:block;">Empresa</span>
                          <span style="font-size:14px;font-weight:700;color:#1D2939;">${empresa || 'No especificada'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding:6px 0;">
                          <span style="font-size:11px;color:#94a3b8;display:block;">Correo</span>
                          <a href="mailto:${correo}" style="font-size:14px;font-weight:700;color:#F97316;text-decoration:none;">${correo}</a>
                        </td>
                        <td width="50%" style="padding:6px 0;">
                          <span style="font-size:11px;color:#94a3b8;display:block;">Telefono</span>
                          <a href="tel:${telefono}" style="font-size:14px;font-weight:700;color:#1D2939;text-decoration:none;">${telefono}</a>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- SERVICIO -->
              <tr>
                <td style="padding:20px 36px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%">
                        <div style="background:linear-gradient(135deg,rgba(249,115,22,0.08),rgba(249,115,22,0.03));border:1px solid rgba(249,115,22,0.2);border-radius:12px;padding:16px 20px;">
                          <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#F97316;letter-spacing:0.08em;text-transform:uppercase;">Servicio solicitado</p>
                          <p style="margin:0;font-size:15px;font-weight:800;color:#1D2939;">${servicio}</p>
                        </div>
                      </td>
                      <td width="16"></td>
                      <td width="50%">
                        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
                          <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Fecha deseada</p>
                          <p style="margin:0;font-size:15px;font-weight:800;color:#1D2939;">${fecha || 'Por definir'}</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- MENSAJE -->
              <tr>
                <td style="padding:20px 36px 0;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">Descripcion del proyecto</p>
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #F97316;border-radius:0 12px 12px 0;padding:18px 22px;">
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${mensaje.replace(/\n/g, '<br>')}</p>
                  </div>
                </td>
              </tr>

              <!-- BOTON RESPONDER -->
              <tr>
                <td style="padding:24px 36px 0;" align="center">
                  <a href="mailto:${correo}?subject=RE: Nuevo requerimiento - ${servicio}" style="display:inline-block;background:linear-gradient(135deg,#F97316,#ea580c);color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 28px;border-radius:10px;box-shadow:0 4px 14px rgba(249,115,22,0.3);">
                    Responder a ${nombre}
                  </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="padding:32px 36px 0;">
                  <div style="border-top:1px solid #e2e8f0;padding-top:20px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
                      Este mensaje fue enviado desde el formulario de contacto<br>
                      <strong style="color:#1D2939;">Grupo Astikmar</strong> &mdash; Soluciones Navales Integrales<br>
                      <a href="https://grupoastikmar.com" style="color:#F97316;text-decoration:none;">grupoastikmar.com</a>
                    </p>
                  </div>
                </td>
              </tr>

              <tr><td style="height:24px;"></td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Grupo Astikmar Web <noreply@grupoastikmar.com>',
        to: [TO_EMAIL],
        reply_to: correo,
        subject: `Nuevo requerimiento - ${nombre} (${servicio})`,
        html: htmlBody,
        text: `Nuevo requerimiento - ${nombre}\n\nNombre: ${nombre}\nCorreo: ${correo}\nTelefono: ${telefono}\nEmpresa: ${empresa || 'No especificada'}\nServicio: ${servicio}\nFecha deseada: ${fecha || 'No especificada'}\n\nMensaje:\n${mensaje}`,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend error:', data)
      return res.status(500).json({ error: data.message || 'Error al enviar el correo' })
    }

    console.log('Email sent:', data.id)
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
