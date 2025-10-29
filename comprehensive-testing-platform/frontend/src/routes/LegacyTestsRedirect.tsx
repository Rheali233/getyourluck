/**
 * LegacyTestsRedirect
 * 处理旧路径的重定向
 * - 对于 /tests/* 的未知路径，重定向到测试中心
 * - 对于 /astrology/*, /tarot/*, /numerology/* 等旧路径，去掉前缀重定向到 /tests/* 路径
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const LegacyTestsRedirect: React.FC = () => {
  const location = useLocation();
  const from = location.pathname; // e.g. /tests/unknown or /astrology/fortune

  // 如果是以 /astrology/, /tarot/, /numerology/ 开头的旧路径，重定向到 /tests/* 路径
  if (from.startsWith('/astrology/')) {
    const target = from.replace(/^\/astrology/, '/tests/astrology');
    return <Navigate to={target} replace />;
  }
  if (from.startsWith('/tarot/')) {
    const target = from.replace(/^\/tarot/, '/tests/tarot');
    return <Navigate to={target} replace />;
  }
  if (from.startsWith('/numerology/')) {
    const target = from.replace(/^\/numerology/, '/tests/numerology');
    return <Navigate to={target} replace />;
  }

  // 对于其他未匹配的 /tests/* 路径，重定向到测试中心
  return <Navigate to="/tests" replace />;
};

export default LegacyTestsRedirect;


