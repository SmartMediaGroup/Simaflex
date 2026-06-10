const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/yassineelt/Morocco-Map-GeoJSON/master/Morocco.geojson', (res) => {
  if(res.statusCode !== 200) {
    https.get('https://raw.githubusercontent.com/aabounegm/morocco-geojson/master/morocco.geojson', (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => fs.writeFileSync('src/morocco.json', data2));
    });
    return;
  }
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => fs.writeFileSync('src/morocco.json', data));
});
