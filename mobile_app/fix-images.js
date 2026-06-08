const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.toLowerCase().endsWith('.png')) {
      const tempPath = fullPath + '.temp.png';
      console.log(`Fixing ${fullPath}...`);
      try {
        await sharp(fullPath).png().toFile(tempPath);
        fs.unlinkSync(fullPath);
        fs.renameSync(tempPath, fullPath);
        console.log(`  -> Fixed successfully.`);
      } catch (err) {
        console.error(`  -> Error fixing ${file}:`, err.message);
      }
    }
  }
}

async function run() {
  console.log('Starting PNG fixer...');
  await processDirectory(path.join(__dirname, 'assets'));
  console.log('Done fixing PNGs!');
}

run();
