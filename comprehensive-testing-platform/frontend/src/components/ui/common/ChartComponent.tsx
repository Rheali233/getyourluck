/**
 * 通用图表组件
 * 适用于所有测试类型的数据可视化
 * 
 * @example
 * // 心理学测试使用
 * <ChartComponent 
 *   data={mbtiScores} 
 *   type="radar" 
 *   theme="psychology" 
 * />
 * 
 * // 职业测试使用
 * <ChartComponent 
 *   data={hollandScores} 
 *   type="bar" 
 *   theme="career" 
 * />
 * 
 * @param data - 图表数据
 * @param type - 图表类型
 * @param theme - 主题配置
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface ChartData {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export interface ChartComponentProps extends BaseComponentProps {
  data: ChartData[];
  type: 'bar' | 'radar' | 'pie' | 'line';
  theme?: string;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showValues?: boolean;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  type,
  theme = 'psychology',
  title,
  height = 300,
  showLegend = true,
  showValues = true,
  className,
  testId = 'chart-component',
  ...props
}) => {

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.maxValue || d.value));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.maxValue || item.value) / maxValue) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                {showValues && (
                  <span className="text-sm text-gray-600">
                    {item.value}/{item.maxValue || maxValue}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={cn(
                    "h-3 rounded-full transition-all duration-500 ease-out",
                    item.color || "bg-blue-500"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRadarChart = () => {
    const maxValue = Math.max(...data.map(d => d.maxValue || d.value));
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    
    // 生成雷达图的多边形点
    const points = data.map((item, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
      const value = (item.value / (item.maxValue || maxValue)) * radius;
      const x = centerX + value * Math.cos(angle);
      const y = centerY + value * Math.sin(angle);
      return { x, y, label: item.label, value: item.value };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <div className="flex flex-col items-center">
        <svg width="300" height="300" className="mb-4">
          {/* 背景网格 */}
          {[20, 40, 60, 80, 100].map((r) => (
            <circle
              key={r}
              cx={centerX}
              cy={centerY}
              r={r}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* 轴线 */}
          {points.map((_, index) => {
            const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#d1d5db"
                strokeWidth="1"
              />
            );
          })}
          
          {/* 数据多边形 */}
          <polygon
            points={polygonPoints}
            fill="#3b82f620"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* 数据点 */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
            />
          ))}
        </svg>
        
        {/* 图例 */}
        {showLegend && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {points.map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-700">{point.label}: {point.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" className="mb-4">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 2 * Math.PI;
            const x1 = 100 + 80 * Math.cos(currentAngle);
            const y1 = 100 + 80 * Math.sin(currentAngle);
            const x2 = 100 + 80 * Math.cos(currentAngle + angle);
            const y2 = 100 + 80 * Math.sin(currentAngle + angle);
            
            const largeArcFlag = angle > Math.PI ? 1 : 0;
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* 图例 */}
        {showLegend && (
          <div className="space-y-2 text-sm">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color || `hsl(${(index * 360) / data.length}, 70%, 60%)` }}
                />
                <span className="text-gray-700">
                  {item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.maxValue || d.value));
    const width = 400;
    const height = 200;
    const padding = 40;
    
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const points = data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = height - padding - (item.value / maxValue) * chartHeight;
      return { x, y, label: item.label, value: item.value };
    });
    
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
    
    return (
      <div className="flex flex-col items-center">
        <svg width={width} height={height} className="mb-4">
          {/* 背景网格 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={height - padding - ratio * chartHeight}
              x2={width - padding}
              y2={height - padding - ratio * chartHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* 数据线 */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          
          {/* 数据点 */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
            />
          ))}
        </svg>
        
        {/* X轴标签 */}
        <div className="flex justify-between w-full text-xs text-gray-600">
          {data.map((item, index) => (
            <span key={index} className="text-center">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'radar':
        return renderRadarChart();
      case 'pie':
        return renderPieChart();
      case 'line':
        return renderLineChart();
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md p-6",
        className
      )}
      style={{ minHeight: height }}
      data-testid={testId}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {title}
        </h3>
      )}
      
      <div className="flex justify-center">
        {renderChart()}
      </div>
    </div>
  );
};
