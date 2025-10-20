/**
 * SEO工具页面
 * 提供各种SEO工具和监控功能
 */

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { SEODashboard } from '@/components/SEODashboard';
import { generateSEOReport, exportSEOReport, exportSEOReportCSV } from '@/utils/seoReportGenerator';
import { generateSitemap, generateSitemapXML } from '@/utils/sitemapGenerator';
import { generateRobotsTxt } from '@/utils/robotsGenerator';
import { generateCompleteSearchConsoleCode } from '@/utils/googleSearchConsole';
import type { SEOReport } from '@/utils/seoReportGenerator';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

export const SEOToolsPage: React.FC = () => {
  const [seoReport, setSeoReport] = useState<SEOReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'reports'>('dashboard');
  
  // 记录页面访问事件
  React.useEffect(() => {
    const base = buildBaseContext();
    trackEvent({
      eventType: 'page_view',
      ...base,
      data: { 
        route: '/seo-tools', 
        pageType: 'seo_tools'
      },
    });
  }, []);

  const handleGenerateReport = async () => {
    // 记录工具使用事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'tool_use',
      ...base,
      data: { 
        toolType: 'seo_report_generator',
        toolName: 'SEO Report Generator'
      },
    });
    
    setIsGenerating(true);
    try {
      const report = await generateSEOReport();
      setSeoReport(report);
    } catch (error) {
      } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = (format: 'json' | 'csv') => {
    if (!seoReport) return;
    
    const content = format === 'json' 
      ? exportSEOReport(seoReport)
      : exportSEOReportCSV(seoReport);
    
    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateSitemap = async () => {
    try {
      const paths = [
        '/', '/tests', '/psychology', '/career', '/astrology', 
        '/tarot', '/numerology', '/learning', '/relationship',
        '/about', '/blog', '/terms', '/privacy', '/cookies'
      ];
      const sitemap = generateSitemap(paths);
      const xml = generateSitemapXML(sitemap);
      
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      }
  };

  const handleGenerateRobots = async () => {
    try {
      const robots = generateRobotsTxt();
      
      const blob = new Blob([robots], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robots.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      }
  };

  const handleGenerateSearchConsoleCode = () => {
    const code = generateCompleteSearchConsoleCode({
      siteUrl: 'https://selfatlas.com',
      enableIndexing: true,
      enablePerformanceTracking: true
    });
    
    navigator.clipboard.writeText(code);
    alert('Search Console code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Tools & Analytics</h1>
          <p className="text-gray-600">Monitor and optimize your website's SEO performance</p>
        </div>

        {/* 标签导航 */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tools'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        {/* 内容区域 */}
        {activeTab === 'dashboard' && (
          <SEODashboard />
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sitemap生成器 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sitemap Generator</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate XML sitemap for better search engine indexing.
              </p>
              <Button
                onClick={handleGenerateSitemap}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Generate Sitemap
              </Button>
            </Card>

            {/* Robots.txt生成器 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Robots.txt Generator</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create robots.txt to control search engine crawling.
              </p>
              <Button
                onClick={handleGenerateRobots}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Generate Robots.txt
              </Button>
            </Card>

            {/* Search Console代码生成器 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Search Console Code</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate Google Search Console integration code.
              </p>
              <Button
                onClick={handleGenerateSearchConsoleCode}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Copy Code
              </Button>
            </Card>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* 报告生成 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">SEO Report Generator</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate comprehensive SEO analysis report for your website.
              </p>
              <div className="flex space-x-4">
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
                {seoReport && (
                  <>
                    <Button
                      onClick={() => handleExportReport('json')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Export JSON
                    </Button>
                    <Button
                      onClick={() => handleExportReport('csv')}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Export CSV
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* 报告显示 */}
            {seoReport && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 总体分数 */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {seoReport.overallScore}/100
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {seoReport.overallScore >= 80 ? 'Excellent' :
                       seoReport.overallScore >= 60 ? 'Good' :
                       seoReport.overallScore >= 40 ? 'Fair' : 'Poor'}
                    </div>
                    <p className="text-sm text-gray-600">{seoReport.summary}</p>
                  </div>
                </Card>

                {/* 详细指标 */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Technical SEO</span>
                      <span className="font-medium">{seoReport.technicalSEO.score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Content SEO</span>
                      <span className="font-medium">{seoReport.contentSEO.score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Performance SEO</span>
                      <span className="font-medium">{seoReport.performanceSEO.score}/100</span>
                    </div>
                  </div>
                </Card>

                {/* 建议列表 */}
                <Card className="p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {seoReport.recommendations.map((rec, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="font-medium">{rec.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{rec.description}</p>
                        <p className="text-xs text-gray-500">
                          <strong>Action:</strong> {rec.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
