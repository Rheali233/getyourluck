/**
 * SEO监控仪表板
 * 用于监控和展示SEO相关指标
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { usePerformance } from '@/hooks/usePerformance';
import { generateSitemap, generateSitemapXML } from '@/utils/sitemapGenerator';
import { generateRobotsTxt } from '@/utils/robotsGenerator';
import { generateCompleteSearchConsoleCode } from '@/utils/googleSearchConsole';

interface SEODashboardProps {
  className?: string;
}

export const SEODashboard: React.FC<SEODashboardProps> = ({ className }) => {
  const [sitemapGenerated, setSitemapGenerated] = useState(false);
  const [robotsGenerated, setRobotsGenerated] = useState(false);
  const [searchConsoleCode, setSearchConsoleCode] = useState('');
  
  const { metrics, score, suggestions } = usePerformance();

  useEffect(() => {
    // 生成Search Console代码
    const code = generateCompleteSearchConsoleCode({
      siteUrl: 'https://selfatlas.com',
      enableIndexing: true,
      enablePerformanceTracking: true
    });
    setSearchConsoleCode(code);
  }, []);

  const handleGenerateSitemap = async () => {
    try {
      const paths = [
        '/', '/tests', '/psychology', '/career', '/astrology', 
        '/tarot', '/numerology', '/learning', '/relationship',
        '/about', '/blog', '/terms', '/privacy', '/cookies'
      ];
      const sitemap = generateSitemap(paths);
      const xml = generateSitemapXML(sitemap);
      
      // 下载sitemap.xml
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSitemapGenerated(true);
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  };

  const handleGenerateRobots = async () => {
    try {
      const robots = generateRobotsTxt();
      
      // 下载robots.txt
      const blob = new Blob([robots], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robots.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setRobotsGenerated(true);
    } catch (error) {
      console.error('Error generating robots.txt:', error);
    }
  };

  const handleCopySearchConsoleCode = () => {
    navigator.clipboard.writeText(searchConsoleCode);
    alert('Search Console code copied to clipboard!');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900">SEO Dashboard</h2>
      
      {/* 性能指标 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">LCP</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {metrics.cls ? Math.round(metrics.cls * 1000) / 1000 : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">CLS</div>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Optimization Suggestions:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* SEO工具 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sitemap生成器 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sitemap Generator</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate and download sitemap.xml for better search engine indexing.
          </p>
          <button
            onClick={handleGenerateSitemap}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {sitemapGenerated ? 'Sitemap Generated ✓' : 'Generate Sitemap'}
          </button>
        </Card>

        {/* Robots.txt生成器 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Robots.txt Generator</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate robots.txt to control search engine crawling.
          </p>
          <button
            onClick={handleGenerateRobots}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            {robotsGenerated ? 'Robots.txt Generated ✓' : 'Generate Robots.txt'}
          </button>
        </Card>
      </div>

      {/* Google Search Console代码 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Google Search Console Integration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Copy this code to your HTML head section for Google Search Console integration.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-xs overflow-x-auto">
            <code>{searchConsoleCode}</code>
          </pre>
        </div>
        <button
          onClick={handleCopySearchConsoleCode}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Copy Code
        </button>
      </Card>

      {/* SEO检查清单 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SEO Checklist</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={sitemapGenerated} readOnly className="rounded" />
            <span className="text-sm">Sitemap.xml generated and submitted</span>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={robotsGenerated} readOnly className="rounded" />
            <span className="text-sm">Robots.txt configured</span>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={true} readOnly className="rounded" />
            <span className="text-sm">Structured data implemented</span>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={true} readOnly className="rounded" />
            <span className="text-sm">Meta tags optimized</span>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={true} readOnly className="rounded" />
            <span className="text-sm">Internal linking strategy implemented</span>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={true} readOnly className="rounded" />
            <span className="text-sm">Performance optimization completed</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
