const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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

client.on('qr', (qr) => {
    console.log('📱 Scan this QR code:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot is ready!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Auth failure:', msg);
});

client.on('disconnected', (reason) => {
    console.warn('⚠️ Disconnected:', reason);
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
