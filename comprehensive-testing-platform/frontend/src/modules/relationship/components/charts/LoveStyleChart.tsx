/**
 * Love Style Radar Chart Component
 * Displays six love style dimensions in a radar chart
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { LoveStyleScores } from '../../services/answerProcessing';

export interface LoveStyleChartProps extends BaseComponentProps {
  scores: LoveStyleScores;
  dominantStyle?: string;
  secondaryStyle?: string;
}

export const LoveStyleChart: React.FC<LoveStyleChartProps> = ({
  className,
  testId = 'love-style-chart',
  scores,
  dominantStyle,
  secondaryStyle,
  ...props
}) => {
  // Convert scores to chart data
  const chartData = [
    { dimension: 'Eros (Passionate)', score: scores.eros, color: '#FF6B6B', description: 'Romantic, intense love' },
    { dimension: 'Ludus (Playful)', score: scores.ludus, color: '#4ECDC4', description: 'Fun, game-like love' },
    { dimension: 'Storge (Friendship)', score: scores.storge, color: '#45B7D1', description: 'Steady, friendship-based' },
    { dimension: 'Mania (Possessive)', score: scores.mania, color: '#96CEB4', description: 'Intense, sometimes obsessive' },
    { dimension: 'Pragma (Practical)', score: scores.pragma, color: '#FFEAA7', description: 'Practical, goal-oriented' },
    { dimension: 'Agape (Altruistic)', score: scores.agape, color: '#DDA0DD', description: 'Selfless, unconditional' }
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
        const y = centerY + normalizedRadius * Math.cos(angle);
        return { x, y };
      });
      lines.push(points);
    }
    return lines;
  };

  const gridLines = generateGridLines();

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-lg ${className}`}
      data-testid={testId}
      {...props}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Your Love Style Profile
      </h3>
      
      <div className="flex justify-center mb-6">
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
            const labelRadius = radius + 25;
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
                {item.dimension.split(' ')[0]}
              </text>
            );
          })}
          
          {/* Score line */}
          <polygon
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="rgba(147, 51, 234, 0.2)"
            stroke="#9333EA"
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
              stroke="#9333EA"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div 
              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">
                {item.dimension}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                {item.description}
              </div>
              <div className="text-xs text-gray-600">
                Score: {item.score.toFixed(1)}/5
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dominant and secondary styles */}
      {(dominantStyle || secondaryStyle) && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Your Love Style Types:</h4>
          {dominantStyle && (
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Dominant:</span> {dominantStyle.replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          )}
          {secondaryStyle && (
            <div className="text-sm text-gray-700">
              <span className="font-medium">Secondary:</span> {secondaryStyle.replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
