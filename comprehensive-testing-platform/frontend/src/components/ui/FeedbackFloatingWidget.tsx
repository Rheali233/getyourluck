/**
 * 浮动反馈组件（5秒停留自动展开，随主容器定位）
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from './Card';
import { LoadingSpinner } from './LoadingSpinner';
import { UI_TEXT } from '../../../../shared/constants';
import type { FeedbackPayload } from '../../../../shared/types';
import { feedbackService } from '../../services/feedbackService';
const LazyFeedbackForm = React.lazy(() => import('./FeedbackForm').then(m => ({ default: m.FeedbackForm })));

export interface FeedbackFloatingWidgetProps {
  containerSelector?: string; // 结果页主容器选择器
  testContext: {
    testType: string;
    testId?: string;
    resultId?: string;
    sessionId?: string;
  };
}

const AUTO_KEY = 'feedback_auto_shown_v1';

export const FeedbackFloatingWidget: React.FC<FeedbackFloatingWidgetProps> = ({
  containerSelector = '#mainContent',
  testContext,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false); // 10秒后才允许显示
  const pos = useRef<{ top: number; left: number } | null>(null);
  const rafId = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const debounceTimer = useRef<number | null>(null);

  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, []);

  const locateContainer = useCallback(() => {
    containerRef.current = document.querySelector(containerSelector) as HTMLElement | null;
  }, [containerSelector]);

  const computePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // 查找"Back to Center"按钮的位置
    const buttons = document.querySelectorAll('button');
    let backToCenterBtn: HTMLElement | null = null;
    
    for (const btn of buttons) {
      if (btn.textContent?.includes('Back to Center')) {
        backToCenterBtn = btn as HTMLElement;
        break;
      }
    }
    
    let top: number;
    let left: number;
    
    if (backToCenterBtn) {
      // 如果找到Back to Center按钮，将feedback按钮放在它下面
      const backBtnRect = backToCenterBtn.getBoundingClientRect();
      
      // 确保feedback按钮在可见区域内
      const minTop = 80; // 最小距离顶部80px
      const maxTop = window.innerHeight - 100; // 最大距离顶部（视口高度-100px）
      
      top = Math.max(minTop, Math.min(maxTop, backBtnRect.bottom + 24)); // 增加下移距离到24px
      left = Math.max(20, Math.min(window.innerWidth - 80, backBtnRect.right - 40)); // 贴近右边边缘，留40px按钮宽度
    } else {
      // 如果没找到Back to Center按钮，使用默认位置（容器顶部）
      top = Math.max(rect.top + 20, 80); // 容器顶部向下20px
      left = rect.right + 8; // 在容器外侧偏右 8px
    }
    
    pos.current = { top: Math.round(top), left: Math.round(left) };
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const btn = document.getElementById('feedback-floating-button');
      if (btn && pos.current) {
        btn.style.top = `${pos.current.top}px`;
        btn.style.left = `${pos.current.left}px`;
      }
    });
  }, []);

  const debouncedComputePosition = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(computePosition, 100);
  }, [computePosition]);

  const startAutoTimer = useCallback(() => {
    // 如果已经显示过或者正在显示，不再启动定时器
    if (sessionStorage.getItem(AUTO_KEY) || open) {
      setReady(true);
      return;
    }
    
    const tick = () => {
      if (document.hidden) return; // 页面不可见不计时
      setReady(true);
      // 只显示按钮，不自动弹出弹窗
      sessionStorage.setItem(AUTO_KEY, '1');
    };
    timerRef.current = window.setTimeout(tick, 10000); // 改为10秒
  }, [open]);

  const clearAutoTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    locateContainer();
    computePosition();
    const onScroll = () => debouncedComputePosition();
    const onResize = () => debouncedComputePosition();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // 移除页面可见性变化时的重复启动，避免重复弹出
    startAutoTimer();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearAutoTimer();
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [locateContainer, computePosition, debouncedComputePosition, startAutoTimer, clearAutoTimer]);

  useEffect(() => {
    // 当打开时，确保重新计算位置
    if (open) computePosition();
  }, [open, computePosition]);

  const getClient = useCallback(() => ({
    ua: navigator.userAgent,
    platform: navigator.platform || '',
    locale: navigator.language || 'en',
  }), []);

  const handleSubmit = useCallback(async (partial: Omit<FeedbackPayload, 'client' | 'createdAt'>) => {
    try {
      setIsSubmitting(true);
      setError('');
      const base: any = {
        ...partial,
        testType: testContext.testType,
        client: getClient(),
        createdAt: new Date().toISOString(),
      };
      if (testContext.testId) base.testId = testContext.testId;
      if (testContext.resultId) base.resultId = testContext.resultId;
      if (testContext.sessionId) base.sessionId = testContext.sessionId;
      const payload: FeedbackPayload = base;
      const res = await feedbackService.submit(payload);
      if (!res.success) {
        setError(res.error || UI_TEXT.feedback.errorMessage);
        return;
      }
      setSubmitted(true);
      // 2s 后可收起
      setTimeout(() => setOpen(false), 2000);
    } catch (e) {
      setError(UI_TEXT.feedback.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [testContext, getClient]);

  // 移动端采用抽屉/模态
  if (!mounted) return null;

  return (
    <>
      {/* 召回入口按钮，锚定到容器右侧中部附近 */}
      {!open && ready && (
        <button
          id="feedback-floating-button"
          type="button"
          aria-label={UI_TEXT.feedback.a11y.openButton}
          onClick={() => setOpen(true)}
          className="fixed z-40 w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-500/85 to-indigo-500/85 text-white flex items-center justify-center backdrop-blur-md hover:shadow-xl transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-0 active:outline-none"
          style={{ top: pos.current?.top ?? 120, left: pos.current?.left ?? (window.innerWidth - 24) }}
        >
          {/* Outline edit (pencil) icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
      )}

      {open && (
        <div
          id="feedback-floating-card"
          role="dialog"
          aria-label={UI_TEXT.feedback.a11y.dialogLabel}
          aria-modal="false"
          className={`z-40 ${
            isMobile
              ? 'fixed inset-x-0 bottom-0'
              : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          } max-w-lg transform`}
          style={isMobile ? {} : { top: '50%', left: '50%' }}
        >
          {/* 背景遮罩，强化层级与可读性 */}
          <Card className={`${isMobile ? 'rounded-t-2xl' : 'rounded-xl'} bg-white/90 backdrop-blur-md shadow-[0_20px_60px_-10px_rgba(76,29,149,0.45),0_8px_24px_-6px_rgba(79,70,229,0.3)] p-6 w-[520px] md:w-[560px] max-w-[90vw] z-50`}>
            {!submitted ? (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{UI_TEXT.feedback.title}</h3>
                  <p className="text-sm text-gray-600">{UI_TEXT.feedback.subtitle}</p>
                </div>
                <button
                  type="button"
                  aria-label={UI_TEXT.feedback.a11y.closeButton}
                  className="ml-2 text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-0 focus:ring-offset-0 active:outline-none"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  {UI_TEXT.feedback.a11y.closeButton}
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label={UI_TEXT.feedback.a11y.closeButton}
                  className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-0 focus:ring-offset-0 active:outline-none"
                  onClick={() => setOpen(false)}
                >
                  {UI_TEXT.feedback.a11y.closeButton}
                </button>
              </div>
            )}

            <div className="mt-4">
              {loading && <LoadingSpinner message="" />}
              {!loading && !submitted && (
                <React.Suspense fallback={<LoadingSpinner message="" />}> 
                  <LazyFeedbackForm
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    isSubmitting={isSubmitting}
                  />
                </React.Suspense>
              )}
              {!loading && submitted && (
                <div className="py-8 px-4 text-center">
                  <p className="text-green-700 text-lg font-semibold">{UI_TEXT.feedback.successTitle}</p>
                  <p className="text-gray-700 mt-2">{UI_TEXT.feedback.successMessage}</p>
                </div>
              )}
              {error && (
                <p className="text-red-600 text-sm mt-2" role="alert">{error}</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};


