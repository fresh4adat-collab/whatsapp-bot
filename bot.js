const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const http = require('http');

let qrImageUrl = null;
let botReady = false;

// Simple web server to display QR
http.createServer(async (req, res) => {
    if (botReady) {
        res.writeHead(200);
        res.end('<h1>✅ Bot is connected and running!</h1>');
    } else if (qrImageUrl) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h2>Scan this QR with WhatsApp</h2>
            <img src="${qrImageUrl}" style="width:300px;height:300px"/>
            <p>Refresh if expired</p>
        `);
    } else {
        res.writeHead(200);
        res.end('<h1>⏳ Waiting for QR code...</h1>');
    }
}).listen(process.env.PORT || 3000, () => {
    console.log('✅ QR server running');
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: '/opt/render/.cache/puppeteer/chrome/linux-146.0.7680.31/chrome-linux64/chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
        ]
    }
});

client.on('qr', async (qr) => {
    console.log('📱 QR received - open your Render URL to scan');
    qrImageUrl = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
    console.log('✅ Bot is ready!');
    botReady = true;
    qrImageUrl = null;
});

client.on('auth_failure', (msg) => {
    console.error('❌ Auth failure:', msg);
});

client.on('disconnected', (reason) => {
    console.warn('⚠️ Disconnected:', reason);
    botReady = false;
});

client.on('message', async (message) => {
    const msg = message.body;
    try {
        if (
            msg.includes('🌿 FRESH ADAT ORDER') ||
            msg.includes('🛒 Items:') ||
            msg.includes('💰 TOTAL:')
        ) {
            await message.reply(
`🌿 Thank you for contacting Fresh Adat.
Your order has been received ✅
We'll check it and reply shortly.
📍 Delivery available within 5 KM from Adat
📞 9496840336
Thank you for supporting fresh local vegetables 🥬`
            );
        } else {
            await message.reply(
`Welcome to Fresh Adat 👋
Please place your order through our website first.
After sending the order, you can continue the chat here for support or updates.
🌐 Order Here:
https://freshadat.store
Thank you 😊`
            );
        }
    } catch (err) {
        console.error('❌ Reply error:', err);
    }
});

process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
});

client.initialize().catch((err) => {
    console.error('💥 Failed to initialize client:', err);
    process.exit(1);
});
