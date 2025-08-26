/**
 * Love Language Radar Chart Component
 * Displays five love language dimensions in a radar chart
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { LoveLanguageScores } from '../../services/answerProcessing';

export interface LoveLanguageChartProps extends BaseComponentProps {
  scores: LoveLanguageScores;
  primaryType?: string;
  secondaryType?: string;
}

export const LoveLanguageChart: React.FC<LoveLanguageChartProps> = ({
  className,
  testId = 'love-language-chart',
  scores,
  primaryType,
  secondaryType,
  ...props
}) => {
  // Convert scores to chart data
  const chartData = [
    { dimension: 'Words of Affirmation', score: scores.words_of_affirmation, color: '#FF6B6B' },
    { dimension: 'Quality Time', score: scores.quality_time, color: '#4ECDC4' },
    { dimension: 'Receiving Gifts', score: scores.receiving_gifts, color: '#45B7D1' },
    { dimension: 'Acts of Service', score: scores.acts_of_service, color: '#96CEB4' },
    { dimension: 'Physical Touch', score: scores.physical_touch, color: '#FFEAA7' }
  ];

  const maxScore = 5;
  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  // Generate radar chart points
  const generatePoints = () => {
    return chartData.map((item, index) => {
      const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
      const normalizedScore = item.score / maxScore;
      const x = centerX + radius * normalizedScore * Math.cos(angle);
      const y = centerY + radius * normalizedScore * Math.sin(angle);
      return { x, y, ...item };
    });
  };

  const points = generatePoints();

  // Generate radar grid lines
  const generateGridLines = () => {
    const lines = [];
    for (let i = 1; i <= 5; i++) {
      const normalizedRadius = (radius * i) / 5;
      const points = chartData.map((_, index) => {
        const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
        const x = centerX + normalizedRadius * Math.cos(angle);
        const y = centerY + normalizedRadius * Math.sin(angle);
        return { x, y };
      });
      lines.push(points);
    }
    return lines;
  };

  const gridLines = generateGridLines();

  return (
    <div
      className={`p-4 ${className}`}
      data-testid={testId}
      {...props}
    >
      <div className="flex justify-center mb-4">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Grid lines */}
          {gridLines.map((line, index) => (
            <polygon
              key={index}
              points={line.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Dimension labels */}
          {chartData.map((item, index) => {
            const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
            const labelRadius = radius + 20;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium text-gray-600"
              >
                {item.dimension}
              </text>
            );
          })}
          
          {/* Score line */}
          <polygon
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="rgba(236, 72, 153, 0.2)"
            stroke="#EC4899"
            strokeWidth="2"
          />
          
          {/* Score points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={point.color}
              stroke="#EC4899"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

            {/* Score breakdown */}
      <div className="space-y-2 mt-3 w-fit mx-auto">
        {chartData.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-xs text-gray-600 text-left">{item.dimension}</span>
            <span className="text-xs text-gray-500 text-left">{item.score.toFixed(1)}/5</span>
          </div>
        ))}
      </div>


    </div>
  );
};
