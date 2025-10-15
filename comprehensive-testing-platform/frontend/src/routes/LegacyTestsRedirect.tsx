/**
 * LegacyTestsRedirect
 * 将旧路径 /tests/... 重定向到新的模块路径，例如：
 * /tests/psychology -> /psychology
 * /tests/psychology/mbti -> /psychology/mbti
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const LegacyTestsRedirect: React.FC = () => {
  const location = useLocation();
  const from = location.pathname; // e.g. /tests/psychology/mbti

  // 去掉 /tests 前缀，确保以 / 开头
  const target = from.replace(/^\/tests(\/|$)/, '/');

  return <Navigate to={target} replace />;
};

export default LegacyTestsRedirect;


