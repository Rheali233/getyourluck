/**
 * PHQ-9 Symptom Filter Component
 * Allows users to filter symptoms by severity level
 */

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

interface Symptom {
  name: string;
  score: number;
  description: string;
}

interface PHQ9SymptomFilterProps extends BaseComponentProps {
  symptoms: Symptom[];
  onFilterChange: (filteredSymptoms: Symptom[]) => void;
}

export const PHQ9SymptomFilter: React.FC<PHQ9SymptomFilterProps> = ({
  className,
  testId = 'phq9-symptom-filter',
  symptoms,
  onFilterChange,
  ...props
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(true);

  // Severity level options
  const severityOptions = [
    { value: null, label: 'All Symptoms', count: symptoms.length, color: 'bg-gray-100 text-gray-800' },
    { value: 0, label: 'No Symptoms', count: symptoms.filter(s => s.score === 0).length, color: 'bg-green-100 text-green-800' },
    { value: 1, label: 'Mild Symptoms', count: symptoms.filter(s => s.score === 1).length, color: 'bg-yellow-100 text-yellow-800' },
    { value: 2, label: 'Moderate Symptoms', count: symptoms.filter(s => s.score === 2).length, color: 'bg-orange-100 text-orange-800' },
    { value: 3, label: 'Severe Symptoms', count: symptoms.filter(s => s.score === 3).length, color: 'bg-red-100 text-red-800' }
  ];

  // Handle filter
  const handleFilter = (severity: number | null) => {
    setSelectedSeverity(severity);
    setShowAll(severity === null);
    
    if (severity === null) {
      onFilterChange(symptoms);
    } else {
      const filtered = symptoms.filter(symptom => symptom.score === severity);
      onFilterChange(filtered);
    }
  };

  // Reset filter
  const handleReset = () => {
    setSelectedSeverity(null);
    setShowAll(true);
    onFilterChange(symptoms);
  };

  return (
    <Card className={cn("p-4 bg-white", className)} data-testid={testId} {...props}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Symptom Filter</h4>
          <p className="text-xs text-gray-500">Filter symptoms by severity level</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {severityOptions.map((option) => (
            <button
              key={option.value === null ? 'all' : option.value}
              onClick={() => handleFilter(option.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                selectedSeverity === option.value
                  ? `${option.color} ring-2 ring-blue-500`
                  : option.color
              )}
            >
              {option.label} ({option.count})
            </button>
          ))}
          
          {!showAll && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="small"
              className="text-xs"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
