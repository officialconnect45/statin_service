const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const input = path.join(__dirname, '..', 'public', 'statin-logo.jpg');
  
  // Crop squircle bounding box (with slight breathing room)
  const cropped = await sharp(input)
    .extract({ left: 120, top: 110, width: 780, height: 780 })
    .toBuffer();

  // Create rounded squircle mask with smooth curvature
  const size = 780;
  const radius = 210;
  const maskSvg = Buffer.from(
    '<svg width="' + size + '" height="' + size + '"><rect x="0" y="0" width="' + size + '" height="' + size + '" rx="' + radius + '" ry="' + radius + '" fill="#fff" /></svg>'
  );

  // Masked transparent squircle
  const transparentSquircle = await sharp(cropped)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Save transparent PNG master for brand assets
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'brand', 'statin-logo.png'), transparentSquircle);
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'statin-logo.png'), transparentSquircle);

  // High-res PNG icons
  await sharp(transparentSquircle).resize(512, 512).toFile(path.join(__dirname, '..', 'public', 'icon-512.png'));
  await sharp(transparentSquircle).resize(192, 192).toFile(path.join(__dirname, '..', 'public', 'icon-192.png'));
  await sharp(transparentSquircle).resize(180, 180).toFile(path.join(__dirname, '..', 'src', 'app', 'apple-icon.png'));
  await sharp(transparentSquircle).resize(180, 180).toFile(path.join(__dirname, '..', 'public', 'apple-icon.png'));
  await sharp(transparentSquircle).resize(32, 32).toFile(path.join(__dirname, '..', 'src', 'app', 'icon.png'));
  await sharp(transparentSquircle).resize(32, 32).toFile(path.join(__dirname, '..', 'public', 'icon.png'));

  // Multi-size favicon.ico (16x16, 32x32, 48x48)
  const png16 = await sharp(transparentSquircle).resize(16, 16).png().toBuffer();
  const png32 = await sharp(transparentSquircle).resize(32, 32).png().toBuffer();
  const png48 = await sharp(transparentSquircle).resize(48, 48).png().toBuffer();

  function buildIco(pngs) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(pngs.length, 4);

    let offset = 6 + pngs.length * 16;
    const entries = [];
    const bodies = [];

    for (const item of pngs) {
      const entry = Buffer.alloc(16);
      entry.writeUInt8(item.size, 0);
      entry.writeUInt8(item.size, 1);
      entry.writeUInt8(0, 2);
      entry.writeUInt8(0, 3);
      entry.writeUInt16LE(1, 4);
      entry.writeUInt16LE(32, 6);
      entry.writeUInt32LE(item.buf.length, 8);
      entry.writeUInt32LE(offset, 12);
      entries.push(entry);
      bodies.push(item.buf);
      offset += item.buf.length;
    }

    return Buffer.concat([header, ...entries, ...bodies]);
  }

  const icoBuf = buildIco([
    { size: 16, buf: png16 },
    { size: 32, buf: png32 },
    { size: 48, buf: png48 },
  ]);

  fs.writeFileSync(path.join(__dirname, '..', 'src', 'app', 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), icoBuf);
  console.log('Successfully generated all favicons and icons!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
