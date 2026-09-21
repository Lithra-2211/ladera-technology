const https = require('https');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const options = {
  hostname: 'api.github.com',
  path: '/repos/twentyhq/twenty/git/trees/main?recursive=1',
  headers: { 'User-Agent': 'Node.js' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const tree = JSON.parse(data).tree;
    let missingCount = 0;
    for (const item of tree) {
      if (item.type === 'blob' && item.path.startsWith('packages/twenty-server/src/')) {
        const localPath = path.join('c:\\Users\\admin\\Downloads\\twenty-main (1)\\twenty-main\\separated-projects\\twenty-backend', item.path);
        if (localPath.length > 250) {
          if (!fs.existsSync(localPath)) {
            console.log('Missing file found: ' + localPath);
            fs.mkdirSync(path.dirname(localPath), { recursive: true });
            const url = 'https://raw.githubusercontent.com/twentyhq/twenty/main/' + item.path;
            console.log('Downloading ' + url);
            execSync(`curl.exe -s -o "${localPath}" "${url}"`);
            missingCount++;
          }
        }
      }
    }
    console.log('Downloaded ' + missingCount + ' missing files.');
  });
}).on('error', (e) => {
  console.error(e);
});
