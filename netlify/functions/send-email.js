const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }

    try {
        const { companyName, industry, contactName, email, phone, companySize, comments } = JSON.parse(event.body);

        // Email transporter configuration
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email to phil@vu.co.uk
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'phil@vu.co.uk',
            subject: `New AI Business Inquiry from ${companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px;">
                    <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <h2 style="color: #333; margin-bottom: 20px; text-align: center; font-size: 24px;">🤖 New AI Business Inquiry</h2>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #495057; margin-bottom: 15px; font-size: 18px;">Company Information</h3>
                            <p style="margin: 8px 0; color: #6c757d;"><strong>Company Name:</strong> ${companyName}</p>
                            <p style="margin: 8px 0; color: #6c757d;"><strong>Industry:</strong> ${industry}</p>
                            <p style="margin: 8px 0; color: #6c757d;"><strong>Company Size:</strong> ${companySize}</p>
                        </div>
                        
                        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #1565c0; margin-bottom: 15px; font-size: 18px;">Contact Details</h3>
                            <p style="margin: 8px 0; color: #1976d2;"><strong>Name:</strong> ${contactName}</p>
                            <p style="margin: 8px 0; color: #1976d2;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1976d2; text-decoration: none;">${email}</a></p>
                            <p style="margin: 8px 0; color: #1976d2;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        </div>
                        
                        ${comments ? `
                        <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #7b1fa2; margin-bottom: 15px; font-size: 18px;">AI Requirements</h3>
                            <p style="margin: 8px 0; color: #8e24aa; line-height: 1.6;">${comments}</p>
                        </div>
                        ` : ''}
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <p style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">Received on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                            <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">Reply to ${contactName}</a>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        // Auto-reply to the customer
        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for your interest in The Ai Business',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px;">
                    <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <h2 style="color: #333; margin-bottom: 20px; text-align: center; font-size: 24px;">🚀 Welcome to The Future of Business</h2>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear ${contactName},</p>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Thank you for your interest in transforming <strong>${companyName}</strong> with AI solutions! We've received your inquiry and are excited about the potential to revolutionize your business operations.
                        </p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #495057; margin-bottom: 15px; font-size: 18px;">What happens next?</h3>
                            <ul style="color: #6c757d; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Our AI specialists will review your requirements</li>
                                <li>We'll prepare a customized solution proposal</li>
                                <li>Schedule a consultation call within 24 hours</li>
                                <li>Provide a detailed implementation roadmap</li>
                            </ul>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Our team specializes in helping SMEs like yours leverage cutting-edge AI technologies including ChatGPT, Claude, Gemini, and more to streamline operations and drive growth.
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">Questions? Reply to this email or call us directly.</p>
                            <p style="color: #333; font-weight: bold; margin-bottom: 20px;">The Ai Business Team</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(autoReplyOptions);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ message: 'Email sent successfully' })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ error: 'Failed to send email' })
        };
    }
};
