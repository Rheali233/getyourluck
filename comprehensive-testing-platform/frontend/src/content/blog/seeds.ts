export interface BlogSeedArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  readTime?: string;
  author?: string;
  publishDate?: string;
  contentHtml?: string;
}

export const BLOG_SEEDS: BlogSeedArticle[] = [
  {
    id: 'seed-mbti-beginners',
    slug: 'mbti-for-beginners',
    title: 'MBTI for Beginners: Understand 16 Types in Minutes',
    excerpt: 'A concise walkthrough to help you quickly grasp the MBTI framework and apply it in daily life.',
    coverImage: '/images/blog/mbti-beginners.jpg',
    category: 'Psychology',
    readTime: '6 min',
    author: 'SelfAtlas Editorial',
    publishDate: '2025-01-10',
    contentHtml: '<p>MBTI divides personality into 16 types. This beginner guide explains the four dichotomies with real-life examples and simple dos and don’ts for each dimension.</p>'
  },
  {
    id: 'seed-eq-practical',
    slug: 'practical-emotional-intelligence',
    title: 'Practical Emotional Intelligence: 5 Habits to Train Daily',
    excerpt: 'Simple, repeatable practices to build self-awareness and improve relationships at work and home.',
    coverImage: '/images/blog/eq-practical.jpg',
    category: 'Psychology',
    readTime: '7 min',
    author: 'SelfAtlas Editorial',
    publishDate: '2025-01-12',
    contentHtml: '<p>Five daily habits to build emotional awareness and self-regulation. Learn micro‑journaling, trigger logs, active listening, and reflective questions you can use today.</p>'
  },
  {
    id: 'seed-holland-guide',
    slug: 'holland-code-career-guide',
    title: 'Holland Code Career Guide: Match Interests to Jobs',
    excerpt: 'Learn how RIASEC connects your interests to real job families and next steps.',
    coverImage: '/images/blog/holland-guide.jpg',
    category: 'Career',
    readTime: '8 min',
    author: 'SelfAtlas Editorial',
    publishDate: '2025-01-14',
    contentHtml: '<p>RIASEC connects interests to job families. This guide shows how to read your Holland results and shortlist roles with stronger person–environment fit.</p>'
  },
  {
    id: 'seed-bazi-basics',
    slug: 'bazi-basics',
    title: 'BaZi Basics: What the Four Pillars Reveal About You',
    excerpt: 'A friendly introduction to the Four Pillars framework and how it describes personality and timing.',
    coverImage: '/images/blog/bazi-basics.jpg',
    category: 'Numerology',
    readTime: '5 min',
    author: 'SelfAtlas Editorial',
    publishDate: '2025-01-16',
    contentHtml: '<p>BaZi summarizes your birth date and time into four pillars. Understand Ten Gods, Five Elements balance, and what timing cycles typically mean for action.</p>'
  },
  {
    id: 'seed-name-tips',
    slug: 'chinese-name-recommendation-tips',
    title: 'Chinese Name Recommendation: Key Principles You Should Know',
    excerpt: 'Cultural considerations and practical tips for selecting meaningful Chinese names.',
    coverImage: '/images/blog/name-recommendation.jpg',
    category: 'Numerology',
    readTime: '6 min',
    author: 'SelfAtlas Editorial',
    publishDate: '2025-01-18',
    contentHtml: '<p>Chinese name recommendations blend sound, meaning, and element balance. Learn key principles, taboo pitfalls, and how to shortlist culturally coherent names.</p>'
  },
  {
    id: 'seed-tarot-3-spreads',
    slug: 'three-tarot-spreads-every-beginner-should-try',
    title: 'Three Tarot Spreads Every Beginner Should Try',
    excerpt: 'Start your tarot journey with three simple spreads that deliver clear insights.',
    coverImage: '/images/blog/tarot-spreads.jpg',
    category: 'Tarot',
    readTime: '5 min',
    author: 'SelfAtlas Editorial',
    publishDate: '2025-01-20',
    contentHtml: '<p>Try these three approachable tarot spreads to clarify context, options, and next steps—perfect for beginners who want clear, actionable readings.</p>'
  }
];


