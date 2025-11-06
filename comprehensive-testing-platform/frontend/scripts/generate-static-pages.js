/**
 * 静态页面生成脚本
 * 为关键页面生成静态HTML，提升SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 关键页面配置
const CRITICAL_PAGES = [
  {
    path: '/',
    title: 'Comprehensive Testing Platform - Professional Online Tests',
    description: 'Take professional psychological tests, astrological analysis, tarot reading and other online testing services. Discover your personality, career path, and life insights.',
    keywords: 'psychological tests,astrological analysis,tarot reading,career tests,learning ability,emotional relationships'
  },
  {
    path: '/tests/psychology',
    title: 'Professional Psychological Tests | Comprehensive Testing Platform',
    description: 'Take professional psychological tests including MBTI, EQ, PHQ-9, and more. Get detailed personality analysis and insights.',
    keywords: 'psychological tests,MBTI test,emotional intelligence test,personality assessment,mental health test'
  },
  {
    path: '/tests/psychology/mbti',
    title: 'Free MBTI Personality Test | 16 Personalities Assessment',
    description: 'Take the free MBTI personality test to discover your 16 personality type. Get detailed analysis of your strengths, weaknesses, and career preferences.',
    keywords: 'MBTI test,16 personalities,personality type,Myers-Briggs,personality assessment'
  },
  {
    path: '/tests/psychology/eq',
    title: 'Free Emotional Intelligence Test | EQ Assessment',
    description: 'Take our free emotional intelligence test to measure your EQ. Get insights into self-awareness, self-management, and social skills.',
    keywords: 'emotional intelligence test,EQ test,emotional quotient,EI assessment,emotional skills'
  },
  {
    path: '/tests/astrology',
    title: 'Free Astrological Analysis & Birth Chart Reading | Comprehensive Testing Platform',
    description: 'Get free astrological analysis, birth chart reading, horoscope predictions, and compatibility tests. Professional astrological insights.',
    keywords: 'astrological analysis,birth chart reading,horoscope,astrology compatibility,zodiac signs'
  },
  {
    path: '/tests/tarot',
    title: 'Online Tarot Card Reading & Fortune Telling | Comprehensive Testing Platform',
    description: 'Get free online tarot card reading, fortune telling, and spiritual guidance. Professional tarot interpretations and insights.',
    keywords: 'tarot reading,fortune telling,tarot cards,spiritual guidance,tarot interpretation'
  },
  {
    path: '/tests/career',
    title: 'Career Assessment & Job Matching Tests | Comprehensive Testing Platform',
    description: 'Take professional career assessment tests including DISC, Holland Code, and leadership tests. Find your ideal career path.',
    keywords: 'career assessment,job matching,DISC test,Holland Code,leadership test,career guidance'
  },
  {
    path: '/tests/relationship',
    title: 'Relationship & Love Compatibility Tests | Comprehensive Testing Platform',
    description: 'Take relationship compatibility tests, love language assessment, and interpersonal skills tests. Improve your relationships.',
    keywords: 'relationship test,love compatibility,love language test,interpersonal skills,relationship advice'
  }
];

// 生成静态HTML模板
function generateStaticHTML(page) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${page.description}" />
  <meta name="keywords" content="${page.keywords}" />
  <title>${page.title}</title>
  
  <!-- Open Graph -->
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://selfatlas.com${page.path}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.title}" />
  <meta name="twitter:description" content="${page.description}" />
  
  <!-- SEO -->
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow" />
  <meta name="author" content="Comprehensive Testing Platform" />
  <link rel="canonical" href="https://selfatlas.com${page.path}" />
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${page.title}",
    "description": "${page.description}",
    "url": "https://selfatlas.com${page.path}",
    "publisher": {
      "@type": "Organization",
      "name": "Comprehensive Testing Platform",
      "url": "https://selfatlas.com"
    }
  }
  </script>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/src/main.tsx" as="script" />
  <link rel="preload" href="/src/styles/index.css" as="style" />
</head>
<body>
  <div id="root">
    <!-- Fallback content for SEO -->
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h1 style="font-size: 3rem; margin-bottom: 1rem; text-align: center;">${page.title.split('|')[0].trim()}</h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem; text-align: center; max-width: 600px;">${page.description}</p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
        <button style="padding: 12px 24px; background: rgba(255,255,255,0.2); border: 2px solid white; border-radius: 8px; color: white; font-size: 1rem; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
          Start Test
        </button>
        <button style="padding: 12px 24px; background: transparent; border: 2px solid white; border-radius: 8px; color: white; font-size: 1rem; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
          Learn More
        </button>
      </div>
    </div>
  </div>
  
  <!-- Loading indicator -->
  <div id="loading" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; display: flex; align-items: center; justify-content: center; z-index: 9999;">
    <div style="text-align: center;">
      <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
      <p style="color: #666; font-size: 16px;">Loading...</p>
    </div>
  </div>
  
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  
  <script type="module" src="/src/main.tsx"></script>
  
  <script>
    // Hide loading indicator when React app loads
    window.addEventListener('load', function() {
      setTimeout(function() {
        const loading = document.getElementById('loading');
        if (loading) {
          loading.style.display = 'none';
        }
      }, 1000);
    });
  </script>
</body>
</html>`;
}

// 创建输出目录
const outputDir = path.join(__dirname, '../dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成静态页面
console.log('🚀 Generating static pages for SEO...');

CRITICAL_PAGES.forEach(page => {
  const html = generateStaticHTML(page);
  const filePath = path.join(outputDir, page.path === '/' ? 'index.html' : `${page.path}/index.html`);
  
  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, html);
  console.log(`✅ Generated: ${filePath}`);
});

console.log('🎉 Static pages generation completed!');
console.log(`Generated ${CRITICAL_PAGES.length} static pages for better SEO.`);
