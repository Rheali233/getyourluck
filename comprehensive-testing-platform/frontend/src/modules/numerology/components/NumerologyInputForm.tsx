/**
 * Numerology Input Form Component
 * 命理分析输入表单组件
 */

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { DateInput, TimeInput } from '@/components/ui';
import type { NumerologyBasicInfo, NumerologyAnalysisType } from '../types';

interface NumerologyInputFormProps {
  analysisType: NumerologyAnalysisType;
  onSubmit: (data: NumerologyBasicInfo) => void;
  isLoading?: boolean;
  className?: string;
}

export const NumerologyInputForm: React.FC<NumerologyInputFormProps> = ({
  analysisType,
  onSubmit,
  isLoading = false,
  className
}) => {
  const [formData, setFormData] = useState<NumerologyBasicInfo>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    gender: 'male',
    calendarType: 'solar'
  });

  const [errors, setErrors] = useState<Partial<NumerologyBasicInfo>>({});

  const handleInputChange = (field: keyof NumerologyBasicInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<NumerologyBasicInfo> = {};

    // 验证姓名
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // 验证出生日期
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const birthDate = new Date(formData.birthDate);
      const now = new Date();
      if (birthDate > now) {
        newErrors.birthDate = 'Birth date cannot be in the future';
      }
    }

    // 验证出生时间
    if (formData.birthTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.birthTime)) {
        newErrors.birthTime = 'Invalid time format (HH:MM)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getAnalysisTypeTitle = () => {
    switch (analysisType) {
      case 'bazi':
        return 'BaZi Analysis';
      case 'zodiac':
        return 'Chinese Zodiac Fortune';
      case 'name':
        return 'Name Analysis';
      case 'ziwei':
        return 'ZiWei Analysis';
      default:
        return 'Numerology Analysis';
    }
  };


  return (
    <Card className={`p-8 ${className}`}>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 姓名输入 */}
        <div>
          <label htmlFor="fullName" className="block text-red-900 font-medium mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-white border ${
              errors.fullName ? 'border-red-400' : 'border-red-200'
            } text-red-900 placeholder-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* 出生日期输入 */}
        <div>
          <label htmlFor="birthDate" className="block text-red-900 font-medium mb-2">
            Birth Date *
          </label>
          <DateInput
            value={formData.birthDate}
            onChange={(value) => handleInputChange('birthDate', value)}
            className="w-full"
            required
          />
          {errors.birthDate && (
            <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>

        {/* 出生时间输入 */}
        <div>
          <label htmlFor="birthTime" className="block text-red-900 font-medium mb-2">
            Birth Time (Optional)
          </label>
          <TimeInput
            value={formData.birthTime || ''}
            onChange={(value) => handleInputChange('birthTime', value)}
            className="w-full"
          />
          {errors.birthTime && (
            <p className="text-red-600 text-sm mt-1">{errors.birthTime}</p>
          )}
        </div>

        {/* 性别选择 */}
        <div>
          <label className="block text-red-900 font-medium mb-2">
            Gender *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={(e) => handleInputChange('gender', e.target.value || '')}
                className="mr-2 text-red-400 focus:ring-red-400"
                disabled={isLoading}
              />
              <span className="text-red-800">Male</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={(e) => handleInputChange('gender', e.target.value || '')}
                className="mr-2 text-red-400 focus:ring-red-400"
                disabled={isLoading}
              />
              <span className="text-red-800">Female</span>
            </label>
          </div>
        </div>

        {/* 历法类型选择 */}
        <div>
          <label className="block text-red-900 font-medium mb-2">
            Calendar Type *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="calendarType"
                value="solar"
                checked={formData.calendarType === 'solar'}
                onChange={(e) => handleInputChange('calendarType', e.target.value || '')}
                className="mr-2 text-red-400 focus:ring-red-400"
                disabled={isLoading}
              />
              <span className="text-red-800">Solar Calendar</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="calendarType"
                value="lunar"
                checked={formData.calendarType === 'lunar'}
                onChange={(e) => handleInputChange('calendarType', e.target.value || '')}
                className="mr-2 text-red-400 focus:ring-red-400"
                disabled={isLoading}
              />
              <span className="text-red-800">Lunar Calendar</span>
            </label>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="text-center pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : `Start ${getAnalysisTypeTitle()}`}
          </Button>
        </div>
      </form>
    </Card>
  );
};
