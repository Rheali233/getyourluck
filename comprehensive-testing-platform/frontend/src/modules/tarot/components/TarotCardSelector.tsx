/**
 * Tarot Card Selector Component
 * 塔罗牌选择器组件
 */

import React, { useState, useEffect } from 'react';
import type { TarotCard, DrawnCard } from '../types';

interface TarotCardSelectorProps {
  cards: TarotCard[];
  spreadPositions: Array<{ name: string; meaning: string }>;
  // eslint-disable-next-line no-unused-vars
  onCardsSelected: (drawnCards: DrawnCard[]) => void;
  isLoading?: boolean;
}

export const TarotCardSelector: React.FC<TarotCardSelectorProps> = ({
  cards,
  spreadPositions,
  onCardsSelected,
  isLoading = false
}) => {
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);

  // 洗牌 - 使用Fisher-Yates洗牌算法，确保真正的随机性
  useEffect(() => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    setShuffledCards(shuffled);
  }, [cards]);

  // 处理卡牌点击
  const handleCardClick = (card: TarotCard) => {
    if (selectedCards.length >= spreadPositions.length) {
      return; // 已经选择了足够的卡牌
    }

    // 随机决定是否反转 - 使用更均匀的随机分布
    const isReversed = Math.random() < 0.5; // 50% 概率反转，更接近真实塔罗牌
    
    const drawnCard: DrawnCard = {
      card,
      isReversed,
      position: selectedCards.length + 1, // 使用数字位置
      positionMeaning: spreadPositions[selectedCards.length]?.meaning || 'Unknown position'
    };

    setSelectedCards(prev => [...prev, drawnCard]);
    setFlippedCards(prev => new Set([...prev, card.id]));
  };

  // 重置选择
  const handleReset = () => {
    setSelectedCards([]);
    setFlippedCards(new Set());
  };

  // 开始解读
  const handleStartReading = () => {
    if (selectedCards.length === spreadPositions.length) {
      onCardsSelected(selectedCards);
    }
  };

  const canSelectMore = selectedCards.length < spreadPositions.length;
  const isComplete = selectedCards.length === spreadPositions.length;

  return (
    <div className="space-y-6">
      {/* 选择状态 */}
      <div className="text-left">
        <h3 className="text-2xl font-bold text-violet-900 mb-2">
          Select Your Cards
        </h3>
        <p className="text-violet-800">
          Choose {spreadPositions.length} cards for your reading
          {selectedCards.length > 0 && ` (${selectedCards.length}/${spreadPositions.length} selected)`}
        </p>
      </div>

      {/* 已选择的卡牌预览 */}
      {selectedCards.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-violet-200">
          <h4 className="text-lg font-bold text-violet-900 mb-3">Selected Cards</h4>
          <div className="flex flex-wrap gap-3">
            {selectedCards.map((drawnCard, index) => (
              <div key={index} className="bg-violet-50 rounded-lg p-3 min-w-[120px] border border-violet-200">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎴</div>
                  <p className="text-violet-900 font-medium text-sm">
                    {drawnCard.card.name_en}
                    {drawnCard.isReversed && ' (Reversed)'}
                  </p>
                  <p className="text-violet-700 text-xs">
                    {drawnCard.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 卡牌网格 - 3行布局，每行水平滚动 */}
      <div className="space-y-3">
        {/* 第一行 */}
        <div className="relative">
          {/* 左滑动提示 */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-violet-200/80 to-transparent z-10 pointer-events-none"></div>
          {/* 右滑动提示 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-violet-200/80 to-transparent z-10 pointer-events-none"></div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide" style={{width: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {shuffledCards.map((card) => {
          const selectedCard = selectedCards.find(sc => sc.card.id === card.id);
          const isSelected = !!selectedCard;
          const isFlipped = flippedCards.has(card.id);
          const isReversed = selectedCard?.isReversed || false;
          const canSelect = canSelectMore && !isSelected;

          return (
            <div
              key={card.id}
                className={`relative w-20 h-28 cursor-pointer transition-all duration-300 flex-shrink-0 ${
                canSelect 
                    ? '' 
                  : isSelected 
                    ? 'opacity-50' 
                    : 'opacity-30 cursor-not-allowed'
              }`}
              onClick={() => canSelect && handleCardClick(card)}
            >
              <div
                className={`w-full h-full rounded-xl border-0 bg-transparent transition-all duration-700 transform shadow-lg`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* 卡牌背面（默认图案：上红下黑 + 月亮），完全对齐示例小卡 */}
                <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 ${
                  isFlipped ? 'opacity-0' : 'opacity-100'
                }`}>
                  {/* 与示例小卡等比例的卡背：改用 SVG 以确保比例一致、可放大 */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
                      <defs>
                        {/* 外投影增强厚重感 */}
                        <filter id="cardDrop" x="-20%" y="-20%" width="140%" height="160%">
                          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
                        </filter>
                        {/* 内阴影增加凹陷感 */}
                        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feFlood floodColor="#000" floodOpacity="0.35" result="flood" />
                          <feComposite in="flood" in2="SourceAlpha" operator="in" result="shadow" />
                          <feGaussianBlur in="shadow" stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      {/* 卡片底色（红色），并绘制内容元素 */}
                      <g filter="url(#cardDrop)">
                        {/* 外层红色底板 + 黑色描边 */}
                        <rect x="0" y="0" width="100" height="140" rx="12" fill="#dc2626" stroke="#000000" strokeWidth="4" />
                        {/* 月亮：占据上半区高度（半径≈30，中心 y≈35） */}
                        <circle cx="35" cy="45" r="30" fill="#efe4db" filter="url(#innerShadow)" />
                        {/* 黑色弧形山丘：宽度与卡牌一致，左高右低 */}
                        <path d="M0 80 Q 50 65 100 90 L 100 140 L 0 140 Z" fill="#181818" />
                        {/* 山丘纹理线条（全宽） */}
                        <path d="M4 95 Q 50 80 96 96" stroke="#252525" strokeWidth="3" fill="none" opacity="0.55" />
                        <path d="M6 105 Q 50 90 94 104" stroke="#2b2b2b" strokeWidth="3" fill="none" opacity="0.5" />
                      </g>
                    </svg>
                  </div>
                </div>
                
                {/* 卡牌正面 */}
                <div className={`absolute inset-0 rounded-xl p-2 flex flex-col items-center justify-center ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                } ${isReversed ? 'rotate-180' : ''}`}>
                  {/* 卡牌背景 - 纯白背景，无半透明 */}
                  <div className="absolute inset-0 rounded-xl bg-white"></div>
                  {/* 只有正位卡牌才显示红色内边框 */}
                  {!isReversed && <div className="absolute inset-1 rounded-xl border-2 border-red-300"></div>}
                  
                  {/* 卡牌内容 */}
                  <div className="relative z-10 w-full h-full">
                    {/* 左上角标题 - 专业塔罗牌风格 */}
                    <div className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold text-red-900 leading-tight pr-2 max-w-[70%] text-left">
                      {card.name_en}
                    </div>
                    
                    {/* 底部装饰 - 对称设计 */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">
                          {card.name_en.includes('The ') ? 
                            (card.name_en === 'The Fool' ? '0' : 
                             card.name_en === 'The Magician' ? 'I' :
                             card.name_en === 'The High Priestess' ? 'II' :
                             card.name_en === 'The Empress' ? 'III' :
                             card.name_en === 'The Emperor' ? 'IV' :
                             card.name_en === 'The Hierophant' ? 'V' :
                             card.name_en === 'The Lovers' ? 'VI' :
                             card.name_en === 'The Chariot' ? 'VII' :
                             card.name_en === 'Strength' ? 'VIII' :
                             card.name_en === 'The Hermit' ? 'IX' :
                             card.name_en === 'Wheel of Fortune' ? 'X' :
                             card.name_en === 'Justice' ? 'XI' :
                             card.name_en === 'The Hanged Man' ? 'XII' :
                             card.name_en === 'Death' ? 'XIII' :
                             card.name_en === 'Temperance' ? 'XIV' :
                             card.name_en === 'The Devil' ? 'XV' :
                             card.name_en === 'The Tower' ? 'XVI' :
                             card.name_en === 'The Star' ? 'XVII' :
                             card.name_en === 'The Moon' ? 'XVIII' :
                             card.name_en === 'The Sun' ? 'XIX' :
                             card.name_en === 'Judgement' ? 'XX' :
                             card.name_en === 'The World' ? 'XXI' : '?') : 
                            card.name_en.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  
                  {/* 选中标记 */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl border-2 border-red-400 bg-red-100/20"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </div>

        {/* 第二行 */}
        <div className="relative">
          {/* 左滑动提示 */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-violet-200/80 to-transparent z-10 pointer-events-none"></div>
          {/* 右滑动提示 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-violet-200/80 to-transparent z-10 pointer-events-none"></div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide" style={{width: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {shuffledCards.slice(26, 52).map((card) => {
            const selectedCard = selectedCards.find(sc => sc.card.id === card.id);
            const isSelected = !!selectedCard;
            const isFlipped = flippedCards.has(card.id);
            const isReversed = selectedCard?.isReversed || false;
            const canSelect = canSelectMore && !isSelected;

            return (
              <div
                key={card.id}
                className={`relative w-20 h-28 cursor-pointer transition-all duration-300 flex-shrink-0 ${
                  canSelect 
                    ? '' 
                    : isSelected 
                      ? 'opacity-50' 
                      : 'opacity-30 cursor-not-allowed'
                }`}
                onClick={() => canSelect && handleCardClick(card)}
              >
              <div
                className={`w-full h-full rounded-xl border-0 bg-transparent transition-all duration-700 transform shadow-lg`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* 卡牌背面（默认图案：上红下黑 + 月亮），完全对齐示例小卡 */}
                <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 ${
                  isFlipped ? 'opacity-0' : 'opacity-100'
                }`}>
                  {/* 与示例小卡等比例的卡背：改用 SVG 以确保比例一致、可放大 */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
                      <defs>
                        {/* 外投影增强厚重感 */}
                        <filter id="cardDrop" x="-20%" y="-20%" width="140%" height="160%">
                          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
                        </filter>
                        {/* 内阴影增加凹陷感 */}
                        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feFlood floodColor="#000" floodOpacity="0.35" result="flood" />
                          <feComposite in="flood" in2="SourceAlpha" operator="in" result="shadow" />
                          <feGaussianBlur in="shadow" stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      {/* 卡片底色（红色），并绘制内容元素 */}
                      <g filter="url(#cardDrop)">
                        {/* 外层红色底板 + 黑色描边 */}
                        <rect x="0" y="0" width="100" height="140" rx="12" fill="#dc2626" stroke="#000000" strokeWidth="4" />
                        {/* 月亮：占据上半区高度（半径≈30，中心 y≈35） */}
                        <circle cx="35" cy="45" r="30" fill="#efe4db" filter="url(#innerShadow)" />
                        {/* 黑色弧形山丘：宽度与卡牌一致，左高右低 */}
                        <path d="M0 80 Q 50 65 100 90 L 100 140 L 0 140 Z" fill="#181818" />
                        {/* 山丘纹理线条（全宽） */}
                        <path d="M4 95 Q 50 80 96 96" stroke="#252525" strokeWidth="3" fill="none" opacity="0.55" />
                        <path d="M6 105 Q 50 90 94 104" stroke="#2b2b2b" strokeWidth="3" fill="none" opacity="0.5" />
                      </g>
                    </svg>
                  </div>
                </div>
                
                {/* 卡牌正面 */}
                <div className={`absolute inset-0 rounded-xl p-2 flex flex-col items-center justify-center ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                } ${isReversed ? 'rotate-180' : ''}`}>
                  {/* 卡牌背景 - 纯白背景，无半透明 */}
                  <div className="absolute inset-0 rounded-xl bg-white"></div>
                  {/* 只有正位卡牌才显示红色内边框 */}
                  {!isReversed && <div className="absolute inset-1 rounded-xl border-2 border-red-300"></div>}
                  
                  {/* 卡牌内容 */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    {/* 卡牌名称 - 左上角 */}
                    <div className="absolute top-1 left-1 text-red-900 text-[10px] sm:text-xs font-bold leading-tight">
                      {card.name_en}
                    </div>
                    
                    {/* 底部数字/符号 - 右下角 */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {card.suit === 'major' ? 
                          (card.name_en === 'The Fool' ? '0' :
                           card.name_en === 'The Magician' ? 'I' :
                           card.name_en === 'The High Priestess' ? 'II' :
                           card.name_en === 'The Empress' ? 'III' :
                           card.name_en === 'The Emperor' ? 'IV' :
                           card.name_en === 'The Hierophant' ? 'V' :
                           card.name_en === 'The Lovers' ? 'VI' :
                           card.name_en === 'The Chariot' ? 'VII' :
                           card.name_en === 'Strength' ? 'VIII' :
                           card.name_en === 'The Hermit' ? 'IX' :
                           card.name_en === 'Wheel of Fortune' ? 'X' :
                           card.name_en === 'Justice' ? 'XI' :
                           card.name_en === 'The Hanged Man' ? 'XII' :
                           card.name_en === 'Death' ? 'XIII' :
                           card.name_en === 'Temperance' ? 'XIV' :
                           card.name_en === 'The Devil' ? 'XV' :
                           card.name_en === 'The Tower' ? 'XVI' :
                           card.name_en === 'The Star' ? 'XVII' :
                           card.name_en === 'The Moon' ? 'XVIII' :
                           card.name_en === 'The Sun' ? 'XIX' :
                           card.name_en === 'Judgement' ? 'XX' :
                           card.name_en === 'The World' ? 'XXI' : '?') : 
                          card.name_en.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  
                  {/* 选中标记 */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl border-2 border-red-400 bg-red-100/20"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </div>

        {/* 第三行 */}
        <div className="relative">
          {/* 左滑动提示 */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-violet-200/80 to-transparent z-10 pointer-events-none"></div>
          {/* 右滑动提示 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-violet-200/80 to-transparent z-10 pointer-events-none"></div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide" style={{width: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {shuffledCards.slice(52, 78).map((card) => {
            const selectedCard = selectedCards.find(sc => sc.card.id === card.id);
            const isSelected = !!selectedCard;
            const isFlipped = flippedCards.has(card.id);
            const isReversed = selectedCard?.isReversed || false;
            const canSelect = canSelectMore && !isSelected;

            return (
              <div
                key={card.id}
                className={`relative w-20 h-28 cursor-pointer transition-all duration-300 flex-shrink-0 ${
                  canSelect 
                    ? '' 
                    : isSelected 
                      ? 'opacity-50' 
                      : 'opacity-30 cursor-not-allowed'
                }`}
                onClick={() => canSelect && handleCardClick(card)}
              >
              <div
                className={`w-full h-full rounded-xl border-0 bg-transparent transition-all duration-700 transform shadow-lg`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* 卡牌背面（默认图案：上红下黑 + 月亮），完全对齐示例小卡 */}
                <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 ${
                  isFlipped ? 'opacity-0' : 'opacity-100'
                }`}>
                  {/* 与示例小卡等比例的卡背：改用 SVG 以确保比例一致、可放大 */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
                      <defs>
                        {/* 外投影增强厚重感 */}
                        <filter id="cardDrop" x="-20%" y="-20%" width="140%" height="160%">
                          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
                        </filter>
                        {/* 内阴影增加凹陷感 */}
                        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feFlood floodColor="#000" floodOpacity="0.35" result="flood" />
                          <feComposite in="flood" in2="SourceAlpha" operator="in" result="shadow" />
                          <feGaussianBlur in="shadow" stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      {/* 卡片底色（红色），并绘制内容元素 */}
                      <g filter="url(#cardDrop)">
                        {/* 外层红色底板 + 黑色描边 */}
                        <rect x="0" y="0" width="100" height="140" rx="12" fill="#dc2626" stroke="#000000" strokeWidth="4" />
                        {/* 月亮：占据上半区高度（半径≈30，中心 y≈35） */}
                        <circle cx="35" cy="45" r="30" fill="#efe4db" filter="url(#innerShadow)" />
                        {/* 黑色弧形山丘：宽度与卡牌一致，左高右低 */}
                        <path d="M0 80 Q 50 65 100 90 L 100 140 L 0 140 Z" fill="#181818" />
                        {/* 山丘纹理线条（全宽） */}
                        <path d="M4 95 Q 50 80 96 96" stroke="#252525" strokeWidth="3" fill="none" opacity="0.55" />
                        <path d="M6 105 Q 50 90 94 104" stroke="#2b2b2b" strokeWidth="3" fill="none" opacity="0.5" />
                      </g>
                    </svg>
                  </div>
                </div>
                
                {/* 卡牌正面 */}
                <div className={`absolute inset-0 rounded-xl p-2 flex flex-col items-center justify-center ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                } ${isReversed ? 'rotate-180' : ''}`}>
                  {/* 卡牌背景 - 纯白背景，无半透明 */}
                  <div className="absolute inset-0 rounded-xl bg-white"></div>
                  {/* 只有正位卡牌才显示红色内边框 */}
                  {!isReversed && <div className="absolute inset-1 rounded-xl border-2 border-red-300"></div>}
                  
                  {/* 卡牌内容 */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    {/* 卡牌名称 - 左上角 */}
                    <div className="absolute top-1 left-1 text-red-900 text-[10px] sm:text-xs font-bold leading-tight">
                      {card.name_en}
                    </div>
                    
                    {/* 底部数字/符号 - 右下角 */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {card.suit === 'major' ? 
                          (card.name_en === 'The Fool' ? '0' :
                           card.name_en === 'The Magician' ? 'I' :
                           card.name_en === 'The High Priestess' ? 'II' :
                           card.name_en === 'The Empress' ? 'III' :
                           card.name_en === 'The Emperor' ? 'IV' :
                           card.name_en === 'The Hierophant' ? 'V' :
                           card.name_en === 'The Lovers' ? 'VI' :
                           card.name_en === 'The Chariot' ? 'VII' :
                           card.name_en === 'Strength' ? 'VIII' :
                           card.name_en === 'The Hermit' ? 'IX' :
                           card.name_en === 'Wheel of Fortune' ? 'X' :
                           card.name_en === 'Justice' ? 'XI' :
                           card.name_en === 'The Hanged Man' ? 'XII' :
                           card.name_en === 'Death' ? 'XIII' :
                           card.name_en === 'Temperance' ? 'XIV' :
                           card.name_en === 'The Devil' ? 'XV' :
                           card.name_en === 'The Tower' ? 'XVI' :
                           card.name_en === 'The Star' ? 'XVII' :
                           card.name_en === 'The Moon' ? 'XVIII' :
                           card.name_en === 'The Sun' ? 'XIX' :
                           card.name_en === 'Judgement' ? 'XX' :
                           card.name_en === 'The World' ? 'XXI' : '?') : 
                          card.name_en.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  
                  {/* 选中标记 */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl border-2 border-red-400 bg-red-100/20"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleReset}
          disabled={selectedCards.length === 0}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
        >
          Reset Selection
        </button>
        
        <button
          onClick={handleStartReading}
          disabled={!isComplete || isLoading}
          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Starting Reading...' : 'Start Reading'}
        </button>
      </div>
    </div>
  );
};
