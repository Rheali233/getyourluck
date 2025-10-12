import React from 'react';
import { cn } from '@/utils/classNames';

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
    // 链接与图片（不引入额外库的安全处理）
    const img = s.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, alt, url) => `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy" />`);
    return img.replace(/\[(.*?)\]\((.*?)\)/g, (_m, text, url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(text)}</a>`);
  };

  const computedHtml = React.useMemo(() => toHtml(html), [html, toHtml]);

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


