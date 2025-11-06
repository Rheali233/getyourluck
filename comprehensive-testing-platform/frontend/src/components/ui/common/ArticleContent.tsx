import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { getCdnBaseUrl } from '@/config/environment';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const rewriteHrefPath = (html: string, legacyPath: string, modernPath: string): string => {
  const escapedLegacy = escapeRegExp(legacyPath);
  const pattern = new RegExp(`href=["']${escapedLegacy}(\\/[^"']*)?["']`, 'gi');
  return html.replace(pattern, (_match, suffix = '') => `href="${modernPath}${suffix || ''}"`);
};

const BLOG_LEGACY_PATTERN = /href=["'](\/blog\/articles\/[^"']+)["']/gi;
const BLOG_ID_PATTERN = /\/blog\/articles\/(.+)$/;

const LEGACY_TEST_PATHS: Array<readonly [string, string]> = [
  ['/psychology', '/tests/psychology'],
  ['/career', '/tests/career'],
  ['/astrology', '/tests/astrology'],
  ['/tarot', '/tests/tarot'],
  ['/numerology', '/tests/numerology'],
  ['/relationship', '/tests/relationship'],
  ['/learning', '/tests/learning'],
  ['/mbti', '/tests/psychology/mbti'],
];

type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const slugifyHeading = (value: string): string => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return normalized || `section-${Math.random().toString(36).slice(2, 8)}`;
};

const enhanceHtmlWithHeadings = (html: string): { html: string; headings: ArticleHeading[] } => {
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return { html, headings: [] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const collectedHeadings: ArticleHeading[] = [];
  const existingIds = new Set<string>();

  doc.querySelectorAll('[id]').forEach((el) => {
    const existingId = el.getAttribute('id');
    if (existingId) {
      existingIds.add(existingId);
    }
  });

  Array.from(doc.querySelectorAll('h2, h3')).forEach((el) => {
    const text = el.textContent?.trim() || '';
    if (!text) {
      return;
    }

    const level: 2 | 3 = el.tagName === 'H2' ? 2 : 3;
    const initialId = el.getAttribute('id') || slugifyHeading(text);
    let candidateId = initialId;
    let suffix = 1;

    while (existingIds.has(candidateId)) {
      candidateId = `${initialId}-${suffix}`;
      suffix += 1;
    }

    existingIds.add(candidateId);
    el.setAttribute('id', candidateId);
    collectedHeadings.push({ id: candidateId, text, level });
  });

  return { html: doc.body.innerHTML, headings: collectedHeadings };
};

export interface ArticleContentProps {
  html?: string; // 若传入Markdown，将自动进行轻量转换后再渲染
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onHeadingsChange?: (headings: ArticleHeading[]) => void;
}

// 简单TOC生成：基于渲染后DOM中的 h2/h3 生成目录
export const ArticleContent: React.FC<ArticleContentProps> = ({ html, className, onHeadingsChange }) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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

  const computedResult = React.useMemo(() => {
    const raw = toHtml(html);
    // 若后端内容带有实体（例如 &lt;img ...&gt;），进行一次解码以正确渲染
    let decoded = raw ? decodeEntities(raw) : '';
    
    // 🔥 修复：为HTML中的相对路径图片添加CDN前缀
    // 替换 <img src="/xxx" 为 <img src="CDN_BASE_URL/xxx"
    const cdnBaseUrl = getCdnBaseUrl();
    decoded = decoded.replace(/<img\s+([^>]*\s)?src="(\/[^"]+)"/gi, (_match, attrs, src) => {
      const fullUrl = `${cdnBaseUrl}${src}`;
      return `<img ${attrs || ''}src="${fullUrl}"`;
    });
    
    // 🔥 修复：转换HTML内容中的旧blog链接格式
    // 将 /blog/articles/{id} 转换为 /blog/{id}（后端API支持通过id或slug获取）
    // 将旧格式的内部链接统一为新格式
    decoded = decoded.replace(BLOG_LEGACY_PATTERN, (match, url) => {
      // 提取id部分
      const idMatch = url.match(BLOG_ID_PATTERN);
      if (idMatch) {
        return `href="/blog/${idMatch[1]}"`;
      }
      return match;
    });
    
    // 🔥 修复：转换旧格式的测试链接到新格式 /tests/* 路径
    decoded = LEGACY_TEST_PATHS.reduce(
      (innerHtml, [legacy, modern]) => rewriteHrefPath(innerHtml, legacy, modern),
      decoded
    );
    
    const ctaMarkup = (() => {
      const buttons = UI_TEXT.blog.detail.ctaButtons || [];
      if (!buttons.length) return '';
      const inner = buttons
        .map((item) => `<a class="blog-cta" href="${item.href}">${item.label}</a>`)
        .join('');
      return `<div class="blog-cta-group">${inner}</div>`;
    })();

    if (ctaMarkup) {
      decoded = decoded.replace(
        /<p>\s*(?:<a[^>]*>\s*Take MBTI Test Now\s*<\/a>\s*(?:•|&bull;|&middot;|·)?\s*)?<a[^>]*>\s*Take MBTI Test Now\s*<\/a>\s*(?:•|&bull;|&middot;|·)?\s*<a[^>]*>\s*Explore Compatibility\s*<\/a>\s*(?:•|&bull;|&middot;|·)?\s*<a[^>]*>\s*Visit Test Center\s*<\/a>\s*<\/p>/gi,
        ctaMarkup
      );

      decoded = decoded.replace(
        /<p>\s*Take MBTI Test Now\s*•\s*Explore Compatibility\s*•\s*Visit Test Center\s*<\/p>/gi,
        ctaMarkup
      );

      decoded = decoded.replace(
        /Take MBTI Test Now\s*•\s*Explore Compatibility\s*•\s*Visit Test Center/gi,
        ctaMarkup
      );
    }

    const enhanced = enhanceHtmlWithHeadings(decoded);
    return enhanced;
  }, [html, toHtml, decodeEntities]);

  React.useEffect(() => {
    if (onHeadingsChange) {
      onHeadingsChange(computedResult.headings);
    }
  }, [onHeadingsChange, computedResult.headings]);

  // 处理内容中的链接点击，拦截旧格式的blog链接
  React.useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      const href = rawHref.trim();
      if (href.length === 0) return;
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      if (href.startsWith('//')) {
        return;
      }

      if (href.startsWith('/blog/') || href.startsWith('/tests/')) {
        e.preventDefault();
        navigate(href);
        return;
      }
    };

    container.addEventListener('click', handleLinkClick);
    return () => {
      container.removeEventListener('click', handleLinkClick);
    };
  }, [navigate, computedResult.html]);

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
          '[&>a]:text-primary-700 hover:[&>a]:underline',
          '[&>blockquote]:border-l-4 [&>blockquote]:border-primary-200 [&>blockquote]:bg-primary-50 [&>blockquote]:px-5 [&>blockquote]:py-4 [&>blockquote]:rounded-r-lg',
          '[&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto',
          '[&>code]:font-mono [&>code]:text-[0.9rem] [&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded',
          '[&>table]:w-full [&>table]:border-collapse',
          '[&>table>thead>tr]:bg-gray-100',
          '[&>table th]:text-left [&>table th]:px-4 [&>table th]:py-3 [&>table th]:font-semibold',
          '[&>table td]:border-t [&>table td]:border-gray-200 [&>table td]:px-4 [&>table td]:py-3 [&>table td]:align-top',
          '[&>.blog-cta-group]:mt-8 [&>.blog-cta-group]:flex [&>.blog-cta-group]:flex-wrap [&>.blog-cta-group]:gap-3',
          '[&>.blog-cta-group>.blog-cta]:inline-flex [&>.blog-cta-group>.blog-cta]:items-center [&>.blog-cta-group>.blog-cta]:rounded-full [&>.blog-cta-group>.blog-cta]:bg-primary-600 [&>.blog-cta-group>.blog-cta]:px-5 [&>.blog-cta-group>.blog-cta]:py-2 [&>.blog-cta-group>.blog-cta]:text-sm [&>.blog-cta-group>.blog-cta]:font-semibold [&>.blog-cta-group>.blog-cta]:text-white [&>.blog-cta-group>.blog-cta]:shadow [&>.blog-cta-group>.blog-cta]:transition [&>.blog-cta-group>.blog-cta]:hover:bg-primary-700 [&>.blog-cta-group>.blog-cta]:focus-visible:outline-none [&>.blog-cta-group>.blog-cta]:focus-visible:ring-2 [&>.blog-cta-group>.blog-cta]:focus-visible:ring-primary-300 [&>.blog-cta-group>.blog-cta]:focus-visible:ring-offset-2'
        )}
        ref={contentRef}
        // 清理多余的空段落后再渲染
        dangerouslySetInnerHTML={{ __html: (computedResult.html || '').replace(/<p><\/p>/g, '') }}
      />
    </div>
  );
};

export default ArticleContent;


