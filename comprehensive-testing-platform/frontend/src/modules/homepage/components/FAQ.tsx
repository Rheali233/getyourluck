/**
 * FAQ 组件
 * 展示常见问题和答案
 */

import React, { useState } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQProps extends BaseComponentProps {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export const FAQ: React.FC<FAQProps> = ({
  className,
  testId = 'faq',
  faqs = [],
  title,
  subtitle,
  ...props
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Title and subtitle configuration
  const displayTitle = title || 'Frequently Asked Questions';
  const displaySubtitle = subtitle || 'Everything you need to know about discovering yourself through our 7 comprehensive test modules';

  // Default FAQ data - 结合项目实际情况
  const defaultFAQs: FAQItem[] = [
    {
      id: '1',
      question: 'What makes your platform different from other testing sites?',
      answer: 'We\'re the only platform that combines Western psychology (MBTI, Big Five, VARK) with Eastern wisdom (BaZi, Tarot, Chinese Zodiac). Our 7 comprehensive modules cover everything from personality to career, relationships to learning styles - giving you a complete picture of who you are!',
      category: 'Unique Features'
    },
    {
      id: '2',
      question: 'Are the test results really accurate and reliable?',
      answer: 'Absolutely! Our psychology tests are based on scientifically validated theories like MBTI and Big Five personality models. Our traditional modules (BaZi, Tarot, Numerology) follow centuries-old wisdom systems. Plus, our AI analysis engine provides personalized insights that go beyond generic results.',
      category: 'Accuracy'
    },
    {
      id: '3',
      question: 'How long does each test actually take?',
      answer: 'Most tests take just 5-15 minutes! Psychology tests are quick (10-15 min), while traditional modules like BaZi or Tarot take 5-10 minutes. Each test page shows the exact time estimate, and you can take breaks anytime. Perfect for coffee breaks or commutes!',
      category: 'Duration'
    },
    {
      id: '4',
      question: 'Is my data completely private and secure?',
      answer: '100% private! No registration needed, no data collection, no tracking. You can use our platform completely anonymously. We believe your self-discovery journey should be personal and secure - that\'s why we built it that way from the ground up.',
      category: 'Privacy'
    },
    {
      id: '5',
      question: 'Can I really discover my career path through these tests?',
      answer: 'Yes! Our Career module combines Holland\'s RIASEC theory with DISC leadership styles and learning preferences. You\'ll get specific job recommendations, leadership insights, and career development paths tailored to your unique personality and skills.',
      category: 'Career'
    },
    {
      id: '6',
      question: 'What\'s the difference between Psychology and Traditional modules?',
      answer: 'Psychology modules (MBTI, Big Five, VARK) use Western scientific methods for personality and learning analysis. Traditional modules (BaZi, Tarot, Numerology) draw from Eastern wisdom and ancient systems. Both are valuable - we let you explore both approaches to find what resonates with you!',
      category: 'Modules'
    },
    {
      id: '7',
      question: 'Do I need to understand Chinese culture for BaZi or Numerology?',
      answer: 'Not at all! Our BaZi and Numerology modules are designed for everyone. We explain everything in simple terms and focus on practical insights you can use in your daily life. You\'ll discover fascinating aspects of yourself without needing any cultural background.',
      category: 'Cultural'
    },
    {
      id: '8',
      question: 'How do I make sense of all these different results?',
      answer: 'Great question! Each module gives you a different perspective on yourself. Look for patterns and themes across your results - they often reinforce each other. Our AI analysis also highlights connections between different test results, helping you see the bigger picture of who you are.',
      category: 'Integration'
    },
    {
      id: '9',
      question: 'Are the Tarot readings really mystical or just for fun?',
      answer: 'Our Tarot module combines traditional card meanings with modern psychological insights. Whether you see it as mystical guidance or a tool for self-reflection, the cards often reveal surprising truths about your current situation and future possibilities. Try it with an open mind!',
      category: 'Tarot'
    },
    {
      id: '10',
      question: 'Can I use this platform on my phone?',
      answer: 'Absolutely! Our platform is fully mobile-optimized. You can take tests during your commute, coffee breaks, or anywhere you have a few minutes. The interface adapts perfectly to your phone screen, making self-discovery convenient and accessible.',
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
      className={cn("faq py-16 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
        {/* Title section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {displayTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {displayFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-lg hover:transition-shadow duration-200"
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
            </div>
          ))}
        </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
