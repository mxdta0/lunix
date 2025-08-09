const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { replyWithOpenRouter } = require('./openrouter');
const { infoMessage } = require('./utils');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, auth: state });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg || !msg.message || !msg.key.fromMe) return;
    const content = msg.message?.conversation || '';

    if (content.startsWith('/ping')) {
      await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong! Latency OK.' });
    } else if (content.startsWith('/info')) {
      await sock.sendMessage(msg.key.remoteJid, { text: infoMessage });
    } else {
      const reply = await replyWithOpenRouter(content);
      await sock.sendMessage(msg.key.remoteJid, { text: reply });
    }
  });
}

startBot();
