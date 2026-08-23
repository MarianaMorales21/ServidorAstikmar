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

    const fechaLegible = new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const htmlBody = `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background-color:#f0f2f5;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

        <!-- WRAPPER -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f2f5;">
          <tr>
            <td align="center" style="padding:24px 12px;">

              <!-- MAIN CARD -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">

                <!-- HEADER -->
                <tr>
                  <td style="background-color:#1D2939;padding:28px 28px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(249,115,22,0.15);border-radius:20px;border:1px solid rgba(249,115,22,0.3);">
                            <tr><td style="padding:4px 14px;"><span style="font-size:10px;font-weight:700;color:#F97316;letter-spacing:0.12em;text-transform:uppercase;">REQUERIMIENTO TECNICO</span></td></tr>
                          </table>
                          <h1 style="margin:14px 0 0;font-size:20px;font-weight:800;color:#ffffff;line-height:1.3;">Nuevo requerimiento desde el sitio web</h1>
                          <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">Recibido el ${fechaLegible}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- DATOS DEL CLIENTE -->
                <tr>
                  <td style="padding:24px 28px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                      <tr><td style="padding:16px 20px;">
                        <p style="margin:0 0 12px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">Datos del cliente</p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="50%" valign="top" style="padding:4px 8px 4px 0;">
                              <p style="margin:0;font-size:10px;color:#94a3b8;">Nombre</p>
                              <p style="margin:2px 0 0;font-size:13px;font-weight:700;color:#1D2939;">${nombre}</p>
                            </td>
                            <td width="50%" valign="top" style="padding:4px 0 4px 8px;">
                              <p style="margin:0;font-size:10px;color:#94a3b8;">Empresa</p>
                              <p style="margin:2px 0 0;font-size:13px;font-weight:700;color:#1D2939;">${empresa || 'No especificada'}</p>
                            </td>
                          </tr>
                          <tr>
                            <td width="50%" valign="top" style="padding:8px 8px 0 0;">
                              <p style="margin:0;font-size:10px;color:#94a3b8;">Correo</p>
                              <p style="margin:2px 0 0;"><a href="mailto:${correo}" style="font-size:13px;font-weight:700;color:#F97316;text-decoration:none;">${correo}</a></p>
                            </td>
                            <td width="50%" valign="top" style="padding:8px 0 0 8px;">
                              <p style="margin:0;font-size:10px;color:#94a3b8;">Telefono</p>
                              <p style="margin:2px 0 0;"><a href="tel:${telefono}" style="font-size:13px;font-weight:700;color:#1D2939;text-decoration:none;">${telefono}</a></p>
                            </td>
                          </tr>
                        </table>
                      </td></tr>
                    </table>
                  </td>
                </tr>

                <!-- SERVICIO + FECHA -->
                <tr>
                  <td style="padding:16px 28px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="48%" valign="top">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFF7ED;border:1px solid rgba(249,115,22,0.25);border-radius:10px;">
                            <tr><td style="padding:14px 16px;">
                              <p style="margin:0;font-size:10px;font-weight:700;color:#F97316;letter-spacing:0.08em;text-transform:uppercase;">Servicio solicitado</p>
                              <p style="margin:4px 0 0;font-size:14px;font-weight:800;color:#1D2939;">${servicio}</p>
                            </td></tr>
                          </table>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" valign="top">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                            <tr><td style="padding:14px 16px;">
                              <p style="margin:0;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Fecha deseada</p>
                              <p style="margin:4px 0 0;font-size:14px;font-weight:800;color:#1D2939;">${fecha || 'Por definir'}</p>
                            </td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- MENSAJE -->
                <tr>
                  <td style="padding:20px 28px 0;">
                    <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">Descripcion del proyecto</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #F97316;">
                      <tr><td style="padding:16px 18px;">
                        <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;">${mensaje.replace(/\n/g, '<br>')}</p>
                      </td></tr>
                    </table>
                  </td>
                </tr>

                <!-- BOTON RESPONDER -->
                <tr>
                  <td align="center" style="padding:24px 28px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background-color:#F97316;border-radius:8px;">
                          <a href="mailto:${correo}?subject=RE: Nuevo requerimiento - ${servicio}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
                            Responder a ${nombre}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="padding:28px 28px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="border-top:1px solid #e2e8f0;padding-top:18px;" align="center">
                        <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;text-align:center;">
                          Este mensaje fue enviado desde el formulario de contacto<br>
                          <strong style="color:#1D2939;">Grupo Astikmar</strong> &mdash; Soluciones Navales Integrales<br>
                          <a href="https://grupoastikmar.com" style="color:#F97316;text-decoration:none;">grupoastikmar.com</a>
                        </p>
                      </td></tr>
                    </table>
                  </td>
                </tr>

                <tr><td style="height:20px;"></td></tr>

              </table>
              <!-- FIN MAIN CARD -->

            </td>
          </tr>
        </table>
        <!-- FIN WRAPPER -->

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
