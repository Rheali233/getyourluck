/**
 * FAQ 组件
 * 展示常见问题和答案
 */

import React, { useState } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { Card } from '@/components/ui';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQProps extends BaseComponentProps {
  faqs?: FAQItem[];
  title?: string;
}

export const FAQ: React.FC<FAQProps> = ({
  className,
  testId = 'faq',
  faqs = [],
  title,
  ...props
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Title configuration
  const displayTitle = title || 'Frequently Asked Questions';

  // Default FAQ data - 结合项目实际情况
  const defaultFAQs: FAQItem[] = [
    {
      id: '1',
      question: 'What makes SelfAtlas different from other testing platforms?',
      answer: 'SelfAtlas is a 360° self-discovery platform that unites Western psychology (MBTI, Big Five) with Eastern wisdom (Astrology, Tarot, Numerology). Our 7 comprehensive modules offer multiple angles on your personality, career, relationships, and life path for a complete journey.',
      category: 'Unique Features'
    },
    {
      id: '2',
      question: 'How accurate are the test results?',
      answer: 'Expect research-informed accuracy backed by validated models. Our psychology tests build on MBTI and Big Five theories, while traditional modules follow established wisdom systems. AI-powered analysis personalizes every insight beyond generic summaries.',
      category: 'Accuracy'
    },
    {
      id: '3',
      question: 'How long do the tests take?',
      answer: 'Most free AI-powered tests take 5–15 minutes. Psychology assessments usually need 10–15 minutes, while Astrology or Tarot journeys take 5–10 minutes. Time estimates appear before you start, and you can pause or resume anytime.',
      category: 'Duration'
    },
    {
      id: '4',
      question: 'Is my personal information safe?',
      answer: 'Your personal information stays private. We use industry-standard security controls, and your test responses plus results remain confidential. Future account features will still honour strict privacy policies and optional consent.',
      category: 'Privacy'
    },
    {
      id: '5',
      question: 'Can these tests help with career decisions?',
      answer: 'Yes—our career assessments translate insights into job actions. The Career module blends Holland RIASEC, DISC leadership styles, and learning preferences to surface role matches, leadership strengths, and next-step career plans.',
      category: 'Career'
    },
    {
      id: '6',
      question: 'What\'s the difference between Psychology and Traditional modules?',
      answer: 'Psychology modules deliver data-driven assessments rooted in Western science, such as MBTI, EQ, and VARK. Traditional modules draw from astrology, tarot, and numerology to provide reflective guidance. Both perspectives complement each other.',
      category: 'Modules'
    },
    {
      id: '7',
      question: 'Do I need special knowledge for Astrology or Numerology?',
      answer: 'No prior knowledge is required. Every astrology, tarot, and numerology journey includes plain-language explanations plus practical takeaways you can apply immediately.',
      category: 'Cultural'
    },
    {
      id: '8',
      question: 'How do I understand all these different results?',
      answer: 'Look for repeating themes across modules to connect the dots. Each assessment reveals a different perspective, and AI summaries highlight how psychology, career, and traditional insights reinforce each other.',
      category: 'Integration'
    },
    {
      id: '9',
      question: 'Are the Tarot readings mystical or just for fun?',
      answer: 'Tarot readings blend traditional card symbolism with reflective psychology prompts. Use them as mystical guidance or mindful self-reflection—the spreads surface patterns that relate to real-life decisions.',
      category: 'Tarot'
    },
    {
      id: '10',
      question: 'Can I use SelfAtlas on my phone?',
      answer: 'Yes, SelfAtlas is fully mobile-optimized. Start or continue tests on your phone, tablet, or desktop with auto-saved progress so self-discovery fits into any moment.',
      category: 'Mobile'
    }
  ];

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs;

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section
      className={cn("faq py-12 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
        {/* Title section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            {displayTitle}
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {displayFAQs.map((faq) => (
            <Card
              key={faq.id}
              className="bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg border-0 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none hover:transition-shadow duration-200"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={cn(
                      "w-5 h-5 text-gray-500 transition-transform duration-200",
                      openItems.has(faq.id) && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              {openItems.has(faq.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
