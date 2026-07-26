import sharp from 'sharp';

const jobs = [
  ['assets/dashavaani-icon.svg', 'assets/icon.png', 1024],
  ['assets/dashavaani-icon.svg', 'assets/splash-icon.png', 1024],
  ['assets/dashavaani-foreground.svg', 'assets/android-icon-foreground.png', 1024],
  ['assets/dashavaani-icon.svg', 'assets/favicon.png', 256],
];

for (const [source, destination, size] of jobs) {
  await sharp(source).resize(size, size).png().toFile(destination);
}

console.log(`Rendered ${jobs.length} DashaVaani image assets.`);
