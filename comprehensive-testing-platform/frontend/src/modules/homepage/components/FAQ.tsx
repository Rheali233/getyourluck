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
      answer: 'SelfAtlas uniquely combines Western psychology (MBTI, Big Five) with Eastern wisdom (Astrology, Tarot, Numerology). Our 7 comprehensive test categories provide multiple perspectives on your personality, career, and relationships - giving you a complete self-discovery experience.',
      category: 'Unique Features'
    },
    {
      id: '2',
      question: 'How accurate are the test results?',
      answer: 'Our psychology tests are based on scientifically validated theories like MBTI and Big Five personality models. Traditional modules follow established wisdom systems. Our AI analysis provides personalized insights that go beyond generic results, helping you understand yourself better.',
      category: 'Accuracy'
    },
    {
      id: '3',
      question: 'How long do the tests take?',
      answer: 'Most tests take 5-15 minutes! Psychology tests are typically 10-15 minutes, while traditional modules like Astrology or Tarot take 5-10 minutes. Each test shows the exact time estimate, and you can take breaks anytime.',
      category: 'Duration'
    },
    {
      id: '4',
      question: 'Is my personal information safe?',
      answer: 'Yes! We prioritize your privacy and data security. While we may require basic account information for future features, your test responses and results are always kept confidential. We use industry-standard security measures to protect your data.',
      category: 'Privacy'
    },
    {
      id: '5',
      question: 'Can these tests help with career decisions?',
      answer: 'Absolutely! Our Career module combines Holland\'s RIASEC theory with DISC leadership styles and learning preferences. You\'ll get specific job recommendations, leadership insights, and career development paths tailored to your personality and skills.',
      category: 'Career'
    },
    {
      id: '6',
      question: 'What\'s the difference between Psychology and Traditional modules?',
      answer: 'Psychology modules use Western scientific methods for personality and learning analysis. Traditional modules draw from ancient wisdom systems like astrology and numerology. Both approaches are valuable - explore what resonates with you!',
      category: 'Modules'
    },
    {
      id: '7',
      question: 'Do I need special knowledge for Astrology or Numerology?',
      answer: 'Not at all! Our modules are designed for everyone. We explain everything in simple terms and focus on practical insights you can use in your daily life. You\'ll discover fascinating aspects of yourself without needing any special background.',
      category: 'Cultural'
    },
    {
      id: '8',
      question: 'How do I understand all these different results?',
      answer: 'Each module gives you a different perspective on yourself. Look for patterns and themes across your results - they often reinforce each other. Our AI analysis highlights connections between different test results, helping you see the bigger picture.',
      category: 'Integration'
    },
    {
      id: '9',
      question: 'Are the Tarot readings mystical or just for fun?',
      answer: 'Our Tarot module combines traditional card meanings with modern psychological insights. Whether you see it as mystical guidance or a tool for self-reflection, the cards often reveal surprising truths about your current situation and future possibilities.',
      category: 'Tarot'
    },
    {
      id: '10',
      question: 'Can I use SelfAtlas on my phone?',
      answer: 'Yes! SelfAtlas is fully mobile-optimized. You can take tests during your commute, coffee breaks, or anywhere you have a few minutes. The interface adapts perfectly to your phone screen, making self-discovery convenient and accessible.',
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
