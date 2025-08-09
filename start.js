const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');
const unzipper = require('unzipper');

const zipUrl = 'https://github.com/mxdta0/lunix/archive/refs/heads/main.zip';
const envPath = './.env';
const appDir = './';

const downloadZip = async () => {
  return new Promise((resolve, reject) => {
    https.get(zipUrl, (res) => {
      res.pipe(unzipper.Extract({ path: appDir })).on('close', resolve).on('error', reject);
    });
  });
};

(async () => {
  console.log('📦 Downloading ZIP...');
  await downloadZip();

  const unzippedFolder = 'lunix-main';
  fs.cpSync(unzippedFolder, appDir, { recursive: true });

  console.log('🔧 Copying .env...');
  fs.copyFileSync(envPath, `${appDir}/.env`);

  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('🚀 Starting bot...');
  execSync('npm run start', { stdio: 'inherit' });
})();
