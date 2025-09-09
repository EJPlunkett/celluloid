import { Resend } from 'resend'

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Your welcome email HTML template
const getWelcomeEmailHTML = (firstName) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Celluloid by Design</title>
  <style>
    /* Email client resets */
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    .button-image {
      display: block !important;
      border: 0 !important;
      max-width: 250px !important;
      height: auto !important;
      margin: 10px 0 !important;
      transition: all 0.3s ease !important;
      cursor: pointer !important;
      border-radius: 8px !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f5f3;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f6f5f3;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #f6f5f3;">
          
          <!-- Header with logo -->
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
              <img src="https://celluloidbydesign.com/Header%20Logo.png" 
                   alt="Celluloid by Design" 
                   style="max-width: 100%; height: auto; display: block;" />
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="padding: 0 20px;">
              <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; font-size: 16px;">
                
                <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${firstName},</p>
                
                <p style="margin: 0 0 24px 0; font-size: 17px; font-weight: 500;">
                  Welcome to <em>Celluloid by Design</em>! You now have a space to build your own film archive shaped around your unique aesthetic preferences.
                </p>
                
                <p style="margin: 0 0 20px 0; font-size: 16px;">Ready to dive in? You can either:</p>
                
                <!-- Action buttons -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                  <tr>
                    <td align="center" style="padding: 10px 0;">
                      <a href="https://celluloidbydesign.com/match" style="text-decoration: none; display: inline-block;">
                        <img src="https://celluloidbydesign.com/give-it-a-go-button.png" 
                             alt="GIVE IT A GO" 
                             class="button-image" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 10px 0;">
                      <a href="https://celluloidbydesign.com/watchlist" style="text-decoration: none; display: inline-block;">
                        <img src="https://celluloidbydesign.com/access-watchlist-button.png" 
                             alt="ACCESS WATCHLIST" 
                             class="button-image" />
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Signature -->
                <div style="margin: 30px 0;">
                  <p style="margin: 0 0 8px 0; font-size: 16px;">Hope you have as much fun exploring as I did making it,</p>
                  <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 500;">Emily</p>
                  <p style="margin: 0; font-size: 16px; color: #666; font-style: italic;">
                    Creator & Curator, Celluloid by Design
                  </p>
                </div>
                
                <!-- Support note -->
                <p style="font-size: 14px; color: #666; margin-top: 30px; line-height: 1.5;">
                  <strong>P.S.</strong> If you'd like to leave a tip to help cover the small costs behind the scenes, you can do that 
                  <a href="https://celluloidbydesign.com/support" 
                     style="color: #000; text-decoration: underline;">here</a>. 
                  Totally optional, always appreciated.
                </p>
                
              </div>
            </td>
          </tr>
          
          <!-- Footer spacing -->
          <tr>
            <td style="padding: 30px 0;"></td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { email, firstName } = JSON.parse(event.body)

    if (!email || !firstName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and firstName are required' })
      }
    }

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: 'hello@celluloidbydesign.com', // Use your verified domain
      to: email,
      subject: 'Your film archive starts here 🎬',
      html: getWelcomeEmailHTML(firstName)
    })

    console.log('Welcome email sent successfully:', emailResult)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: emailResult.data?.id 
      })
    }

  } catch (error) {
    console.error('Error sending welcome email:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to send welcome email',
        details: error.message 
      })
    }
  }
}