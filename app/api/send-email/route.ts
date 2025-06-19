import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create transporter using Gmail SMTP with correct configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "yespproject@gmail.com",
        pass: "drdu iysx gqyf abme",
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
      console.log("SMTP connection verified successfully")
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError)
      return NextResponse.json({ error: "Email service configuration error" }, { status: 500 })
    }

    // Modern sleek email content
    const mailOptions = {
      from: '"Arrow Structures Contact Form" <yespproject@gmail.com>',
      to: "arrowstructures@gmail.com",
      replyTo: email, // This allows direct reply to the customer
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 48px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.025em;">
                New Contact Submission
              </h1>
              <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 400;">
                Arrow Structures
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 48px 40px;">
              
              <!-- Priority Badge -->
              <div style="text-align: center; margin-bottom: 40px;">
                <span style="display: inline-block; background-color:rgba(235, 37, 37, 0.76); color: white; padding: 8px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                  High Priority
                </span>
              </div>

              <!-- Contact Information -->
              <div style="margin-bottom: 40px;">
                <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #2563eb;">
                  Contact Information
                </h2>
                
                <div style="background-color: #f8fafc; border-radius: 8px; padding: 32px; border-left: 4px solid #2563eb;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 100px; vertical-align: top;">
                        Name
                      </td>
                      <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 16px;">
                        ${name}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; vertical-align: top;">
                        Email
                      </td>
                      <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 16px;">
                        <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px 0; font-weight: 600; color: #374151; vertical-align: top;">
                        Phone
                      </td>
                      <td style="padding: 16px 0; color: #1f2937; font-size: 16px;">
                        <a href="tel:${phone}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${phone}</a>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Message -->
              <div style="margin-bottom: 40px;">
                <h3 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600; padding-bottom: 12px; border-bottom: 2px solid #2563eb;">
                  Message
                </h3>
                <div style="background-color: #f8fafc; border-radius: 8px; padding: 32px; border-left: 4px solid #2563eb;">
                  <p style="color: #374151; line-height: 1.7; margin: 0; font-size: 16px; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 48px 0;">
                <h3 style="color: #1f2937; margin: 0 0 32px 0; font-size: 20px; font-weight: 600;">
                  Quick Actions
                </h3>
                <table style="margin: 0 auto; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 0 12px;">
                      <a href="tel:${phone}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px; transition: all 0.2s ease; border: 2px solid #2563eb;">
                        Call Now
                      </a>
                    </td>
                    <td style="padding: 0 12px;">
                      <a href="mailto:${email}" style="display: inline-block; background-color: transparent; color: #2563eb; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px; transition: all 0.2s ease; border: 2px solid #2563eb;">
                        Send Email
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Response Notice -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 24px; border-left: 4px solid #2563eb;">
                <h4 style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                  Response Required
                </h4>
                <p style="margin: 0; color: #1e40af; line-height: 1.6; font-size: 14px;">
                  Please respond to this inquiry within 24 hours to maintain excellent customer service standards.
                </p>
              </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                This email was sent from the Arrow Structures contact form.<br>
                Reply directly to this email to respond to the customer.
              </p>
              
              <!-- Yesp Tech Solutions Branding -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <div style="margin-bottom: 16px;">
                  <span style="display: inline-block; background-color: #2563eb; color: white; padding: 6px 16px; border-radius: 4px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                    Powered By
                  </span>
                </div>
                <h3 style="margin: 0 0 8px 0; color: #2563eb; font-size: 18px; font-weight: 700; letter-spacing: -0.025em;">
                  Yesp Tech Solutions
                </h3>
                <p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 400;">
        
                </p>
              </div>
              
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                  © 2025 Yesp Tech Solutions. All rights reserved.
                </p>
              </div>
            </div>

          </div>
        </body>
        </html>
      `,
      // Clean plain text version
      text: `
NEW CONTACT FORM SUBMISSION - Arrow Structures

HIGH PRIORITY

Contact Information:
===================
Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
========
${message}

Quick Actions:
- Call: ${phone}
- Email: ${email}

Response Required:
Please respond to this inquiry within 24 hours to maintain excellent customer service standards.

---
POWERED BY Yesp Tech Solutions

© 2025 Yesp Tech Solutions. All rights reserved.
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    return NextResponse.json(
      {
        message: "Email sent successfully",
        messageId: info.messageId,
        status: "delivery_confirmed",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Detailed error sending email:", error)

    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        return NextResponse.json({ error: "Email authentication failed" }, { status: 500 })
      }
      if (error.message.includes("Network")) {
        return NextResponse.json({ error: "Network connection error" }, { status: 500 })
      }
    }

    return NextResponse.json(
      {
        error: "Failed to send email. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
