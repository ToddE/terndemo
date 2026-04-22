import fs from 'fs';
import path from 'path';

const DIST_DIR = './dist/client';

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${filePath}`);
    process.exit(1);
  }
}

console.log('🔍 Verifying build output...');

// Check essential files
checkFileExists(path.join(DIST_DIR, 'index.html'));
checkFileExists(path.join(DIST_DIR, 'about-us/index.html'));
checkFileExists(path.join(DIST_DIR, 'the-tern-solution/index.html'));
checkFileExists(path.join(DIST_DIR, 'news-resources/index.html'));
checkFileExists(path.join(DIST_DIR, 'admin/index.html'));
checkFileExists(path.join(DIST_DIR, 'admin/config.yml'));

// Check for at least one news item
const newsDir = path.join(DIST_DIR, 'news-resources');
const newsItems = fs.readdirSync(newsDir).filter(f => f !== 'index.html');
if (newsItems.length === 0) {
  console.error('❌ No news items found in build output!');
  process.exit(1);
}

console.log('✅ Build verification passed!');
