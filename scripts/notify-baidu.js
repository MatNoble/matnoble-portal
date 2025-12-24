import axios from 'axios';
import fs from 'fs';
import path from 'path';

// --- 配置区域 ---
const SITE_URL = 'https://matnoble.top';
const BAIDU_TOKEN = process.env.BAIDU_TOKEN || ''; // 建议在 Vercel 环境变量中设置 BAIDU_TOKEN
// 如果本地运行且没有设置环境变量，请在此处填入你的 Token，但不要提交到 GitHub！
// const BAIDU_TOKEN = 'your_token_here'; 

const SITEMAP_PATH = path.resolve('docs/.vitepress/dist/sitemap.xml');

async function notifyBaidu() {
  if (!BAIDU_TOKEN) {
    console.log('⚠️  Baidu Token not found. Skipping Baidu submission.');
    console.log('   (Set BAIDU_TOKEN environment variable or edit scripts/notify-baidu.js)');
    return;
  }

  try {
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.error('❌ Sitemap not found at:', SITEMAP_PATH);
      process.exit(1);
    }

    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const urls = sitemapContent.match(/<loc>(.*?)<\/loc>/g)
      ?.map(val => val.replace(/<\/?loc>/g, '')) || [];

    if (urls.length === 0) {
      console.log('No URLs found in sitemap.');
      return;
    }

    console.log(`Found ${urls.length} URLs. Submitting to Baidu...`);

    // 百度 API 接口
    const apiEndpoint = `http://data.zz.baidu.com/urls?site=${SITE_URL}&token=${BAIDU_TOKEN}`;

    const response = await axios.post(apiEndpoint, urls.join('\n'), {
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    if (response.data && response.data.success) {
      console.log(`✅ Successfully submitted ${response.data.success} URLs to Baidu!`);
      console.log(`   Remaining quota: ${response.data.remain}`);
    } else {
      console.error('❌ Failed to submit to Baidu:', response.data);
    }

  } catch (error) {
    if (error.response) {
       console.error('❌ Baidu API Error:', error.response.data);
    } else {
       console.error('❌ Error during Baidu submission:', error.message);
    }
    // 不退出进程，以免阻塞后续流程
  }
}

notifyBaidu();
