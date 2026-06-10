const fs = require('fs');
const https = require('https');
https.get('https://raw.githubusercontent.com/aabounegm/morocco-geojson/master/morocco.geojson', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => fs.writeFileSync('public/morocco.json', data));
});
