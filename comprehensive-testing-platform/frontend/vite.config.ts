import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'scripts/generate-static-pages.js',
          dest: 'scripts'
        },
        {
          src: 'public/_routes.json',
          dest: '.'
        },
        {
          src: 'functions/_middleware.js',
          dest: 'functions'
        },
        {
          src: 'functions/api/_middleware.js',
          dest: 'functions/api'
        }
      ]
    }),
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境关闭sourcemap以减小bundle大小
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console.log
        drop_debugger: true, // 移除debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除特定console函数
        passes: 2, // 多次压缩优化
      },
      mangle: {
        safari10: true, // 兼容Safari 10
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心框架 - 更细粒度分割
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          state: ['zustand'],
          
          // UI库 - 按使用频率分割
          icons: ['lucide-react'],
          utils: ['clsx', 'tailwind-merge'],
          
          // 按模块分割
          psychology: [
            './src/modules/psychology/components/GenericTestPage.tsx',
            './src/modules/psychology/components/PsychologyHomePage.tsx',
            './src/modules/psychology/components/MBTIResultDisplay.tsx',
            './src/modules/psychology/components/PHQ9ResultDisplay.tsx',
            './src/modules/psychology/components/EQResultDisplay.tsx',
            './src/modules/psychology/components/HappinessResultDisplay.tsx'
          ],
          career: [
            './src/modules/career/components/CareerHomePage.tsx',
            './src/modules/career/components/CareerTestPage.tsx',
            './src/modules/career/components/HollandResultDisplay.tsx',
            './src/modules/career/components/DISCResultDisplay.tsx',
            './src/modules/career/components/LeadershipResultDisplay.tsx'
          ],
          astrology: [
            './src/modules/astrology/components/AstrologyHomePage.tsx',
            './src/modules/astrology/components/FortuneTestPage.tsx',
            './src/modules/astrology/components/CompatibilityTestPage.tsx',
            './src/modules/astrology/components/BirthChartTestPage.tsx'
          ],
                 tarot: [
                   './src/modules/tarot/components/TarotHomePage.tsx',
                   './src/modules/tarot/components/CardDrawingPage.tsx',
                   './src/modules/tarot/components/RecommendationPage.tsx',
                   './src/modules/tarot/components/ReadingResultPage.tsx',
                   './src/modules/tarot/components/LazyTarotCardImage.tsx'
                 ],
                 // 塔罗牌数据文件单独分割
                 'tarot-data': [
                   './src/modules/tarot/data/tarotCards.ts',
                   './src/modules/tarot/data/tarotSpreads.ts'
                 ],
                 // 塔罗牌服务文件
                 'tarot-services': [
                   './src/modules/tarot/services/tarotService.ts',
                   './src/modules/tarot/services/tarotDataLoader.ts'
                 ],
          numerology: [
            './src/modules/numerology/components/NumerologyHomePage.tsx',
            './src/modules/numerology/components/BaZiAnalysisPage.tsx',
            './src/modules/numerology/components/ZodiacAnalysisPage.tsx',
            './src/modules/numerology/components/NameAnalysisPage.tsx',
            './src/modules/numerology/components/ZiWeiAnalysisPage.tsx'
          ],
          learning: [
            './src/modules/learning-ability/components/LearningAbilityHomePage.tsx',
            './src/modules/learning-ability/components/LearningGenericTestPage.tsx'
          ],
          relationship: [
            './src/modules/relationship/components/RelationshipHomePage.tsx'
          ],
          
          // 共享组件
          shared: [
            './src/components/ui',
            './src/components/SEOHead.tsx',
            './src/utils/breadcrumbConfig.ts'
          ]
        },
        // 优化chunk大小
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      },
    },
    // 优化构建性能
    chunkSizeWarningLimit: 1000, // 增加chunk大小警告阈值
    target: 'esnext', // 使用最新的ES特性
    cssCodeSplit: true, // 启用CSS代码分割
    assetsInlineLimit: 4096, // 小于4KB的资源内联
  },
})