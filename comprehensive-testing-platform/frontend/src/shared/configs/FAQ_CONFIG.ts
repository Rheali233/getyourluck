/**
 * FAQ Configuration for All Modules
 * 各模块FAQ内容配置
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon?: string;
}

export const FAQ_CONFIG = {
  psychology: [
    {
      id: 'mbti-accuracy',
      question: 'How scientifically accurate is the MBTI personality test?',
      answer: 'MBTI is based on Carl Jung\'s cognitive function theory and has been widely used since the 1940s. While it provides valuable self-awareness insights, the scientific community debates its reliability and validity. Studies show 50-75% consistency in retesting. It\'s best used as a starting point for self-reflection rather than a definitive personality classification.',
      icon: '🧠'
    },
    {
      id: 'phq9-clinical',
      question: 'Is PHQ-9 a legitimate clinical depression screening tool?',
      answer: 'Yes, PHQ-9 is a validated clinical instrument developed by Dr. Robert Spitzer and used worldwide by healthcare professionals. It\'s endorsed by the American Psychological Association and has strong sensitivity (88%) and specificity (85%) for detecting major depression. However, it\'s a screening tool, not a diagnostic instrument - clinical evaluation is needed for formal diagnosis.',
      icon: '🩺'
    },
    {
      id: 'eq-measurement',
      question: 'Can emotional intelligence really be measured accurately?',
      answer: 'Emotional Intelligence assessment is based on decades of research by psychologists like Daniel Goleman and Peter Salovey. Our EQ test measures four core competencies: self-awareness, self-management, social awareness, and relationship management. While EQ shows strong correlation with life success, measuring emotions inherently involves subjectivity.',
      icon: '💡'
    },
    {
      id: 'personality-stability',
      question: 'Do personality test results change over time?',
      answer: 'Research shows that core personality traits remain relatively stable after age 30, with about 80% consistency over decades. However, significant life events, therapy, or intentional personal development can create measurable changes. The "Big Five" traits show more stability than MBTI types, which can shift based on context and personal growth.',
      icon: '📊'
    },
    {
      id: 'happiness-factors',
      question: 'What psychological factors actually determine happiness levels?',
      answer: 'Psychological research identifies several key happiness factors: genetic set-point (50%), life circumstances (10%), and intentional activities (40%). Our happiness assessment evaluates domains like relationships, meaningful work, personal growth, and life satisfaction based on positive psychology research by Martin Seligman and others.',
      icon: '😊'
    }
  ],
  career: [
    {
      id: 'holland-theory',
      question: 'How scientifically sound is the Holland Code career theory?',
      answer: 'The Holland Code (RIASEC model) was developed by psychologist John Holland in the 1950s and is one of the most extensively researched career theories. It\'s supported by over 60 years of empirical studies showing strong correlations between personality types and career satisfaction. The theory is widely used by career counselors and validated across diverse populations and cultures.',
      icon: '🔬'
    },
    {
      id: 'disc-workplace',
      question: 'Is DISC assessment scientifically valid for workplace evaluation?',
      answer: 'DISC is based on William Marston\'s 1928 research and has been refined through decades of organizational psychology studies. While it\'s widely used by Fortune 500 companies, critics note it lacks the statistical rigor of "Big Five" personality models. It\'s most valuable for understanding communication styles and team dynamics rather than predicting job performance.',
      icon: '📊'
    },
    {
      id: 'leadership-measurement',
      question: 'Can leadership potential really be measured through assessment?',
      answer: 'Leadership assessment draws from competency-based models developed by organizational psychologists. Research shows certain traits (emotional intelligence, decision-making, communication) correlate with leadership effectiveness. However, situational factors and experience play crucial roles. These assessments identify potential strengths and development areas rather than predicting future success.',
      icon: '👑'
    },
    {
      id: 'career-matching',
      question: 'How accurate are personality-to-career matching algorithms?',
      answer: 'Career matching research shows moderate correlations (0.3-0.5) between personality traits and job satisfaction. While statistically significant, this means personality explains about 15-25% of career satisfaction variance. Other factors like values, skills, interests, work environment, and life circumstances are equally important in career success.',
      icon: '🎯'
    },
    {
      id: 'career-change-age',
      question: 'Do career assessments work differently for different age groups?',
      answer: 'Research indicates that career interests tend to stabilize by age 25-30, but can still evolve. Younger individuals may show more variability in results, while mid-career professionals often have clearer patterns. Career assessments for older adults may need to account for accumulated experience, changing priorities, and potential age-related workplace biases.',
      icon: '📈'
    }
  ],
  learning: [
    {
      id: 'vark-scientific',
      question: 'Is the VARK learning styles model scientifically supported?',
      answer: 'The VARK model developed by Neil Fleming has mixed scientific support. While many educators find it useful, research reviews show limited evidence that matching teaching to learning styles improves outcomes. The model is valuable for self-awareness and trying diverse learning approaches, but shouldn\'t be treated as a rigid framework that limits learning methods.',
      icon: '🔬'
    },
    {
      id: 'learning-myth',
      question: 'Are learning styles a myth according to cognitive science?',
      answer: 'Cognitive scientists debate learning styles effectiveness. While people do have preferences, rigorous studies rarely show improved learning when instruction matches preferred styles. The "myth" criticism stems from oversimplification - the brain is more flexible than style categories suggest. However, style awareness can increase motivation and help learners try varied approaches.',
      icon: '🧠'
    },
    {
      id: 'multimodal-advantage',
      question: 'Why do most people show multimodal learning preferences?',
      answer: 'Research indicates 60-70% of learners are multimodal, preferring combinations of visual, auditory, reading/writing, and kinesthetic approaches. This reflects how the brain naturally processes information through multiple pathways. Multimodal learning often leads to better retention because it creates more neural connections and memory traces.',
      icon: '🔄'
    },
    {
      id: 'age-learning-change',
      question: 'How do learning preferences change with age and experience?',
      answer: 'Learning preferences can shift due to neuroplasticity, life experiences, and cognitive changes. Younger learners often prefer kinesthetic approaches, while adults may lean toward reading/writing. Professional experience, education level, and exposure to different learning environments all influence preferences. Regular reassessment can reveal these evolving patterns.',
      icon: '📈'
    },
    {
      id: 'learning-effectiveness',
      question: 'What learning strategies are actually proven to work best?',
      answer: 'Cognitive research identifies highly effective strategies regardless of learning style: spaced repetition, active recall, interleaving different topics, elaborative interrogation (asking "why"), and connecting new information to existing knowledge. These evidence-based techniques often outperform style-matched instruction in controlled studies.',
      icon: '✅'
    }
  ],
  relationship: [
    {
      id: 'love-languages-research',
      question: 'Is the Five Love Languages theory backed by psychological research?',
      answer: 'Gary Chapman\'s Five Love Languages concept is based on his counseling experience rather than rigorous empirical research. While widely popular, scientific studies on love languages are limited. Some research supports the idea that people have different relationship preferences, but the five-category model lacks strong statistical validation. It\'s best used as a communication framework rather than a scientific taxonomy.',
      icon: '🔬'
    },
    {
      id: 'attachment-styles',
      question: 'How do attachment styles affect adult relationships?',
      answer: 'Attachment theory, developed by John Bowlby and Mary Ainsworth, has extensive research support. Studies show that early caregiver relationships create internal working models affecting adult relationships. Secure, anxious, avoidant, and disorganized attachment styles influence how people form bonds, handle conflict, and express intimacy throughout life.',
      icon: '🤝'
    },
    {
      id: 'relationship-compatibility',
      question: 'Can personality tests predict relationship compatibility and success?',
      answer: 'Research shows weak to moderate correlations between personality similarity and relationship satisfaction. While some traits (emotional stability, agreeableness) predict better relationships, compatibility depends more on communication skills, shared values, conflict resolution ability, and commitment levels than personality matching alone.',
      icon: '💑'
    },
    {
      id: 'interpersonal-measurement',
      question: 'How accurately can interpersonal skills be measured through assessment?',
      answer: 'Interpersonal skill assessment faces challenges because social behavior is highly context-dependent. Self-report measures may not reflect actual behavior, and social desirability bias affects responses. Multi-source feedback (360-degree assessments) and behavioral observations provide more accurate pictures than single assessments.',
      icon: '📊'
    },
    {
      id: 'love-style-science',
      question: 'What\'s the scientific basis for different "love styles" or romantic approaches?',
      answer: 'Love style theories draw from social psychology research on romantic relationships. Robert Sternberg\'s Triangular Theory of Love (intimacy, passion, commitment) and John Lee\'s love styles (Eros, Ludus, Storge, etc.) have research support. However, individual differences in romantic expression are complex and influenced by culture, personality, attachment history, and life experience.',
      icon: '💖'
    }
  ],
  astrology: [
    {
      id: 'astrology-empirical',
      question: 'What does scientific research say about astrology\'s validity?',
      answer: 'Large-scale scientific studies consistently find no statistically significant correlations between astrological predictions and actual outcomes or personality traits. The "Mars Effect" study by Michel Gauquelin is one of few showing weak correlations, but results haven\'t been reliably replicated. Astrology is best understood as a symbolic system for self-reflection rather than predictive science.',
      icon: '🔬'
    },
    {
      id: 'birth-chart-precision',
      question: 'How much does birth time accuracy affect astrological interpretation?',
      answer: 'Birth time is crucial for calculating the Ascendant (rising sign) and house positions. A few minutes can change your rising sign, while hours can shift planetary house placements entirely. Without precise time, about 75% of traditional astrological information (houses, aspects, Midheaven) becomes unreliable, limiting analysis to sun and moon sign interpretations.',
      icon: '⏰'
    },
    {
      id: 'zodiac-personality',
      question: 'Do people actually exhibit their zodiac sign personality traits?',
      answer: 'Controlled studies show no reliable correlations between zodiac signs and personality measures. The "Barnum Effect" explains why general astrological descriptions seem accurate - they use vague, universally applicable statements. However, belief in astrology can influence behavior through self-fulfilling prophecy and selective attention to confirming experiences.',
      icon: '🎭'
    },
    {
      id: 'precession-problem',
      question: 'How does astronomical precession affect astrological accuracy?',
      answer: 'Due to Earth\'s axial precession, the zodiac has shifted about 24 degrees since astrology was codified. This means most people are actually the "previous" sign astronomically. Western astrology uses a "tropical" zodiac fixed to seasons rather than constellations, while Vedic astrology accounts for precession with a "sidereal" zodiac, creating different sign placements.',
      icon: '🌍'
    },
    {
      id: 'astrology-psychology',
      question: 'Can astrology be valuable from a psychological perspective despite lacking scientific validity?',
      answer: 'Many psychologists view astrology as a form of "psychological tool" similar to Jungian archetypes. It can promote self-reflection, provide a framework for discussing personality, and offer symbolic meaning during life transitions. The value lies in the interpretive process and self-examination rather than predictive accuracy.',
      icon: '🧠'
    }
  ],
  tarot: [
    {
      id: 'tarot-randomness',
      question: 'How can random card draws provide meaningful insights?',
      answer: 'Tarot works through psychological mechanisms rather than supernatural forces. The random selection creates a "Rorschach effect" where you project meaning onto symbolic imagery. This process, called apophenia (finding patterns in random data), can trigger valuable self-reflection and reveal subconscious thoughts about your situation.',
      icon: '🔀'
    },
    {
      id: 'tarot-symbolism',
      question: 'What\'s the psychological basis of tarot card symbolism?',
      answer: 'Tarot imagery draws from universal archetypal symbols studied by Carl Jung - death/rebirth, the journey, authority figures, etc. These symbols appear across cultures and tap into collective unconscious patterns. The 78-card system covers major life themes, making it likely that drawn cards will resonate with current concerns through symbolic relevance.',
      icon: '🎭'
    },
    {
      id: 'confirmation-bias',
      question: 'How does confirmation bias affect tarot reading accuracy?',
      answer: 'Confirmation bias significantly influences tarot effectiveness - people tend to remember "hits" and forget "misses." Cold reading techniques (vague statements, high-probability guesses) make interpretations seem more accurate. However, this bias can be beneficial if it encourages positive action and self-reflection, regardless of supernatural validity.',
      icon: '🧠'
    },
    {
      id: 'tarot-therapy',
      question: 'Can tarot be used as a form of self-therapy or reflection tool?',
      answer: 'Many therapists incorporate tarot-like techniques for exploring clients\' unconscious thoughts and feelings. The cards serve as "conversation starters" that bypass rational defenses and access intuitive insights. Research shows that structured self-reflection, regardless of method, can improve decision-making and emotional awareness.',
      icon: '💭'
    },
    {
      id: 'cultural-interpretation',
      question: 'How do cultural backgrounds influence tarot card interpretation?',
      answer: 'Tarot interpretations vary significantly across cultures due to different symbolic associations, religious backgrounds, and value systems. Western interpretations emphasize individualism and personal choice, while Eastern approaches might focus more on harmony and collective well-being. Personal experiences and cultural conditioning heavily influence which card meanings resonate most strongly.',
      icon: '🌍'
    }
  ],
  numerology: [
    {
      id: 'bazi-historical',
      question: 'What\'s the historical and cultural foundation of BaZi (Four Pillars) analysis?',
      answer: 'BaZi originated during China\'s Song Dynasty (960-1279 AD) and is rooted in Traditional Chinese Medicine, Five Element theory, and Daoist philosophy. It represents over 1000 years of systematic observation and refinement. While culturally significant, it lacks modern scientific validation and should be understood as a traditional interpretive framework rather than predictive science.',
      icon: '📜'
    },
    {
      id: 'chinese-zodiac-astronomy',
      question: 'How does the Chinese zodiac relate to actual astronomical cycles?',
      answer: 'The Chinese zodiac follows a 12-year cycle based on Jupiter\'s approximate orbit around the sun. However, the animal associations and personality traits attributed to each year are cultural constructs rather than astronomical phenomena. The zodiac served as a mnemonic system for tracking years and agricultural cycles in ancient China.',
      icon: '🐲'
    },
    {
      id: 'name-numerology-linguistics',
      question: 'What\'s the linguistic basis for Chinese name numerology and character analysis?',
      answer: 'Chinese name analysis draws from traditional beliefs about character stroke counts, phonetic sounds, and semantic meanings. While these elements do carry cultural significance and psychological associations for native speakers, the numerological interpretations are metaphysical rather than linguistically validated. Modern names often blend traditional and contemporary meanings.',
      icon: '✍️'
    },
    {
      id: 'cultural-vs-scientific',
      question: 'How should I understand numerology - as cultural wisdom or scientific prediction?',
      answer: 'Numerology represents centuries of cultural wisdom and systematic thinking about human nature, but it doesn\'t meet modern scientific standards for predictive validity. Like mythology or literature, it offers symbolic frameworks for self-reflection and meaning-making. Its value lies in cultural insight and personal contemplation rather than factual prediction.',
      icon: '⚖️'
    },
    {
      id: 'cross-cultural-validity',
      question: 'Do Chinese numerological concepts apply to people from other cultural backgrounds?',
      answer: 'Chinese numerology was developed within specific cultural, linguistic, and philosophical contexts. While universal human experiences may create some cross-cultural resonance, the symbolic associations, values, and interpretive frameworks are culturally specific. Non-Chinese individuals might find interesting perspectives, but should understand they\'re engaging with foreign cultural concepts.',
      icon: '🌏'
    }
  ]
} as const;

export type ModuleName = keyof typeof FAQ_CONFIG;
