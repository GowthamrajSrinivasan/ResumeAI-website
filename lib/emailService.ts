import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.zeptomail.in",
      port: 587,
      secure: false,
      auth: {
        user: "emailapikey",
        pass: process.env.ZEPTO_MAIL_API_KEY || ""
      }
    });
  }

  async sendEmail(config: EmailConfig): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.ZEPTO_MAIL_FROM_NAME || 'Requill Team'}" <${process.env.ZEPTO_MAIL_FROM_EMAIL || 'noreply@requill.executivesai.pro'}>`,
        to: config.to,
        subject: config.subject,
        html: config.html,
        text: config.text
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName?: string): Promise<boolean> {
    const welcomeTemplate = this.getWelcomeEmailTemplate(userName, userEmail);
    
    return await this.sendEmail({
      to: userEmail,
      subject: 'Welcome to Requill - Your AI-Powered Study Companion!',
      html: welcomeTemplate.html,
      text: welcomeTemplate.text
    });
  }

  private getWelcomeEmailTemplate(userName?: string, userEmail?: string) {
    const displayName = userName || 'there';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Requill</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 30px 20px; }
            .welcome-text { font-size: 18px; margin-bottom: 20px; }
            .features { background: #f8fafc; border-radius: 6px; padding: 20px; margin: 20px 0; }
            .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #2563eb; font-weight: bold; }
            .cta { text-align: center; margin: 30px 0; }
            .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 Welcome to Requill!</h1>
            </div>
            <div class="content">
                <div class="welcome-text">
                    Hi ${displayName},
                </div>
                <p>Welcome to Requill, your AI-powered study companion! We're excited to have you join our community of learners who are transforming the way they study and retain information.</p>
                
                <div class="features">
                    <h3 style="margin-top: 0; color: #2563eb;">What you can do with Requill:</h3>
                    <div class="feature-item">AI-powered content analysis and summarization</div>
                    <div class="feature-item">Intelligent study session planning</div>
                    <div class="feature-item">Personalized learning recommendations</div>
                    <div class="feature-item">Progress tracking and analytics</div>
                    <div class="feature-item">Seamless integration with your workflow</div>
                </div>

                <p>Your account is now active and ready to use. Start by exploring our features and see how Requill can enhance your learning experience.</p>

                <div class="cta">
                    <a href="https://requill.executivesai.pro/dashboard" class="cta-button">Get Started →</a>
                </div>

                <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>

                <p>Happy studying!<br>The Requill Team</p>
            </div>
            <div class="footer">
                <p>© 2025 Requill - Powered by ExecutivesAI. All rights reserved.</p>
                <p>This email was sent to ${userEmail}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const text = `
Welcome to Requill, ${displayName}!

We're excited to have you join our community of learners who are transforming the way they study and retain information.

What you can do with Requill:
• AI-powered content analysis and summarization
• Intelligent study session planning  
• Personalized learning recommendations
• Progress tracking and analytics
• Seamless integration with your workflow

Your account is now active and ready to use. Start by exploring our features and see how Requill can enhance your learning experience.

Visit your dashboard: https://requill.executivesai.pro/dashboard

If you have any questions or need assistance, don't hesitate to reach out to our support team.

Happy studying!
The Requill Team

© 2025 Requill - Powered by ExecutivesAI. All rights reserved.
    `;

    return { html, text };
  }
}

export const emailService = new EmailService();