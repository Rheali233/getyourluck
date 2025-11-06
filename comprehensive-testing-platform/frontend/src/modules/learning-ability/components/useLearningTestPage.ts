import { useCallback, useEffect, useMemo, useState } from 'react';
import { questionService } from '@/modules/testing/services/QuestionService';
import { useTestStore } from '@/modules/testing/stores/useTestStore';
import type { Question } from '@/modules/testing/types/TestTypes';
import { useSEO } from '@/hooks/useSEO';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import {
  getLearningSeoMeta,
  getLearningTestContent,
  LEARNING_TEST_TYPES,
  type LearningTestPageContent,
  type LearningTestSeoMeta
} from './learningTestContent';
import { getLocalStorageItem, setLocalStorageItem, resolveAbsoluteUrl } from '@/utils/browserEnv';

interface UseLearningTestPageParams {
  testType: string;
  title: string;
  description?: string;
}

interface UseLearningTestPageResult {
  seoConfig: ReturnType<typeof useSEO>;
  content: LearningTestPageContent;
  questions: Question[];
  loading: boolean;
  error: string | null;
  statItems: string[];
  waitingForQuestions: boolean;
  startPending: boolean;
  testStarted: boolean;
  testTypeShowResults: boolean;
  testTypeIsTestStarted: boolean;
  handleStartTest: () => Promise<void>;
  retryLoadQuestions: () => Promise<void>;
}

const CACHE_EXPIRATION_MS = 3600000; // 1 hour

export const useLearningTestPage = ({
  testType,
  title,
  description
}: UseLearningTestPageParams): UseLearningTestPageResult => {
  const {
    startTest,
    setQuestions: setStoreQuestions,
    getTestTypeState,
    clearAllTestTypeStates,
    clearTestTypeState
  } = useTestStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [startPending, setStartPending] = useState(false);

  const content = useMemo(() => getLearningTestContent(testType), [testType]);

  // 清理其他测试类型状态
  useEffect(() => {
    const currentTestTypeState = getTestTypeState(testType);

    if (!currentTestTypeState.showResults && !currentTestTypeState.isTestStarted) {
      clearAllTestTypeStates();
    } else {
      LEARNING_TEST_TYPES.forEach((type) => {
        if (type !== testType) {
          clearTestTypeState(type);
        }
      });
    }
  }, [testType, getTestTypeState, clearAllTestTypeStates, clearTestTypeState]);

  const seoMeta: LearningTestSeoMeta = useMemo(
    () => getLearningSeoMeta(testType, title, description),
    [testType, title, description]
  );

  const canonical = useMemo(
    () => resolveAbsoluteUrl(`/tests/learning/${testType}`, 'https://selfatlas.net'),
    [testType]
  );

  const seoConfig = useSEO({
    testType: 'learning',
    testId: testType,
    title: seoMeta.title,
    description: seoMeta.description || content.heroDescription,
    keywords: seoMeta.keywords,
    customConfig: {
      canonical,
      ogTitle: seoMeta.title,
      ogDescription: seoMeta.description || content.heroDescription,
      ogImage: resolveAbsoluteUrl('/og-image.jpg', 'https://selfatlas.net'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Test',
      name: title,
      description: description || content.heroDescription,
      category: 'Learning Assessment',
      provider: {
        '@type': 'Organization',
        name: 'SelfAtlas',
        url: 'https://selfatlas.net'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      educationalLevel: 'All',
      typicalAgeRange: '14-99',
      timeRequired: content.stats.estimatedMinutes ? `PT${content.stats.estimatedMinutes}M` : undefined,
      numberOfQuestions: questions.length || undefined,
      testFormat: content.stats.format,
      about: {
        '@type': 'Thing',
        name: testType === 'vark' ? 'Learning Styles' : 'Learning Assessment'
      }
    }
  });

  const loadQuestions = useCallback(
    async (options?: { bypassCache?: boolean }): Promise<Question[]> => {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `learning_questions_${testType}`;
        const cacheTimestampKey = `${cacheKey}_timestamp`;

        if (!options?.bypassCache) {
          const cachedData = getLocalStorageItem(cacheKey);
          const cacheTimestamp = getLocalStorageItem(cacheTimestampKey);

          if (cachedData && cacheTimestamp) {
            const cacheTime = parseInt(cacheTimestamp, 10);
            const now = Date.now();
            const isExpired = Number.isNaN(cacheTime) || now - cacheTime > CACHE_EXPIRATION_MS;

            if (!isExpired) {
              const parsed = JSON.parse(cachedData) as Question[];
              setQuestions(parsed);

              const base = buildBaseContext();
              trackEvent({
                eventType: 'page_view',
                ...base,
                data: { route: `/tests/learning/${testType}`, pageType: 'test' }
              });

              return parsed;
            }
          }
        }

        const response = await questionService.getQuestionsByType(testType);

        if (response.success && response.data && Array.isArray(response.data)) {
          setQuestions(response.data);
          setLocalStorageItem(cacheKey, JSON.stringify(response.data));
          setLocalStorageItem(cacheTimestampKey, Date.now().toString());

          const base = buildBaseContext();
          trackEvent({
            eventType: 'page_view',
            ...base,
            data: { route: `/tests/learning/${testType}`, pageType: 'test' }
          });

          return response.data as Question[];
        }

        setError(response.error || 'Failed to load questions');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [testType]
  );

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (questions.length > 0) {
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  const statItems = useMemo(() => {
    const items = ['Free'];

    if (content.stats.estimatedMinutes) {
      items.push(`~${content.stats.estimatedMinutes} min`);
    }

    if (content.stats.format) {
      items.push(content.stats.format);
    }

    if (content.stats.insightLabel) {
      items.push(content.stats.insightLabel);
    }

    return items;
  }, [content.stats]);

  const waitingForQuestions = useMemo(() => {
    if (error) {
      return false;
    }

    if (loading) {
      return true;
    }

    return questions.length === 0;
  }, [error, loading, questions.length]);

  const handleStartTest = useCallback(async () => {
    try {
      setStartPending(true);

      let activeQuestions = questions;

      if (activeQuestions.length === 0) {
        activeQuestions = await loadQuestions({ bypassCache: true });
      }

      if (activeQuestions.length === 0) {
        setStartPending(false);
        return;
      }

      await startTest(testType, activeQuestions);
      setTestStarted(true);

      const base = buildBaseContext();
      trackEvent({
        eventType: 'test_start',
        ...base,
        data: { testType }
      });
    } catch {
      // 错误通过状态提示
    } finally {
      setStartPending(false);
    }
  }, [loadQuestions, questions, startTest, testType]);

  const retryLoadQuestions = useCallback(async () => {
    await loadQuestions({ bypassCache: true });
  }, [loadQuestions]);

  const testTypeState = getTestTypeState(testType);

  return {
    seoConfig,
    content,
    questions,
    loading,
    error,
    statItems,
    waitingForQuestions,
    startPending,
    testStarted,
    testTypeShowResults: testTypeState.showResults,
    testTypeIsTestStarted: testTypeState.isTestStarted,
    handleStartTest,
    retryLoadQuestions
  };
};
