import { Resend } from 'resend'

const resend = new Resend(process.env.EMAIL_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const provider = process.env.EMAIL_PROVIDER || 'resend'
    const from = process.env.EMAIL_FROM || 'no-reply@sweetb.co'

    console.log('📧 Attempting to send email via', provider)
    console.log('📧 From:', from)
    console.log('📧 To:', to)
    console.log('📧 API Key present:', !!process.env.EMAIL_API_KEY)

    if (provider === 'resend') {
      try {
        if (!process.env.EMAIL_API_KEY) {
          console.warn('⚠️ EMAIL_API_KEY not set, email will not be sent')
          return { success: false, error: 'EMAIL_API_KEY not configured' }
        }

        const result = await resend.emails.send({
          from,
          to,
          subject,
          html,
        })
        console.log('✅ Resend response:', result)
        return { success: true, data: result }
      } catch (error: any) {
        console.error('❌ Email send error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        return { success: false, error }
      }
    }

    // Add other providers here if needed
    throw new Error(`Unsupported email provider: ${provider}`)
  } catch (error: any) {
    console.error('❌ sendEmail function error:', error)
    return { success: false, error: error.message || String(error) }
  }
}

export function generateOtpEmail(code: string, expiryMinutes: number = 10) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            background-color: #0A0A0A; 
            color: #F8F8F8; 
            padding: 40px 20px;
            margin: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #1a1a1a;
            border: 1px solid rgba(201, 168, 106, 0.3);
            padding: 40px;
          }
          .logo {
            text-align: center;
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            margin-bottom: 30px;
          }
          .logo-sweet { color: #C9A86A; }
          .logo-b { color: #F8F8F8; text-shadow: 0 0 8px rgba(255, 255, 255, 0.6); }
          .code { 
            font-size: 32px; 
            font-weight: bold; 
            letter-spacing: 8px;
            text-align: center; 
            color: #C9A86A; 
            background-color: rgba(201, 168, 106, 0.1);
            padding: 20px;
            margin: 30px 0;
            border: 1px solid rgba(201, 168, 106, 0.3);
          }
          .text { 
            color: #B8B8B8; 
            line-height: 1.6; 
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(201, 168, 106, 0.2);
            color: #B8B8B8;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <span class="logo-sweet">Sweet</span><span class="logo-b">B</span>
          </div>
          <p class="text">Your verification code is:</p>
          <div class="code">${code}</div>
          <p class="text">This code will expire in ${expiryMinutes} minutes.</p>
          <p class="text">If you didn't request this code, you can safely ignore this email.</p>
          <div class="footer">
            <p>© 2025 SweetB. Vitality Reborn.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

