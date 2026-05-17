const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

function getChromiumPath() {
    // Dynamically find puppeteer-installed chrome in Render cache
    const puppeteerCache = '/opt/render/.cache/puppeteer/chrome';
    try {
        if (fs.existsSync(puppeteerCache)) {
            const versions = fs.readdirSync(puppeteerCache);
            for (const version of versions) {
                const chromePath = path.join(puppeteerCache, version, 'chrome-linux64', 'chrome');
                if (fs.existsSync(chromePath)) {
                    console.log(`✅ Found browser at: ${chromePath}`);
                    return chromePath;
                }
            }
        }
    } catch (e) {
        console.warn('Cache scan failed:', e.message);
    }

    // Fallback system paths
    const candidates = [
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) {
            console.log(`✅ Found browser at: ${p}`);
            return p;
        }
    }

    console.warn('⚠️ No browser found');
    return undefined;
}

const executablePath = getChromiumPath();
console.log('Using browser at:', executablePath);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath,
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
