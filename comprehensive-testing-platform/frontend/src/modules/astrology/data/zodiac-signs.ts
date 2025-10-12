/**
 * Zodiac Signs Basic Data
 * 12星座基础数据
 */

import type { ZodiacSign } from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name_zh: '白羊座',
    name_en: 'Aries',
    symbol: '♈',
    element: 'fire',
    quality: 'cardinal',
    ruling_planet: 'Mars',
    date_range: {
      start: '03-21',
      end: '04-19'
    },
    traits: ['energetic', 'confident', 'pioneering', 'impulsive', 'competitive'],
    compatibility: {
      aries: 0.7, taurus: 0.4, gemini: 0.8, cancer: 0.3,
      leo: 0.9, virgo: 0.4, libra: 0.6, scorpio: 0.5,
      sagittarius: 0.9, capricorn: 0.4, aquarius: 0.8, pisces: 0.5
    }
  },
  {
    id: 'taurus',
    name_zh: '金牛座',
    name_en: 'Taurus',
    symbol: '♉',
    element: 'earth',
    quality: 'fixed',
    ruling_planet: 'Venus',
    date_range: {
      start: '04-20',
      end: '05-20'
    },
    traits: ['reliable', 'patient', 'practical', 'stubborn', 'sensual'],
    compatibility: {
      aries: 0.4, taurus: 0.7, gemini: 0.5, cancer: 0.8,
      leo: 0.5, virgo: 0.9, libra: 0.6, scorpio: 0.7,
      sagittarius: 0.4, capricorn: 0.9, aquarius: 0.3, pisces: 0.8
    }
  },
  {
    id: 'gemini',
    name_zh: '双子座',
    name_en: 'Gemini',
    symbol: '♊',
    element: 'air',
    quality: 'mutable',
    ruling_planet: 'Mercury',
    date_range: {
      start: '05-21',
      end: '06-20'
    },
    traits: ['adaptable', 'curious', 'communicative', 'inconsistent', 'witty'],
    compatibility: {
      aries: 0.8, taurus: 0.5, gemini: 0.7, cancer: 0.4,
      leo: 0.8, virgo: 0.6, libra: 0.9, scorpio: 0.4,
      sagittarius: 0.8, capricorn: 0.3, aquarius: 0.9, pisces: 0.5
    }
  },
  {
    id: 'cancer',
    name_zh: '巨蟹座',
    name_en: 'Cancer',
    symbol: '♋',
    element: 'water',
    quality: 'cardinal',
    ruling_planet: 'Moon',
    date_range: {
      start: '06-21',
      end: '07-22'
    },
    traits: ['nurturing', 'emotional', 'intuitive', 'moody', 'protective'],
    compatibility: {
      aries: 0.3, taurus: 0.8, gemini: 0.4, cancer: 0.7,
      leo: 0.5, virgo: 0.8, libra: 0.4, scorpio: 0.9,
      sagittarius: 0.3, capricorn: 0.6, aquarius: 0.3, pisces: 0.9
    }
  },
  {
    id: 'leo',
    name_zh: '狮子座',
    name_en: 'Leo',
    symbol: '♌',
    element: 'fire',
    quality: 'fixed',
    ruling_planet: 'Sun',
    date_range: {
      start: '07-23',
      end: '08-22'
    },
    traits: ['confident', 'generous', 'dramatic', 'proud', 'creative'],
    compatibility: {
      aries: 0.9, taurus: 0.5, gemini: 0.8, cancer: 0.5,
      leo: 0.7, virgo: 0.4, libra: 0.8, scorpio: 0.5,
      sagittarius: 0.9, capricorn: 0.4, aquarius: 0.6, pisces: 0.4
    }
  },
  {
    id: 'virgo',
    name_zh: '处女座',
    name_en: 'Virgo',
    symbol: '♍',
    element: 'earth',
    quality: 'mutable',
    ruling_planet: 'Mercury',
    date_range: {
      start: '08-23',
      end: '09-22'
    },
    traits: ['analytical', 'practical', 'perfectionist', 'critical', 'helpful'],
    compatibility: {
      aries: 0.4, taurus: 0.9, gemini: 0.6, cancer: 0.8,
      leo: 0.4, virgo: 0.7, libra: 0.5, scorpio: 0.8,
      sagittarius: 0.4, capricorn: 0.9, aquarius: 0.4, pisces: 0.6
    }
  },
  {
    id: 'libra',
    name_zh: '天秤座',
    name_en: 'Libra',
    symbol: '♎',
    element: 'air',
    quality: 'cardinal',
    ruling_planet: 'Venus',
    date_range: {
      start: '09-23',
      end: '10-22'
    },
    traits: ['diplomatic', 'charming', 'balanced', 'indecisive', 'social'],
    compatibility: {
      aries: 0.6, taurus: 0.6, gemini: 0.9, cancer: 0.4,
      leo: 0.8, virgo: 0.5, libra: 0.7, scorpio: 0.5,
      sagittarius: 0.8, capricorn: 0.4, aquarius: 0.9, pisces: 0.5
    }
  },
  {
    id: 'scorpio',
    name_zh: '天蝎座',
    name_en: 'Scorpio',
    symbol: '♏',
    element: 'water',
    quality: 'fixed',
    ruling_planet: 'Pluto',
    date_range: {
      start: '10-23',
      end: '11-21'
    },
    traits: ['intense', 'passionate', 'mysterious', 'jealous', 'transformative'],
    compatibility: {
      aries: 0.5, taurus: 0.7, gemini: 0.4, cancer: 0.9,
      leo: 0.5, virgo: 0.8, libra: 0.5, scorpio: 0.7,
      sagittarius: 0.4, capricorn: 0.8, aquarius: 0.3, pisces: 0.9
    }
  },
  {
    id: 'sagittarius',
    name_zh: '射手座',
    name_en: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    quality: 'mutable',
    ruling_planet: 'Jupiter',
    date_range: {
      start: '11-22',
      end: '12-21'
    },
    traits: ['adventurous', 'optimistic', 'philosophical', 'restless', 'honest'],
    compatibility: {
      aries: 0.9, taurus: 0.4, gemini: 0.8, cancer: 0.3,
      leo: 0.9, virgo: 0.4, libra: 0.8, scorpio: 0.4,
      sagittarius: 0.7, capricorn: 0.4, aquarius: 0.8, pisces: 0.5
    }
  },
  {
    id: 'capricorn',
    name_zh: '摩羯座',
    name_en: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    quality: 'cardinal',
    ruling_planet: 'Saturn',
    date_range: {
      start: '12-22',
      end: '01-19'
    },
    traits: ['ambitious', 'disciplined', 'practical', 'pessimistic', 'responsible'],
    compatibility: {
      aries: 0.4, taurus: 0.9, gemini: 0.3, cancer: 0.6,
      leo: 0.4, virgo: 0.9, libra: 0.4, scorpio: 0.8,
      sagittarius: 0.4, capricorn: 0.7, aquarius: 0.5, pisces: 0.8
    }
  },
  {
    id: 'aquarius',
    name_zh: '水瓶座',
    name_en: 'Aquarius',
    symbol: '♒',
    element: 'air',
    quality: 'fixed',
    ruling_planet: 'Uranus',
    date_range: {
      start: '01-20',
      end: '02-18'
    },
    traits: ['independent', 'innovative', 'humanitarian', 'detached', 'eccentric'],
    compatibility: {
      aries: 0.8, taurus: 0.3, gemini: 0.9, cancer: 0.3,
      leo: 0.6, virgo: 0.4, libra: 0.9, scorpio: 0.3,
      sagittarius: 0.8, capricorn: 0.5, aquarius: 0.7, pisces: 0.4
    }
  },
  {
    id: 'pisces',
    name_zh: '双鱼座',
    name_en: 'Pisces',
    symbol: '♓',
    element: 'water',
    quality: 'mutable',
    ruling_planet: 'Neptune',
    date_range: {
      start: '02-19',
      end: '03-20'
    },
    traits: ['compassionate', 'intuitive', 'artistic', 'escapist', 'sensitive'],
    compatibility: {
      aries: 0.5, taurus: 0.8, gemini: 0.5, cancer: 0.9,
      leo: 0.4, virgo: 0.6, libra: 0.5, scorpio: 0.9,
      sagittarius: 0.5, capricorn: 0.8, aquarius: 0.4, pisces: 0.7
    }
  }
];

// 根据日期获取星座
export function getZodiacSignByDate(month: number, day: number): ZodiacSign | null {
  for (const sign of ZODIAC_SIGNS) {
    const startParts = sign.date_range.start.split('-');
    const endParts = sign.date_range.end.split('-');
    
    if (startParts.length !== 2 || endParts.length !== 2) continue;
    
    const startMonth = parseInt(startParts[0] || '0', 10);
    const startDay = parseInt(startParts[1] || '0', 10);
    const endMonth = parseInt(endParts[0] || '0', 10);
    const endDay = parseInt(endParts[1] || '0', 10);
    
    // 处理跨年的情况（如摩羯座）
    if (startMonth > endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign;
      }
    } else {
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)) {
        return sign;
      }
    }
  }
  return null;
}

// 根据ID获取星座
export function getZodiacSignById(id: string): ZodiacSign | null {
  return ZODIAC_SIGNS.find(sign => sign.id === id) || null;
}