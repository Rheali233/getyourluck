import React from 'react';
import { cn } from '@/utils/classNames';
import { getCdnBaseUrl } from '@/config/environment';

export interface ArticleContentProps {
  html?: string; // 若传入Markdown，将自动进行轻量转换后再渲染
  className?: string;
}

// 简单TOC生成：基于渲染后DOM中的 h2/h3 生成目录
export const ArticleContent: React.FC<ArticleContentProps> = ({ html, className }) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // 轻量 Markdown → HTML 转换（不引入外部依赖；仅处理常见结构）
  const toHtml = React.useCallback((src?: string): string => {
    if (!src) return '';
    const looksLikeMarkdown = !src.includes('<') && /(^|\n)#{1,6}\s|(^|\n)-\s|\n\n/.test(src);
    if (!looksLikeMarkdown) return src;

    const lines = src.split(/\n/);
    const htmlParts: string[] = [];
    let inList = false;
    const closeList = () => { if (inList) { htmlParts.push('</ul>'); inList = false; } };
    for (const raw of lines) {
      const line = raw.trim();
      if (line.startsWith('### ')) { closeList(); htmlParts.push(`<h3>${escapeHtml(line.slice(4))}</h3>`); continue; }
      if (line.startsWith('## ')) { closeList(); htmlParts.push(`<h2>${escapeHtml(line.slice(3))}</h2>`); continue; }
      if (line.startsWith('# ')) { closeList(); htmlParts.push(`<h1>${escapeHtml(line.slice(2))}</h1>`); continue; }
      if (line.startsWith('- ')) {
        if (!inList) { htmlParts.push('<ul>'); inList = true; }
        htmlParts.push(`<li>${escapeInline(line.slice(2))}</li>`);
        continue;
      }
      if (line === '') { closeList(); continue; }
      // 粗体与斜体（简单处理 **text** / *text*）
      const formatted = escapeInline(line)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      htmlParts.push(`<p>${formatted}</p>`);
    }
    closeList();
    return htmlParts.join('');
  }, []);

  const escapeHtml = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const escapeInline = (s: string) => {
    // 🔥 修复：处理图片URL，为相对路径添加CDN前缀
    const processImageUrl = (url: string): string => {
      if (!url) return '';
      if (url.startsWith('http')) return url; // 外部链接直接返回
      if (url.startsWith('/')) {
        return `${getCdnBaseUrl()}${url}`;
      }
      return url;
    };

    // 链接与图片（不引入额外库的安全处理）
    const img = s.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, alt, url) => {
      const processedUrl = processImageUrl(url);
      return `<img src="${escapeHtml(processedUrl)}" alt="${escapeHtml(alt)}" loading="lazy" />`;
    });
    return img.replace(/\[(.*?)\]\((.*?)\)/g, (_m, text, url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(text)}</a>`);
  };

  const decodeEntities = React.useCallback((src: string): string => {
    // 仅解码常见实体，防止标签被错误以文本显示（内容来源受控于后台导入脚本）
    return src
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }, []);

  const computedHtml = React.useMemo(() => {
    const raw = toHtml(html);
    // 若后端内容带有实体（例如 &lt;img ...&gt;），进行一次解码以正确渲染
    let decoded = raw ? decodeEntities(raw) : '';
    
    // 🔥 修复：为HTML中的相对路径图片添加CDN前缀
    // 替换 <img src="/xxx" 为 <img src="CDN_BASE_URL/xxx"
    const cdnBaseUrl = getCdnBaseUrl();
    decoded = decoded.replace(/<img\s+([^>]*\s)?src="(\/[^"]+)"/gi, (match, attrs, src) => {
      const fullUrl = `${cdnBaseUrl}${src}`;
      return `<img ${attrs || ''}src="${fullUrl}"`;
    });
    
    return decoded;
  }, [html, toHtml, decodeEntities]);

  return (
    <div className={cn('grid grid-cols-1 gap-8', className)}>
      <div
        className={cn(
          // 强化排版：字体大小、行高、间距、列表/标题样式
          'prose prose-gray max-w-none',
          '[&>p]:leading-7 [&>p]:my-4',
          '[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-10 [&>h2]:mb-4',
          '[&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3',
          '[&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:my-2',
          '[&>img]:rounded-lg [&>img]:my-6',
          '[&>a]:text-primary-700 hover:[&>a]:underline'
        )}
        ref={contentRef}
        // 清理多余的空段落后再渲染
        dangerouslySetInnerHTML={{ __html: (computedHtml || '').replace(/<p><\/p>/g, '') }}
      />
    </div>
  );
};

export default ArticleContent;


