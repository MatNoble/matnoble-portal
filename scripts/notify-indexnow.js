import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://matnoble.top';
const API_KEY = '7c6a9686414144409395982823617300';
const SITEMAP_PATH = path.resolve('docs/.vitepress/dist/sitemap.xml');

async function notifyIndexNow() {
  try {
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.error('Sitemap not found at:', SITEMAP_PATH);
      process.exit(1);
    }

    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const urls = sitemapContent.match(/<loc>(.*?)<\/loc>/g)
      ?.map(val => val.replace(/<\/?loc>/g, '')) || [];

    if (urls.length === 0) {
      console.log('No URLs found in sitemap.');
      return;
    }

    console.log(`Found ${urls.length} URLs. Submitting to IndexNow...`);

    const response = await axios.post('https://api.indexnow.org/indexnow', {
      host: 'matnoble.top',
      key: API_KEY,
      keyLocation: `${SITE_URL}/${API_KEY}.txt`,
      urlList: urls
    });

    if (response.status === 200) {
      console.log('Successfully submitted to IndexNow!');
    } else {
      console.error('Failed to submit. Status:', response.status);
    }
  } catch (error) {
    console.error('Error during IndexNow submission:', error.message);
    process.exit(1);
  }
}

notifyIndexNow();
