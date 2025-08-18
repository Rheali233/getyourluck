/**
 * 组件展示页面
 * 用于展示和测试所有UI组件
 */

import React, { useState } from 'react';
import { Button, Card, Input, Select, Alert, Modal } from '@/components/ui';
import type { ButtonProps } from '@/types/componentTypes';

/**
 * 组件展示页面
 * 展示所有UI组件的使用示例和变体
 */
export const ComponentShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { inputValue, selectValue });
  };

  const buttonVariants: NonNullable<ButtonProps['variant']>[] = ['primary', 'secondary', 'outline', 'ghost'];
  const buttonSizes: NonNullable<ButtonProps['size']>[] = ['small', 'medium', 'large'];

  const selectOptions = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">组件库展示</h1>
          <p className="text-lg text-gray-600">展示所有可用的UI组件及其变体</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 按钮组件 */}
          <Card title="按钮组件" description="不同样式和大小的按钮">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">变体</h4>
                <div className="flex flex-wrap gap-2">
                  {buttonVariants.map((variant) => (
                    <Button key={variant} variant={variant}>
                      {variant}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">尺寸</h4>
                <div className="flex flex-wrap gap-2">
                  {buttonSizes.map((size) => (
                    <Button key={size} size={size}>
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">状态</h4>
                <div className="flex flex-wrap gap-2">
                  <Button disabled>禁用</Button>
                  <Button loading>加载中</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* 表单组件 */}
          <Card title="表单组件" description="输入框、选择框和表单">
            <div className="space-y-4">
              <Input
                label="文本输入"
                placeholder="请输入文本"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
              
              <Select
                label="选择框"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={selectOptions}
                required
              />
              
              <div className="flex gap-2">
                <Button onClick={handleFormSubmit}>提交</Button>
                <Button variant="outline" onClick={() => setInputValue('')}>
                  重置
                </Button>
              </div>
            </div>
          </Card>

          {/* 加载和警告组件 */}
          <Card title="状态组件" description="加载和警告提示">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">警告提示</h4>
                <div className="space-y-2">
                  <Alert
                    variant="success"
                    title="成功"
                    message="操作已成功完成"
                    onClose={() => {}}
                  />
                  <Alert
                    variant="warning"
                    title="警告"
                    message="请注意这个警告信息"
                    onClose={() => {}}
                  />
                  <Alert
                    variant="error"
                    title="错误"
                    message="发生了一个错误"
                    onClose={() => {}}
                  />
                  <Alert
                    variant="info"
                    title="信息"
                    message="这是一条信息提示"
                    onClose={() => {}}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 模态框组件 */}
          <Card title="模态框组件" description="弹窗和对话框">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={() => setIsModalOpen(true)}>
                  打开模态框
                </Button>
              </div>
              
              <p className="text-sm text-gray-600">
                点击按钮打开模态框，支持ESC键关闭和遮罩层点击关闭。
              </p>
            </div>
          </Card>
        </div>

        {/* 模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="示例模态框"
          size="medium"
        >
          <div className="space-y-4">
            <p>这是一个模态框示例，展示了模态框组件的基本功能。</p>
            <p>支持多种尺寸、标题和关闭方式。</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                确认
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}; 