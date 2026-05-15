const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

// QR Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Ready
client.on('ready', () => {
    console.log('Bot is ready!');
});

// Message Handler
client.on('message', async (message) => {

    const msg = message.body;

    // Detect Fresh Adat Order Format
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

        // Default reply for all other messages
        message.reply(
`Welcome to Fresh Adat👋

Please place your order through our website first.
After sending the order, you can continue the chat here for support or updates.

🌐 Order Here: https://freshadat.store

Thank you 😊`
        );
    }

});

// Start Bot
client.initialize();