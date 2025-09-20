const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const token = process.env.FIGMA_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY;

if (!token || !fileKey) {
  console.error('Missing FIGMA_TOKEN or FIGMA_FILE_KEY');
  process.exit(1);
}

(async () => {
  try {
    const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;
    const res = await axios.get(url, { headers: { 'X-Figma-Token': token } });

    const outDir = path.join(process.cwd(), 'src', 'theme');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, 'figma-variables.json'),
      JSON.stringify(res.data, null, 2)
    );

    console.log('Wrote src/theme/figma-variables.json');
  } catch (e) {
    console.error(e?.response?.data || e.message);
    process.exit(1);
  }
})();
