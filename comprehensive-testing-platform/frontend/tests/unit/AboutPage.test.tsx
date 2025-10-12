/**
 * AboutPage 基础渲染测试
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { AboutPage } from '@/pages/AboutPage/AboutPage';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';

describe('AboutPage', () => {
  it('renders title and sections', () => {
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );

    expect(screen.getByText(UI_TEXT.about.title)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.about.sections.overview.title)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.about.sections.capabilities.title)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.about.sections.quality.title)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.about.sections.modules.title)).toBeInTheDocument();
  });
});


