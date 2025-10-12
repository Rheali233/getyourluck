# UI 视觉统一改造计划（对齐 ui.md）

作者：AI 助手
范围：仅前端视觉改造（布局/样式）。不改业务逻辑、数据流、路由与 API。
基线：严格遵循 `.kiro/specs/comprehensive-testing-platform/ui.md` 的配色、布局、间距与组件使用规范。

## 1）总体目标

- 统一基线：卡片、边框、圆角、阴影、间距、排版、焦点态与可访问性。
- 模块“气质层”：仅通过 ui.md 定义的模块主题色体现差异，禁止随意配色。
- 降低大面积渐变/深色背景的使用，除非 ui.md 明确允许（如 Tarot 特殊页面）。
- 规范“指南/提示”版块为“单卡片 + 内部栅格”的展示方式。

## 2）共享基线（所有模块通用）

- 卡片颜色（统一规范）：
  - 基础卡片：`bg-white`（默认），或 `bg-white/80`（玻璃态）
  - 模块边框色：严格使用 ui.md 的 `*-200`（如 Psychology = `border-blue-200`）
  - 文字颜色：标题 `text-gray-900`，正文 `text-gray-700`，辅助说明 `text-gray-600`
  - 统一形态：`rounded-lg shadow-sm`
  - 禁止整卡使用模块主色做背景（Tarot 深色特例按 ui.md §5.3）
- 字体：按 ui.md 的 H1/H2/H3，正文 `text-base`，辅助 `text-sm`。
- 间距：容器/区块遵循 ui.md（`mb-8`、`gap-6`、`py-8`、`px-4`）。
- 按钮：使用现有 `Button`；主按钮=模块渐变；次要/幽灵=白底+模块边框。
- 可访问性：对比度、焦点可见、分区 `aria-labelledby`。
- 指南/说明：单卡片 + 3/4 列栅格。
- 重要提示：单卡片，图标 + 文本。

## 3）模块配色映射（严格按 ui.md）

 - Psychology：蓝/靛。页面 `bg-blue-50`；卡片边框 `blue-200`；必要处正文可用 `blue-800`。
 - Career：翡翠/蓝绿。页面 `bg-green-50`；边框 `emerald-200`。
 - Relationship：粉/玫。页面 `bg-pink-50`；边框 `pink-200`。
 - Learning：青/天蓝。页面 `bg-sky-50`；边框 `sky-300`。
 - Astrology：琥珀/棕。页面 `bg-amber-100`；边框 `amber-200`；标题 `amber-900`。
 - Tarot：紫/靛（浅色方案为主，核心互动可加深）。页面 `bg-violet-50`；边框 `violet-300`；标题 `violet-900`。
 - Numerology：红/橙。页面 `bg-red-50`；边框 `red-200`。

## 4）各模块变更清单

说明：“修改”指 Tailwind 类名层面的样式调整；“保留”指不改变逻辑/流程。

### 4.1 Psychology（心理）

文件：
- `frontend/src/modules/psychology/components/PsychologyHomePage.tsx`

修改：
- 页面背景保持 `bg-blue-50`。
- 标题/描述使用 `text-gray-900/700`（已符合）。
- “精选测试”卡片保持白底 `border-gray-100`；保留理论/统计徽章；按钮渐变 `from-blue-500 to-indigo-500`。
- 移除“Resume Your Progress”分区（组件保留，首页不展示）。
- “Test Guide”使用“单卡片 + 三列”结构（已是单卡片）；图标背景用蓝/绿/紫淡色。
- “Important Notice”采用淡黄色信息卡。

验收：
- 不出现 ui.md 之外的颜色；强调仅用蓝/靛。

### 4.2 Tarot（塔罗）

文件：
- `frontend/src/modules/tarot/components/TarotHomePage.tsx`
- `frontend/src/modules/tarot/components/RecommendationPage.tsx`
- `frontend/src/modules/tarot/components/CardDrawingPage.tsx`

修改：
- 常规页面（首页/推荐/抽牌）采用浅色方案：页面 `bg-amber-100`；卡片白底（将整卡 `yellow-500/10` 替换为白底基线）；边框 `border-amber-200`；标题 `text-amber-900/800`。
- 主按钮渐变 `from-amber-800 to-amber-600`。
- “Ask Your Own Question”使用单卡片，输入白底 + 琥珀边框，按钮主色。
- 分类栅格：白底卡 + 琥珀徽章；底部 CTA 保留。
- “Reading Instructions”改为单卡片 + 三列。
- “Important Notice”单卡片（浅琥珀背景）。
- 深色沉浸页（如需要）仅在 ui.md §5.3 允许的场景启用，首页不使用。

验收：
- 不使用整卡深色/大面积黄色透明块。

### 4.3 Astrology（占星）

文件：
- `frontend/src/modules/astrology/components/AstrologyHomePage.tsx`

修改：
- 页面 `bg-violet-50`；卡片边框 `border-violet-300`；特性标签 `violet-50/violet-700`。
- 主按钮渐变 `from-violet-600 to-indigo-500`。
- “How It Works”单卡片 + 三列。
- “Important Notice”淡紫信息卡。

### 4.4 Career（职业）

文件：
- `frontend/src/modules/career/components/CareerHomePage.tsx`

修改：
- 页面 `bg-green-50`；卡片边框从 `border-gray-100` 调整为 `border-emerald-200` 以强化模块感。
- 主按钮渐变改为 `from-emerald-500 to-teal-500`。
- 指南单卡片 + 三列。
- 重要提示允许使用淡黄色信息卡。

### 4.5 Relationship（关系）

文件：
- `frontend/src/modules/relationship/components/*`（首页/入口）

修改：
- 页面 `bg-pink-50`；卡片边框 `pink-200`。
- 主按钮渐变 `from-pink-500 to-rose-500`。
- 将多卡片指南统一为“单卡片 + 3/4 列”。

### 4.6 Learning Ability（学习能力）

文件：
- `frontend/src/modules/learning-ability/components/LearningAbilityHomePage.tsx`

修改：
- 页面 `bg-sky-50`；边框强调 `sky-300`。
- 主按钮渐变 `from-cyan-600 to-sky-500`。
- 指南/提示统一单卡片结构。

### 4.7 Numerology（传统命理）

文件：
- `frontend/src/modules/numerology/components/NumerologyHomePage.tsx`
- `frontend/src/modules/numerology/components/NumerologyResultDisplay.tsx`（已部分重构）

修改：
- 首页 `bg-red-50`，边框 `red-200`。
- 结果页保持“信息看板”风格：白底卡为主，红色作为徽章/标签点缀；避免整卡深红背景。
- 分区采用“单卡片包裹”，标题 `text-gray-900`，正文 `text-gray-700`。

### 4.8 Homepage（全站入口）

文件：
- `frontend/src/modules/homepage/components/*`

修改：
- 模块入口卡仅用各自主题色做小面积强调（按钮/徽章/图标背景），卡片仍用白底基线。

## 11）模块“所有界面”统一范围（新增）

- 不仅首页：同模块的功能页、选择页、结果页均按本计划统一。
- 执行路径：
  - Tarot：`TarotHomePage.tsx`、`RecommendationPage.tsx`、`CardDrawingPage.tsx`、`ReadingResultPage.tsx`
  - Psychology：`PsychologyHomePage.tsx`、`GenericTestPage.tsx`
  - Astrology：`AstrologyHomePage.tsx`、`FortuneTestPage.tsx`、`CompatibilityTestPage.tsx`、`BirthChartTestPage.tsx`
  - Career：`CareerHomePage.tsx`、`CareerTestPage.tsx`
  - Relationship：模块首页与各测试入口/结果页
  - Learning：`LearningAbilityHomePage.tsx`、`VARKTestPage.tsx`、`RavenTestPage.tsx`、`CognitiveTestPage.tsx`
  - Numerology：`NumerologyHomePage.tsx`、`NumerologyAnalysisPage.tsx` 及所有结果页

> 每页落地项：背景/边框/卡片底色/文字颜色/按钮渐变/指南单卡片/提示单卡片/容器与间距/可访问性。

## 5）共享组件与 Token 使用

- 通用组件存放：`frontend/src/components/ui/`
- 现有：`Button.tsx`、`Card.tsx`、`TestNavigation.tsx`、`LoadingSpinner.tsx`、`Alert.tsx` 等
- 页面引用：
  ```tsx
  import { Button, Card, TestNavigation } from '@/components/ui'
  ```
- 统一用法建议（不改导出，仅约定）：
  - Card 语义：`surface`（默认白底）、`contrast`（白/80 玻璃态）、`info`（浅色信息块，按模块色）
  - Button 语义：`primary`（模块渐变）、`secondary`（中性）、`ghost`（白底边框）
- 公用徽章/标签：浅底 + 深色文字（例如心理：`bg-blue-50 text-blue-700 border-blue-200`）。
- 若需局部样式辅助，优先 Tailwind 原子类；避免新建设计系统。

## 6）执行顺序

1. Tarot（差异最大）：Home、Recommendation、Drawing 三页。
2. Psychology：确认基线并微调；移除 Resume 分区展示。
3. Astrology：统一边框/按钮；确认指南单卡片。
4. Career：CTA 渐变改为 emerald/teal；边框改为 emerald-200。
5. Numerology：结果/首页卡片白底；红色仅作点缀。
6. Relationship & Learning：统一背景、边框、按钮渐变。
7. Homepage：检查模块磁贴仅用强调色。

## 7）页面验收清单

- 页面背景等于 ui.md 所定义模块背景色。
- 卡片统一白底/白底80 + 模块边框色；圆角/阴影统一。
- 主按钮使用 ui.md 定义的模块渐变。
- 指南/说明以“单卡片 + 3/4 列栅格”呈现。
- 重要提示以“单卡片信息块”呈现。
- 不出现随意颜色；除 Tarot 特例外，禁止大面积模块色铺底。

### 7.1）页面布局统一（新增）

- 页面容器：`max-w-6xl mx-auto py-8 px-4`（或 ui.md 指定的 `max-w-7xl`）
- 顶部导航：统一 `TestNavigation`（需要返回/面包屑时）
- 标题区：`text-center mb-12`，H1 + 描述（`text-gray-700`）
- 主功能区：采用“栅格卡片 + CTA”
- 指南区：单卡片 + 3/4 列
- 提示区：底部单卡片信息块

> 仅替换类名/结构，不改业务逻辑与数据流。

## 8）风险与规避

- Tailwind 类名漂移：每页改动后进行快速视觉回归。
- 对比度回退：关键文本做 a11y 颜色核查。
- 组件复用一致性：统一 `Button`/`Card` 导入，避免重复样式。

## 9）交付物

- 各模块页面的样式 edits。
- 本计划文档：`docs/ui-refactor-plan.md`。
- （可选）Tarot/Psychology 首页前后对比截图供评审。

## 10）时间安排（预估）

- 第 1 天：Tarot（3 页）+ Psychology 微调。
- 第 2 天：Astrology + Career。
- 第 3 天：Numerology + Relationship + Learning + Homepage 汇总。


