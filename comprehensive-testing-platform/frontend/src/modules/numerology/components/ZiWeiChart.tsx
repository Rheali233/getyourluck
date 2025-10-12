/**
 * ZiWei Chart Visualization Component
 * 紫微斗数命盘可视化组件
 */

import React, { useState } from 'react';
import { ZiWeiChart as ZiWeiChartType } from '../types';

interface ZiWeiChartProps {
  chart: ZiWeiChartType;
  className?: string;
}

interface PalaceInfo {
  name: string;
  englishName: string;
  position: { x: number; y: number };
  angle: number;
}

export const ZiWeiChart: React.FC<ZiWeiChartProps> = ({ chart, className = '' }) => {
  const [selectedPalace, setSelectedPalace] = useState<string | null>(null);

  // 12宫位的位置信息（圆形布局）
  const palaces: PalaceInfo[] = [
    { name: '命宫', englishName: 'Life Palace', position: { x: 50, y: 10 }, angle: 0 },
    { name: '父母宫', englishName: 'Parents Palace', position: { x: 75, y: 20 }, angle: 30 },
    { name: '福德宫', englishName: 'Fortune Palace', position: { x: 90, y: 40 }, angle: 60 },
    { name: '田宅宫', englishName: 'Property Palace', position: { x: 90, y: 60 }, angle: 90 },
    { name: '官禄宫', englishName: 'Career Palace', position: { x: 75, y: 80 }, angle: 120 },
    { name: '奴仆宫', englishName: 'Friends Palace', position: { x: 50, y: 90 }, angle: 150 },
    { name: '夫妻宫', englishName: 'Marriage Palace', position: { x: 25, y: 80 }, angle: 180 },
    { name: '子女宫', englishName: 'Children Palace', position: { x: 10, y: 60 }, angle: 210 },
    { name: '财帛宫', englishName: 'Wealth Palace', position: { x: 10, y: 40 }, angle: 240 },
    { name: '疾厄宫', englishName: 'Health Palace', position: { x: 25, y: 20 }, angle: 270 },
    { name: '迁移宫', englishName: 'Travel Palace', position: { x: 50, y: 5 }, angle: 300 },
    { name: '兄弟宫', englishName: 'Siblings Palace', position: { x: 50, y: 95 }, angle: 330 }
  ];

  const getPalaceData = (palaceName: string) => {
    const palaceKey = palaceName.toLowerCase().replace(/\s+/g, '');
    return chart.palaces[palaceKey] || null;
  };

  const getPalaceDescription = (palaceName: string) => {
    switch (palaceName) {
      case 'Life Palace':
        return chart.lifePalace;
      case 'Wealth Palace':
        return chart.wealthPalace;
      case 'Career Palace':
        return chart.careerPalace;
      case 'Marriage Palace':
        return chart.marriagePalace;
      default:
        return 'Analysis not available';
    }
  };

  const getElementColor = (element: string) => {
    const colors = {
      '金': 'bg-yellow-200 border-yellow-400',
      '木': 'bg-green-200 border-green-400',
      '水': 'bg-blue-200 border-blue-400',
      '火': 'bg-red-200 border-red-400',
      '土': 'bg-orange-200 border-orange-400'
    };
    return colors[element as keyof typeof colors] || 'bg-gray-200 border-gray-400';
  };

  return (
    <div className={`ziwei-chart-container ${className}`}>
      {/* 命盘标题 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">ZiWei DouShu Chart</h3>
        <p className="text-gray-600 text-sm">Interactive ZiWei DouShu Chart</p>
      </div>

      {/* 命盘主体 */}
      <div className="relative w-full max-w-2xl mx-auto">
        {/* 外圆 */}
        <div className="relative w-full aspect-square border-4 border-red-300 rounded-full bg-gradient-to-br from-red-50 to-red-100">
          
          {/* 12宫位 */}
          {palaces.map((palace, index) => {
            const palaceData = getPalaceData(palace.englishName);
            const isSelected = selectedPalace === palace.englishName;
            
            return (
              <div
                key={index}
                className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 ${
                  isSelected ? 'z-10' : 'z-0'
                }`}
                style={{
                  left: `${palace.position.x}%`,
                  top: `${palace.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedPalace(isSelected ? null : palace.englishName)}
              >
                {/* 宫位卡片 */}
                <div className={`
                  w-20 h-20 rounded-lg border-2 p-2 text-center shadow-lg
                  ${palaceData ? getElementColor(palaceData.element) : 'bg-gray-200 border-gray-400'}
                  ${isSelected ? 'ring-4 ring-red-300 ring-opacity-50' : ''}
                  hover:shadow-xl
                `}>
                  {/* 宫位名称 */}
                  <div className="text-xs font-bold text-gray-800 mb-1">
                    {palace.name}
                  </div>
                  
                  {/* 主星 */}
                  {palaceData && palaceData.mainStars.length > 0 && (
                    <div className="text-xs text-gray-700 mb-1">
                      {palaceData.mainStars[0]}
                    </div>
                  )}
                  
                  {/* 五行属性 */}
                  {palaceData && (
                    <div className="text-xs text-gray-600">
                      {palaceData.element}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 中心圆 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-200 border-2 border-red-400 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold text-red-800">命盘</div>
              <div className="text-xs text-red-600">ZiWei</div>
            </div>
          </div>
        </div>
      </div>

      {/* 宫位详情 */}
      {selectedPalace && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h4 className="text-lg font-bold text-gray-900 mb-3">
            {palaces.find(p => p.englishName === selectedPalace)?.name} - {selectedPalace}
          </h4>
          
          <div className="space-y-3">
            {/* 宫位描述 */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-1">Description</h5>
              <p className="text-gray-600 text-sm">
                {getPalaceDescription(selectedPalace)}
              </p>
            </div>

            {/* 星曜信息 */}
            {getPalaceData(selectedPalace) && (
              <>
                <div>
                  <h5 className="font-semibold text-gray-700 mb-1">Main Stars</h5>
                  <div className="flex flex-wrap gap-1">
                    {getPalaceData(selectedPalace)?.mainStars.map((star, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        {star}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-700 mb-1">Minor Stars</h5>
                  <div className="flex flex-wrap gap-1">
                    {getPalaceData(selectedPalace)?.minorStars.map((star, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {star}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-700 mb-1">Element</h5>
                  <span className={`px-2 py-1 text-xs rounded ${getElementColor(getPalaceData(selectedPalace)?.element || '')}`}>
                    {getPalaceData(selectedPalace)?.element}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={() => setSelectedPalace(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Close Details
          </button>
        </div>
      )}

      {/* 图例 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
          <span>金 (Metal)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
          <span>木 (Wood)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
          <span>水 (Water)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
          <span>火 (Fire)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-200 border border-orange-400 rounded"></div>
          <span>土 (Earth)</span>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-1">How to Use</h5>
        <p className="text-blue-800 text-xs">
          Click on any palace to view detailed information about stars, elements, and meanings. 
          The chart shows the traditional 12 palaces of ZiWei DouShu with their corresponding stars and elements.
        </p>
      </div>
    </div>
  );
};
