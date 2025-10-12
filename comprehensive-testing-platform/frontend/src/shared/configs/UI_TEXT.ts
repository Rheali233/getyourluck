/**
 * 英文UI文本常量（仅管理用户可见文案）
 * 注意：所有可见文本必须使用英文，不在组件内硬编码
 */

export const UI_TEXT = {
  blog: {
    list: {
      title: 'Blog Articles',
      subtitle: 'Explore psychology, astrology, career, and personal growth insights',
      searchPlaceholder: 'Search articles',
      categoryAll: 'All Categories',
      loadMore: 'Load More',
      emptyTitle: 'No Articles Available',
      emptyDesc: 'We are preparing exciting content. Please check back later.',
      errorTitle: 'Failed to load articles',
      retry: 'Retry',
    },
    detail: {
      titleFallback: 'Blog Article',
      backToList: 'Back to Blog',
      meta: {
        byAuthor: 'by',
        readTime: 'read',
        views: 'views',
        updatedAt: 'Updated',
      },
      notFoundTitle: 'Article Not Found',
      notFoundDesc: 'The article may have been removed or the link is incorrect.',
    },
    common: {
      reads: 'reads',
      minutes: 'min',
      categories: 'Categories',
    },
  },
  legal: {
    terms: {
      title: 'Terms of Service',
      intro: 'Effective Date: September 28, 2025',
      sections: [
        { title: '1. Service Overview', content: 'Welcome to selfatlas. We provide online testing services for global users. Key features include psychology tests, career development tests, relationship tests, learning ability tests, and tarot/astrology services. Highlights include personalized AI‑powered insights, real‑time test progress, English interface, and international data protection alignment.' },
        { title: '2. Acceptance of Terms', content: 'By accessing or using our services, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use the services. We may modify these Terms at any time. Updates take effect once posted on our website.' },
        { title: '3. Permitted and Prohibited Uses', content: 'Permitted – Personal testing, career planning, relationship assessment, and learning ability evaluation. Prohibited – Violating applicable laws, disrupting the platform, attempting to access others’ information, bulk/automated testing for commercial purposes, distributing malware, or posting illegal or harmful content.' },
        { title: '4. Use of Test Results', content: 'Test results are for personal reference only and do not constitute professional medical, psychological, career, or legal advice. You agree not to use results for commercial purposes.' },
        { title: '5. Intellectual Property', content: 'All platform content (text, images, software, and other materials) is protected by copyright and other laws. You may not copy, modify, distribute, or commercially use any content without our written permission. Content you submit (e.g., test answers and feedback) remains yours, but you grant us a license to use it to provide and improve the services.' },
        { title: '6. Privacy & Data Protection', content: 'We collect limited data such as test answers/results/types, session data (ID, duration, timestamps), technical data (hashed IP, user agent), and optional feedback. We use this data to provide results, improve functionality, offer support, and ensure security. For details, see our Privacy Policy.' },
        { title: '7. Service Availability', content: 'We strive to keep the services available but do not guarantee uninterrupted operation. We may suspend services for maintenance, upgrades, or other reasons.' },
        { title: '8. Disclaimers', content: 'The services and results are provided “as is” without warranties of any kind, express or implied. Test results are for entertainment and reference only. Seek professional advice where appropriate.' },
        { title: '9. Limitation of Liability', content: 'To the maximum extent permitted by law, our total liability is limited to the amount you paid (if any) for the services. We are not liable for indirect, special, incidental, or consequential damages.' },
        { title: '10. Dispute Resolution', content: 'These Terms are governed by the laws of the State of California, USA. In case of a dispute, please contact us first to attempt an amicable resolution. If we cannot resolve the dispute, it shall be submitted to international arbitration.' },
        { title: '11. Contact Us', content: 'If you have any questions about these Terms, contact us at: support@selfatlas.net' }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'Effective Date: September 28, 2025',
      sections: [
        { title: '1. Information We Collect', content: 'We collect the following types of information to provide our services: (1) Information You Provide to Us — Test Information: your test answers and results used to generate personalized analysis; Feedback Information: your rating, comments, and contact email if provided. (2) Information We Collect Automatically — Usage Data: information about how you use our platform, including test type, test duration, and basic usage statistics; Technical Information: your browser user agent and network address (stored in hashed form) to help keep our service reliable and secure; Cookies: we use necessary and session cookies to operate the service. You can manage cookie preferences in your browser settings.' },
        { title: '2. How We Use Your Information', content: 'We use collected information to: provide, operate, and maintain our services; generate personalized test results and analysis; respond to support inquiries and provide customer service; improve service functionality and user experience; protect platform security and prevent abuse; and comply with legal and regulatory requirements.' },
        { title: '3. How We Share Your Information', content: 'We do not sell your personal data. We may share information with service providers such as Cloudflare (cloud hosting) and AI processing providers strictly to operate our services, with legal authorities to comply with law, or during business transfers (e.g., mergers or acquisitions).' },
        { title: '4. Your Rights and Choices', content: 'You may request access to and correction of your personal information, request deletion, and opt out of marketing emails at any time.' },
        { title: '5. Data Security & Retention', content: 'We take reasonable security measures to protect your data, including encryption and access controls. We retain your information for as long as necessary to provide services and comply with legal obligations.' },
        { title: '6. International Users & Legal Compliance', content: 'We comply with data protection laws including GDPR and CCPA. If you are located outside the United States, your information may be processed in the U.S., where data protection laws may differ.' },
        { title: '7. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. If changes are significant, we will notify you by email or through our website.' },
        { title: '8. Contact Us', content: 'If you have any questions about this Privacy Policy, contact us at: support@selfatlas.net' }
      ]
    },
    cookies: {
      title: 'Cookie Policy',
      intro: 'This policy explains how we use cookies and similar technologies on our platform.',
      sections: [
        { title: 'What Are Cookies', content: 'Cookies are small text files stored on your device to help websites function and remember preferences.' },
        { title: 'Types of Cookies', content: 'We use essential, performance, and analytics cookies to provide core functions and improve the service.' },
        { title: 'Managing Cookies', content: 'You can control cookies in your browser settings. Blocking some cookies may affect site functionality.' },
        { title: 'Updates', content: 'We may update this policy as needed. Changes will be posted on this page.' }
      ]
    }
  },
  about: {
    title: 'About Our Platform',
    subtitle: 'Unified self-discovery platform across psychology, career, astrology, tarot, and more',
    cta: {
      backHome: 'Back to Home',
      exploreBlog: 'Explore Blog',
    },
    sections: {
      overview: {
        title: 'What We Do',
        paragraphs: [
          'Our platform brings together scientific psychology assessments and traditional wisdom modules into one unified experience — all in English.',
          'You can explore MBTI, Big Five, learning styles, career planning, astrology, tarot, numerology, and more — with consistent UI, fast performance, and clear guidance.'
        ],
      },
      capabilities: {
        title: 'What You Can Do Here',
        items: [
          'Discover your personality and strengths',
          'Evaluate emotional intelligence and mental wellness',
          'Plan your career path with evidence-based frameworks',
          'Explore astrology insights and tarot readings',
          'Connect test results to practical next steps'
        ],
      },
      quality: {
        title: 'How We Ensure Quality',
        items: [
          'Unified design system and consistent UX',
          'Verified test models and structured data',
          'Mobile-first performance and fast responses',
          'Privacy-first approach, no forced sign-in'
        ],
      },
      modules: {
        title: 'Explore Modules',
        entries: [
          { label: 'Psychology Tests', href: '/psychology' },
          { label: 'Career Planning', href: '/career' },
          { label: 'Astrology', href: '/astrology' },
          { label: 'Tarot Reading', href: '/tarot' },
          { label: 'Numerology', href: '/numerology' },
          { label: 'Relationships', href: '/relationship' },
          { label: 'Learning Ability', href: '/learning' },
        ],
      },
    },
    seo: {
      title: 'About - Comprehensive Testing Platform',
      description: 'Learn about our unified, English-only platform for psychology tests, career planning, astrology, tarot, and more.',
    }
  },
  testCenter: {
    title: 'Test Center',
    subtitle: 'Find the right assessment across psychology, career, relationships, and more',
    searchPlaceholder: 'Search tests',
    categories: {
      all: 'All',
      psychology: 'Psychology',
      career: 'Career',
      astrology: 'Astrology',
      tarot: 'Tarot',
      numerology: 'Numerology',
      relationship: 'Relationship',
      learning: 'Learning',
    },
    seo: {
      title: 'Test Center - Comprehensive Testing Platform',
      description: 'Browse and start tests across psychology, career, astrology, tarot, numerology, relationship, and learning modules.',
    },
    tests: [
      // Psychology
      { id: 'mbti', module: 'psychology', title: 'MBTI Personality Test', description: 'Discover your Myers-Briggs personality type.', href: '/psychology/mbti' },
      { id: 'phq9', module: 'psychology', title: 'PHQ-9 Depression Screening', description: 'A brief screening tool for depression assessment.', href: '/psychology/phq9' },
      { id: 'eq', module: 'psychology', title: 'Emotional Intelligence Test', description: 'Assess your emotional intelligence and self-awareness.', href: '/psychology/eq' },
      { id: 'happiness', module: 'psychology', title: 'Happiness Assessment', description: 'Measure current happiness and life satisfaction.', href: '/psychology/happiness' },

      // Learning
      { id: 'vark', module: 'learning', title: 'VARK Learning Style', description: 'Identify your preferred learning styles.', href: '/learning/vark' },
      // cognitive removed

      // Relationship
      { id: 'love_language', module: 'relationship', title: 'Love Language Test', description: 'Discover how you give and receive love.', href: '/relationship/love_language' },
      { id: 'love_style', module: 'relationship', title: 'Relationship Style Test', description: 'Understand your relationship attachment style.', href: '/relationship/love_style' },
      { id: 'interpersonal', module: 'relationship', title: 'Interpersonal Skills Test', description: 'Assess communication and social skills.', href: '/relationship/interpersonal' },

      // Career
      { id: 'holland', module: 'career', title: 'Holland Code Test', description: 'Assess vocational interests using the RIASEC model.', href: '/career' },
      { id: 'disc', module: 'career', title: 'DISC Personality Assessment', description: 'Understand your dominant behavior style at work.', href: '/career' },
      { id: 'leadership', module: 'career', title: 'Leadership Skills Assessment', description: 'Evaluate leadership tendencies and skills.', href: '/career' },

      // Astrology
      { id: 'birth_chart', module: 'astrology', title: 'Birth Chart Analysis', description: 'Unlock insights from your natal chart.', href: '/astrology' },
      { id: 'compatibility', module: 'astrology', title: 'Compatibility Test', description: 'Explore compatibility through astrological indicators.', href: '/astrology' },
      { id: 'fortune', module: 'astrology', title: 'Fortune Forecast', description: 'Check daily and monthly fortune trends.', href: '/astrology' },

      // Tarot
      { id: 'tarot_recommend', module: 'tarot', title: 'Tarot Recommendation', description: 'Get recommended spreads based on your question.', href: '/tarot/recommendation' },
      { id: 'tarot_drawing', module: 'tarot', title: 'Tarot Card Drawing', description: 'Draw cards and reveal guidance.', href: '/tarot/drawing' },
      { id: 'tarot_reading', module: 'tarot', title: 'Tarot Reading', description: 'Comprehensive interpretation of your spread.', href: '/tarot/reading' },

      // Numerology
      { id: 'zodiac', module: 'numerology', title: 'Chinese Zodiac Analysis', description: 'Get insights from your zodiac sign.', href: '/numerology' },
      { id: 'name', module: 'numerology', title: 'Name Analysis', description: 'Analyze your name for personality and destiny clues.', href: '/numerology' },
      { id: 'bazi', module: 'numerology', title: 'BaZi (Four Pillars) Analysis', description: 'Comprehensive life analysis from birth data.', href: '/numerology' },
    ],
  },
  numerology: {
    bazi: {
      analysisPage: {
        loadingTitle: 'Analyzing BaZi Chart',
        loadingDesc: 'Please wait while we calculate your Eight Pillars of Destiny...',
        headerTitle: 'BaZi Analysis',
        headerSubtitle: 'Discover your destiny through the ancient art of BaZi (Eight Pillars of Destiny)',
        backToCenter: 'Back to Center',
        whatIsTitle: 'What is BaZi Analysis?',
        bullets: {
          stemsBranches: 'Heavenly Stems & Earthly Branches: Analyze your birth year, month, day, and hour',
          fiveElements: 'Five Elements Balance: Understand your elemental composition and balance',
          lifePath: 'Life Path Guidance: Get insights into your personality, career, and relationships',
          fortuneTiming: 'Fortune Timing: Discover your lucky periods and challenges'
        },
        form: {
          sectionTitle: 'Your Birth Information',
          fullName: 'Full Name *',
          fullNamePlaceholder: 'Enter your full name',
          birthDate: 'Birth Date *',
          birthTime: 'Birth Time *',
          gender: 'Gender *',
          genderMale: 'Male',
          genderFemale: 'Female',
          calendarType: 'Calendar Type *',
          calendarSolar: 'Solar Calendar',
          calendarLunar: 'Lunar Calendar'
        },
        buttons: {
          back: 'Back',
          start: 'Start Analysis',
          analyzing: 'Analyzing...'
        }
      },
      resultPage: {
        loadingTitle: 'Analyzing Your BaZi Chart',
        loadingDesc: 'Please wait while we calculate your Eight Pillars of Destiny...',
        errorTitle: 'Analysis Error',
        tryAgain: 'Try Again',
        noAnalysisTitle: 'No Analysis Found',
        noAnalysisDesc: 'Please start a new BaZi analysis.',
        startNew: 'Start New Analysis',
        reportTitle: 'BaZi Analysis Report',
        reportSubtitle: 'Discover destiny through the ancient art of BaZi',
        overallTitle: 'Overall Interpretation',
        basicTitle: 'Basic BaZi Analysis',
        chartTitle: 'BaZi Chart',
        chartIntro: 'The BaZi summarizes birth information into Year, Month, Day, and Hour pillars. Each pillar combines a Heavenly Stem and an Earthly Branch, outlining ancestral background, environment, core self, and later-life expression.',
        pillars: {
          year: 'Nian Zhu',
          month: 'Yue Zhu',
          day: 'Ri Zhu',
          hour: 'Shi Zhu',
          heavenlyStem: 'Heavenly Stem',
          earthlyBranch: 'Earthly Branch',
          element: 'Element',
          animal: 'Animal',
          notAvailable: 'Not Available'
        },
        fiveElementsTitle: 'Wu Xing Analysis',
        fiveElementsIntro: 'The Wu Xing (Five Elements) form the foundation of BaZi analysis. Each element represents different aspects of personality, energy, and life experiences. The balance and interaction between these elements determine natural strengths, challenges, and the flow of energy in life.',
        balanceAssessmentTitle: 'Elemental Balance Assessment',
        dominantElement: 'Dominant Element',
        weakElement: 'Weak Element',
        overallBalance: 'Overall Balance',
        tenGodsTitle: 'Shi Shen Analysis',
        tenGodsIntro: 'The Shi Shen (Ten Gods) represent different aspects of personality and relationships with others. Each god influences specific areas of life, from wealth and career to relationships and personal growth. Understanding their strength and influence helps reveal natural talents and potential challenges.',
        tenGodsUnderstanding: 'Understanding the Shi Shen: These celestial influences shape destiny and reveal natural inclinations. A strong god indicates areas of excellence, while a weak one suggests areas for growth and development.',
        dayMasterTitle: 'Ri Zhu Strength',
        dayMasterProfile: 'Day Master Profile',
        dayMasterKey: 'Key Characteristics',
        favorableTitle: 'Yong Shen & Ji Shen',
        favorableUseful: 'Yong Shen',
        favorableHarmful: 'Ji Shen',
        favorableNeutral: 'Xian Shen',
        favorableIntro: 'Understanding which elements are Yong Shen (favorable), Ji Shen (harmful), or Xian Shen (neutral) in the chart is crucial for making life decisions. These elements guide toward opportunities that align with natural energy and help avoid situations that may drain or challenge unnecessarily.',
        favorableGuidanceTitle: 'Understanding Elemental Guidance',
        favorablePractical: 'Practical Application: Use this knowledge to choose colors, directions, seasons, and activities that align with favorable elements. Avoid or minimize exposure to harmful elements in environment and decision-making.',
        favorableUnderstanding: 'Understanding Elemental Guidance',
        lifeAnalysisTitle: 'Life Analysis',
        lifeAnalysisDescription: 'Your life analysis reveals the profound insights hidden within your BaZi chart. Understanding these patterns helps you navigate personality development, career choices, wealth building, relationship harmony, and health optimization with wisdom and clarity.',
        personalityTitle: 'Personality Analysis',
        personalityTraitsTitle: 'Personality Traits',
        careerWealthTitle: 'Career & Wealth Analysis',
        careerTitle: 'Career Guidance',
        careerGuidanceTitle: 'Career Guidance',
        wealthTitle: 'Wealth Analysis',
        wealthAnalysisTitle: 'Wealth Analysis',
        wealthLevel: 'Wealth Level',
        wealthSources: 'Wealth Sources',
        investmentAdvice: 'Investment Advice',
        relationshipTitle: 'Marriage Analysis',
        relationshipMainTitle: 'Marriage Analysis',
        relationshipMarriageTitle: 'Marriage Analysis',
        marriageTiming: 'Marriage Timing',
        partnerCharacteristics: 'Partner Characteristics',
        marriageAdvice: 'Marriage Advice',
        healthTitle: 'Health Analysis',
        healthOverall: 'Overall Health',
        overallHealth: 'Overall Health',
        healthWeakAreas: 'Weak Areas',
        weakAreas: 'Weak Areas',
        healthAdviceTitle: 'Health Advice',
        healthAdvice: 'Health Advice',
        fortuneTitle: 'Fortune Analysis',
        fortuneMainTitle: 'Fortune Analysis',
        fortuneTimingTitle: 'Fortune Analysis',
        fortuneIntro: 'Your fortune analysis reveals the cosmic influences affecting your life journey. Understanding these patterns helps you navigate opportunities and challenges with wisdom and foresight, making the most of favorable periods while preparing for more challenging times.',
        fortuneAnalysisDescription: 'Your fortune analysis reveals the cosmic influences affecting your life journey. Understanding these patterns helps you navigate opportunities and challenges with wisdom and foresight, making the most of favorable periods while preparing for more challenging times.',
        currentYear: 'Current Year',
        nextYear: 'Next Year',
        overallFortune: 'Overall Fortune',
        careerProfessional: 'Career & Professional Life',
        careerProfessionalLife: 'Career & Professional Life',
        wealthFinancial: 'Wealth & Financial Matters',
        wealthFinancialMatters: 'Wealth & Financial Matters',
        healthWellbeing: 'Health & Well-being',
        relationshipsSocial: 'Relationships & Social Life',
        relationshipsSocialLife: 'Relationships & Social Life',
        upcomingTrends: 'Upcoming Trends',
        keyAreas: 'Key Areas of Focus',
        keyAreasOfFocus: 'Key Areas of Focus',
        strategicRecommendations: 'Strategic Recommendations',
        strategicRecommendationsDesc: 'Focus on building strong foundations in areas where you have natural advantages, while gradually addressing areas that need development. Timing and patience will be key to your success.',
        backToCenter: 'Back to Center'
      }
    }
  }
} as const;

export type UI_TEXT_TYPE = typeof UI_TEXT;


