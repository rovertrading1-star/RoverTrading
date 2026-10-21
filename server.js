// =============================================================
// ROVER TRADING - Backend Server for Email Notifications
// =============================================================
// Run: npm init -y && npm install express cors nodemailer bcryptjs
// Then: node server.js
// =============================================================

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve all HTML files from current directory
app.use(express.static(path.join(__dirname)));

// =============================================================
// EMAIL SETUP - Configure with your Gmail App Password
// =============================================================
// 1. Go to https://myaccount.google.com/security
// 2. Enable 2-Step Verification
// 3. Create App Password (select "Mail")
// 4. Replace 'YOUR_APP_PASSWORD' below with the 16-char password
// =============================================================

const EMAIL_USER = 'rovertrading1@gmail.com';
const EMAIL_PASS = 'YOUR_APP_PASSWORD'; // ← Replace this

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// =============================================================
// API: Send notification email when new account is created
// =============================================================
app.post('/api/notify-new-account', async (req, res) => {
    const { accountNumber, firstName, lastName, email, cellNumber, createdAt } = req.body;

    const mailOptions = {
        from: `"Rover Trading System" <${EMAIL_USER}>`,
        to: 'rovertrading1@gmail.com',
        subject: `🆕 New Account Created - ${accountNumber}`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a">
            <div style="background:linear-gradient(135deg,#a3e635,#65a30d);padding:24px 32px">
                <h1 style="margin:0;color:#000;font-size:22px">🆕 New Account Created</h1>
                <p style="margin:4px 0 0;color:rgba(0,0,0,.6);font-size:14px">Rover Trading Registration System</p>
            </div>
            <div style="padding:32px">
                <table style="width:100%;border-collapse:collapse">
                    <tr><td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:140px">Account #</td>
                        <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#a3e635;font-weight:bold;font-size:20px;font-family:monospace">${accountNumber}</td></tr>
                    <tr><td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Full Name</td>
                        <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#fff;font-size:15px">${firstName} ${lastName}</td></tr>
                    <tr><td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</td>
                        <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#fff;font-size:15px"><a href="mailto:${email}" style="color:#a3e635">${email}</a></td></tr>
                    <tr><td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Cell Number</td>
                        <td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#fff;font-size:15px">${cellNumber}</td></tr>
                    <tr><td style="padding:12px 0;border-bottom:1px solid #2a2a2a;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Payment</td>
                        <td style="padding:12px 0;border-bottom:1px solid #2a2a2a"><span style="background:rgba(245,158,11,.2);color:#f59e0b;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:bold">UNPAID</span></td></tr>
                    <tr><td style="padding:12px 0;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Created</td>
                        <td style="padding:12px 0;color:#fff;font-size:15px">${new Date(createdAt).toLocaleString('en-ZA')}</td></tr>
                </table>
                <p style="color:#444;font-size:12px;margin-top:24px;margin-bottom:0">Automated notification from Rover Trading</p>
            </div>
            <div style="background:#111;padding:16px 32px;text-align:center">
                <p style="margin:0;color:#444;font-size:11px">© ${new Date().getFullYear()} Rover Trading. All rights reserved.</p>
            </div>
        </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent for new account: ${accountNumber}`);
        res.json({ success: true, message: 'Email sent' });
    } catch (error) {
        console.error('❌ Email error:', error.message);
        res.json({ success: false, message: error.message });
    }
});

// =============================================================
// START SERVER
// =============================================================
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║  🚀 Rover Trading Server Running          ║
║  📡 http://localhost:${PORT}                  ║
║  📧 Email: ${EMAIL_USER}       ║
╚═══════════════════════════════════════════╝
    `);
});