const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),

    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', async (message) => {

    const msg = message.body;

    if (
        msg.includes('🌿 FRESH ADAT ORDER') ||
        msg.includes('🛒 Items:') ||
        msg.includes('💰 TOTAL:')
    ) {

        message.reply(
`🌿 Thank you for contacting Puthuma Fresh Adat.

Your order has been received ✅
We’ll check it and reply shortly.

📍 Delivery available within 5 KM from Adat
📞 9496840336

Thank you for supporting fresh local vegetables 🥬`
        );

    } else {

        message.reply(
`Welcome to Fresh Adat👋

Please place your order through our website first.
After sending the order, you can continue the chat here for support or updates.

🌐 Order Here: https://freshadat.store

Thank you 😊`
        );
    }
});

client.initialize();
