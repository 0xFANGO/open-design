# Labnana

> Category: AI & LLM
> AI 图片生成平台。暗黑宇宙底色，金黄主交互，品牌光谱和 AI 能力彩色光斑。

## 1. Visual Theme & Atmosphere

Labnana 是一个 AI 图片生成平台（支持 Google Nano Banana、Gemini Flash、GPT-Image-2）。用户进入后看到的第一印象是**极暗的宇宙底色上，金黄色交互控件和多彩 AI 能力光斑同时闪烁**。生成按钮、选中状态、focus ring、收藏星星、导航高亮全部是温暖的金黄色；Logo、Hero 能力 badge、Premium 卡片、活动/奖励状态则用受控的彩色光谱补足产品的 AI 感和趣味性。

底色是接近纯黑的 `#020617`（slate-950），不是冷灰也不是纯黑，而是带一丝蓝调的深空黑。在这个深色画布上，多层径向渐变模拟宇宙星云（紫色顶部光晕、暖色底部辉光），配合 Canvas 粒子星空和边缘暗角，构成"在宇宙中创作"的沉浸氛围。

主交互色使用 OKLCH 色域中 hue 86 的**温暖金黄**（约等于深金色），它不是明亮刺眼的黄色，而是沉稳富贵的暗金色调。这个颜色出现在所有关键交互点上：按钮、链接、radio 选中、slider、switch、ring focus、拖拽高亮、navigation hover cell 动画——构成了"暗底金字"的视觉基调。

卡片和面板使用毛玻璃技术（`backdrop-filter: blur` + `color-mix` 半透明混色），在暗色中营造晶莹通透的层次。图片卡片则使用 `bg-black/70` 纯暗底色，让 AI 生成的图片本身成为视觉焦点。

品牌标识不是单色：真实 Logo 的 "Lab" 是 `cyan-400 → blue-400 → violet-400` 的冷色渐变，"nana" 是 `pink-400`。Premium/Benefit 动画卡片使用 cyan/pink 霓虹循环。Hero 的 8 个能力 badge 使用 amber、lime、cyan、pink、indigo、emerald、rose、slate-sky 等小范围渐变，像漂浮在深空里的 AI 能力标签。这些彩色不是普通交互色，而是品牌、模型能力、会员诱因、活动状态的限定色。

表单中的 `yellow-400` 作为更亮的选中指示器，VIP 标记使用 `amber-500`，收藏心形使用 `fill-yellow-400`。这些都是金黄主调的延伸。

**一句话概括：漆黑的宇宙里，操作是金色的，品牌和 AI 能力是彩色光斑。**

## 2. Color Palette & Roles

### Core Roles

- **Background** (`#020617`)
- **Foreground** (`#f8f8f8`)
- **Heading** (`#ffffff`)
- **Primary** (`#d4a017`)
- **Accent** (`#d4a017`)
- **Muted** (`#9a9ea8`)
- **Border** (`#1E2336`)
- **Surface** (`#1a1b2e`)
- **Card** (`#1a1b2e`)

### 色彩分层原则
- **Gold Interaction Layer**: 所有可点击、可选中、正在生成、focus、active、导航高亮都归金黄体系。
- **Brand Spectrum Layer**: Logo 与 Premium/Benefit 装饰使用 cyan/blue/violet/pink 光谱，不能替代主交互色。
- **Capability Spectrum Layer**: Hero 能力 badge、模型能力提示使用多彩渐变光晕，作为少量“AI 能力光斑”。
- **Functional Status Layer**: 免费额度、奖励、活动、错误、签到弹窗有自己的限定功能色，不外溢到常规控件。

### 主色：金黄 (Primary)
- **Primary Gold** (`#d4a017`): 主交互色 — CTA 按钮底色、链接、focus ring、radio/switch/slider 选中、navigation hover、拖拽高亮、progress bar。OKLCH 原始值 `oklch(0.795 0.184 86.047)`
- **Primary Gold Darker** (`#b8880f`): Light mode 变体。OKLCH `oklch(0.7 0.17 86.047)`
- **Primary Text on Gold** (`#3d2a08`): 金底上的深棕文字。OKLCH `oklch(0.421 0.095 57.708)`

### 金黄家族（功能延伸）
- **Yellow Active** (`#FACC15`): 表单 radio/checkbox 选中边框和文字、收藏星 fill
- **Amber VIP** (`#F59E0B`): VIP/会员图标、Subscribe 按钮
- **Popular Badge** (`#EFB100`): Pro 计划 "Popular" 文字
- **Popular Badge Fill** (`#6F522A`): Popular badge 底色
- **Banner Gold** (`#FBBF24`): 活动 Banner 文字（暗色模式）
- **Banner Brown** (`#78350F`): 活动 Banner 文字（亮色模式）

### 背景与表面
- **Deep Space** (`#020617`): 主画布 — 极深蓝黑
- **Card Surface** (`#1a1b2e`): 卡片面 — 微亮深蓝灰。OKLCH `oklch(0.21 0.006 285.885)`
- **Muted Surface** (`#252738`): 次级面。OKLCH `oklch(0.274 0.006 286.033)`
- **Sidebar Border** (`#1E2336`): 侧栏分割线
- **Dialog Surface** (`#191A21`): 签到弹窗底色

### 文字
- **Text Primary** (`#f8f8f8`): 主文本 — 近白。OKLCH `oklch(0.985 0 0)`
- **Text Secondary** (`#9a9ea8`): 次级文本 — 灰。OKLCH `oklch(0.705 0.015 286.067)`
- **Text Tertiary** (`#999999`): 60% 白

### 品牌光谱（Logo / Premium 专用，不用于日常交互）
- **Logo Lab Gradient**: `cyan-400 (#22D3EE) → blue-400 (#60A5FA) → violet-400 (#A78BFA)`，用于大 Hero Logo 中的 "Lab"。
- **Compact Logo Cyan** (`#00BBD0`): 侧栏和 mobile header 中 "Lab" 的紧凑字色。
- **Logo Nana Pink** (`pink-400 #F472B6` / compact `#FB64B6`): "nana" 字色。
- **Premium Neon Cyan** (`#00BBD0`): Premium/Benefit 旋转边框、粒子、文字渐变。
- **Premium Neon Pink** (`#FB64B6`): Premium/Benefit 旋转边框、粒子、箭头、文字渐变。

### Hero 能力光谱（只用于能力 badge / AI 特性光晕）
| 能力语义 | 渐变 | 用途 |
|----------|------|------|
| 4K / 高规格 | `from-amber-400 to-orange-500` | 4K、高清、规格增强 |
| Nano Banana | `from-yellow-300 to-lime-400` | 模型主卖点、香蕉能力 |
| Detail / Scan | `from-sky-400 to-cyan-300` | 细节、扫描、清晰度 |
| Anime / Magic | `from-pink-400 to-fuchsia-500` | 风格化、动漫、魔法感 |
| UHD / Image | `from-indigo-400 to-blue-500` | 高画质、图像能力 |
| Lossless / Unlimited | `from-emerald-400 to-teal-500` | 免费额度、无损、可用性 |
| Portrait | `from-rose-400 to-orange-400` | 人像、温暖创作 |
| Concept Art | `from-slate-200 to-sky-400` | 概念艺术、冷光材质 |

这些渐变出现在 `rounded-full bg-black/80 border-white/20` 的小胶囊里，外层用同渐变 `opacity-50 blur-md` 光晕。不要把它们扩大成整屏背景。

### 功能状态色（限定场景）
- **Free / Reward Emerald** (`emerald-400`, light `emerald-100/700`, dark `emerald-900/30`): 免费额度 badge、签到免费生成奖励。
- **Campaign Indigo** (`#6366F1`): GPT-Image-2 Free Trial / Free Quota 活动 label。
- **Sale Red** (`#E63F3F`, `#FF224C`): 活动折扣、倒计时数字、错误强调。
- **Festive Warm Gold** (`#FFD28A`, `#FFDFB0`): 新年/春节活动 banner 文字。
- **Check-in Orange** (`#FFA500`): 签到积分奖励数字。

### 边框与 Focus
- **Border Default** (`#1E2336`): 标准边框
- **Focus Ring** (`#8B6914`): 暗金色 focus ring。OKLCH `oklch(0.554 0.135 66.442)`

### 定价卡片分级色
| 档位 | 边框 | 背景渐变 |
|------|------|----------|
| Pro (推荐) | `#C1A37A` (金) | `from-[#241B0E] to-[#45351E]` (深棕金) |
| Standard | `#747FAE` (灰蓝) | `from-[#111527] to-[#333950]` (深蓝灰) |
| Free | `#333333` (灰) | 透明 |

### 签到弹窗装饰色
- 渐变边框: `rgba(27,62,84,1) → rgba(23,150,228,1) → rgba(27,62,84,1)` (蓝色系)
- 光晕: `#0080FF`、`#3E73E2`、`#334C80` (蓝色系装饰 blob)
- 奖励数字: `text-mars-color-orange`（`#FFA500`）+ `text-emerald-400`

### Mars 灰阶 Token（dark mode 值）
| Token | 值 | 对应视觉 |
|-------|-----|----------|
| basic-black (→text) | `#ffffff` | 最强文本 |
| bk01 | `#fbfbfb` | 标题文本 |
| bk02 | `#cccccc` | 次级文本 |
| bk03 | `#9a9a9a` | 三级文本 |
| bk04 | `#808080` | 占位符 |
| bk05 | `#676767` | 禁用态 |
| bk06 | `#1e1e1e` | 分割线 |
| bk07 | `#151515` | 微弱底色 |

## 3. Typography Rules

### 字体
- **Sans**: Geist (`next/font/google`)
- **Mono**: Geist Mono
- 全局 `antialiased`，无 letter-spacing 调整

### Mars 排版阶梯
每个尺寸提供 title（medium 500 或 semibold 600）+ body（normal 400）两种权重：

| 级别 | 尺寸 | title 权重 | 行高 | 典型场景 |
|------|------|-----------|------|----------|
| 34 | 34px | 600 | 48px | 定价数字、页面大标题 |
| 22 | 22px | 500 | 30px | Plan 名称、分区标题 |
| 17 | 17px | 500 | 24px | 卡片标题、主正文 |
| 15 | 15px | 500 | 22px | Banner 文字、次标题 |
| 14 | 14px | 500 | 18px | 按钮文字、导航、标签 |
| 13 | 13px | 500 | 18px | 辅助说明、小标签 |
| 12 | 12px | 500 | 16px | Badge、元数据、Popular 标签 |
| 11 | 11px | 500 | 14px | 最小级别、Hero badge 文字 |

### Logo 排版
- `text-6xl font-bold tracking-tight` (mobile) / `text-7xl` (desktop)
- Hero Logo: "Lab" 使用 `bg-linear-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent`，"nana" 使用 `text-pink-400`
- Sidebar / mobile Logo: 32px 圆角图标 + `Lab #00BBD0` + `nana #FB64B6`

### 原则
- 标题和正文只靠权重区分（500 vs 400），不加额外装饰
- 行高紧凑（1.27–1.41 倍），适合工具型 UI
- 弹窗、签到对话框中的强调数字用 `text-4xl font-semibold`

## 4. Component Stylings

### 生成按钮（核心 CTA）
- `bg-primary text-primary-foreground` — **金黄底色 + 深棕文字**
- Sparkles 图标（桌面）/ ArrowUp 图标（移动）
- hover: `bg-primary/90`
- 这是用户在整个 App 里看到的最亮的金色块

### 标准按钮 (shadcn/ui)
| variant | 外观 |
|---------|------|
| default | 金黄底 + 深棕字 |
| outline | 暗底 + 边框 + hover 轻灰 |
| ghost | 透明，hover 微灰 |
| secondary | 灰底 |
| destructive | 红底白字 |
| link | 金黄文字 + 下划线 |

尺寸: s(28px)/m(36px)/l(48px), 圆角 6px/8px/12px

### 图片卡片 (ImageCard)
- `bg-black/70` 暗底——让图片作为唯一亮色
- 边框: `border-border/40`，hover `border-border/80`
- 无圆角（瀑布流）或 `aspect-3/4`（网格）
- hover 显示操作层（收藏 ⭐ `fill-yellow-400`、下载、分享、Remix）
- 移动端始终显示操作按钮
- 底部：用户头像 + 时间

### 毛玻璃卡片 (Glass Card)
- 底色: `color-mix(in oklab, var(--card) 75%, oklch(0.08 0 0) 25%)`
- 模糊: `backdrop-filter: blur(16px)`
- 阴影: `0 22px 60px rgba(0, 0, 0, 0.7)`
- `::before` 内发光: 顶部径向白光 + 对角粉蓝渐变（`screen` 混合）
- `::after` 边框环: `inset box-shadow 0 0 0 1px rgba(148, 163, 184, 0.38)`

### 生成表单 (ToolbarForm)
- Glass card 样式容器
- Sticky 吸顶，可折叠/展开
- Textarea + 文件上传区 + 底部工具栏
- 拖拽时: `ring-primary ring-2`（金色边框高亮）
- 拖拽覆盖层: `bg-primary/10 text-primary backdrop-blur-sm`

### 表单控件选中态
- Radio 选中: `border-yellow-400`
- 选中文字: `text-yellow-400 font-semibold`
- Switch: `data-[state=checked]:bg-primary`（金黄）
- Slider 已填充区: `bg-primary`
- Progress bar: `bg-primary`

### Navigation Hover (Cell-Reveal)
- CSS Anchor Positioning 实现
- Highlight 是 `var(--primary)` — 金黄色圆点从 hover 位置放大到 scale(80)
- 400ms ease 过渡
- 覆盖时文字变为 `var(--background)` 色（深色字在金底上）

### Subscribe 按钮
- `border-amber-500/50 bg-amber-500/10 text-amber-500`
- hover: `border-amber-500 bg-amber-500/20`
- ⚡ Zap 图标

### VIP 标记
- `text-amber-500` 的 Crown 或 VIPFill 图标
- 出现在：尺寸选择器、宽高比选择器、批量选择器中的付费选项旁

### Premium Benefit Card（品牌霓虹的主要舞台）
- 旋转渐变边框: `#00BBD0 → #FB64B6 → #00BBD0`（8s 旋转）
- 外发光 + 脉冲
- 内容区: `from-[#0A0E1A] via-[#0F1629] to-[#0A0E1A]`
- 浮动粒子: cyan + pink 光球
- 文字: 青→粉渐变 gradient text
- 箭头/星形可用 pink/cyan 脉冲，但不要使用 gold CTA 样式；这是“会员诱因霓虹卡”，不是普通按钮

### 定价卡片
- `rounded-[24px]` 大圆角
- Pro: 金色边框 `#C1A37A` + 深棕金渐变底
- Standard: 灰蓝边框 + 深蓝灰渐变底
- Free: 灰边框 + 透明
- Pro CTA: `bg-primary`（金黄按钮）
- Popular badge: `#6F522A` 底 + `#EFB100` 字
- 活动 Banner 可以使用独立活动色：New Year `#E63F3F/#FFD28A`，春节 `#FF224C/#FFDFB0`，GPT-Image-2 活动 `#6366F1` label

### Hero Section
- 居中 max-w-4xl
- Logo + "Powered by" pill badge (`border-white/10 bg-white/5 backdrop-blur-sm`)
- 8 个特性 badge 必须出现受控彩色光谱：
  - 4K: `from-amber-400 to-orange-500`
  - Nano Banana: `from-yellow-300 to-lime-400`
  - Highly Detailed: `from-sky-400 to-cyan-300`
  - Anime: `from-pink-400 to-fuchsia-500`
  - UHD: `from-indigo-400 to-blue-500`
  - Lossless: `from-emerald-400 to-teal-500`
  - Portrait: `from-rose-400 to-orange-400`
  - Concept Art: `from-slate-200 to-sky-400`
- Badge 外层同渐变 `opacity-50 blur-md` 光晕，hover 到 `opacity-80`；内层 `bg-black/80 border-white/20 rounded-full backdrop-blur-sm`
- 这些 badge 是 Labnana 的“多彩 AI 能力光斑”，必须与金黄交互同时存在，不能省略成单色

### Mobile Header
- 固定顶部: `bg-background/80 backdrop-blur border-b`
- 左: 圆形 menu button (`rounded-full border shadow-sm`)
- 右: 32px 圆角 banana 图标 + compact cyan/pink Logo

### 模型与免费额度提示
- 模型选择器可以使用 emoji 标识：GPT-Image-2 `✨`、Nano Banana `🍌`、Gemini Flash `⚡`
- 免费额度 badge: `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`
- VIP 专属选项仍用 `amber-500` VIPFill/Crown，不用 hero 彩色光谱替代

## 5. Layout Principles

### 间距
- 基础: 4px (Tailwind `--spacing: 0.25rem`)
- 组件 gap: `gap-6` (24px) 标准，`gap-2` (8px) 紧凑
- 页面 padding: `px-4 py-8` → `sm:px-6 sm:py-12` → `lg:py-16`
- 最大内容宽: `max-w-350` (~1400px)
- Hero 最大宽: `max-w-4xl` (896px)

### 圆角
| 值 | 用途 |
|----|------|
| 2px | 行内代码 |
| 4px | 小 badge |
| 6px | 小按钮 |
| 8px (`radius-m`) | 标准按钮、输入框 |
| 12px (`radius-l`, `rounded-xl`) | 卡片、大按钮、签到弹窗 |
| 16px | Modal |
| 24px | 定价卡片、玻璃面板 |
| 9999px (`rounded-full`) | badge 胶囊、头像、hero badge、menu 按钮 |

### 画廊网格
- `grid-cols-2` → `sm:3` → `md:4` → `2xl:6`
- 或 Masonic 瀑布流

### 生成表单布局
- 单列居中
- Sticky 吸顶，占据用户注意力中心
- 可收起（compact）/ 展开模式
- 点击表单外部 → 自动收起

## 6. Depth & Elevation

### 层次
| 层 | 描述 | 视觉 |
|----|------|------|
| L0 | 星空宇宙画布 | #020617 + 径向渐变 + 粒子 + 暗角 |
| L1 | 内容面 | bg-card / bg-background |
| L2 | 标准卡片 | shadow-sm + border |
| L3 | 图片卡 | bg-black/70 + border-border/40 |
| L4 | 毛玻璃 | blur(16px) + color-mix + inset ring |
| L5 | 侧栏 | blur(22px) + deep shadow |
| L6 | 弹窗/Overlay | bg-black/60 遮罩 + 动画卡片 |
| L7 | 彩色能力光斑 | 小尺寸渐变 badge glow / premium neon / activity label |

### 宇宙背景分层（深色模式）
1. 线性渐变底: `oklch(0.16 0.02 285)` → `oklch(0.11 0.02 285)`
2. 顶部紫色辉光: `oklch(0.35 0.08 300 / 0.35)`，1200px
3. 底部暖色辉光: `oklch(0.62 0.16 40 / 0.16)`，900px
4. 左侧蓝色散射: `oklch(0.45 0.08 250 / 0.1)`，700px
5. Canvas 粒子星空: opacity 0.7
6. 径向暗角: 边缘 rgba(0,0,0,0.46)

### 签到弹窗特殊深度
- 蓝色渐变边框 (1.5px)
- 内底 `#191A21`
- 三个蓝色 blur 光球装饰
- 3D 翻转动画 (`rotateY` + `perspective: 1200px`)

## 7. Do's and Don'ts

### Do
- **金黄色 = 可交互**：所有可点击、可选中、活跃状态的元素用 primary 金黄
- **彩色光斑 = 品牌和 AI 能力**：Logo、Hero badge、Premium 卡、免费/奖励/活动状态必须保留受控彩色
- **极暗的底色**：坚持 `#020617`，不要用灰色或纯黑
- **图片卡用 bg-black/70**：让 AI 生成的图片成为唯一亮点
- Hero 首屏保留 cyan/blue/violet/pink Logo 光谱和 8 个多彩能力 badge
- 表单选中/活跃态用 `yellow-400`（比 primary 更亮的金黄）
- VIP/付费功能用 `amber-500`（Crown 图标 + 边框）
- 免费/奖励状态用 emerald；活动促销可以用 red/indigo/festive gold 的限定 palette
- 毛玻璃三层结构：半透明底 + ::before 发光 + ::after 边框环
- 文字层级用 Mars 排版阶梯的 title/body 双权重
- 宇宙背景用多层径向渐变 + 粒子星空

### Don't
- **不要把青色/粉色当主色用**——它们属于 Logo、Hero 光斑、Premium 装饰，不是普通按钮色
- 不要把 Hero 多彩渐变铺满整屏或用于普通卡片边框；它们应该是小面积光斑
- 不要在非会员/VIP 场景使用 amber 会员语义；要区分"主交互金"和"会员 amber"
- 不要用纯黑 `#000000` 做背景——用 `#020617` 保持深空蓝调
- 不要给普通卡片加太亮的边框——dark mode 下用 10% 白 (`oklch(1 0 0 / 10%)`)
- 不要在图片卡上加渐变或装饰——保持纯暗底让图片说话
- 不要把活动红、campaign indigo、签到蓝光外溢到普通导航/表单/CTA
- 不要混用字体——只有 Geist Sans + Geist Mono
- 不要在日常交互中使用签到弹窗的蓝色装饰光晕——那是特殊弹窗专用
- 不要给按钮用亮白色——签到弹窗里的白色按钮是例外（`text-black! bg-white`）

## 8. Responsive Behavior

### 断点
| 宽度 | 变化 |
|------|------|
| <640px | 单列，顶部 mobile header + 底部 tab 导航，Hero badge 2行换行 |
| sm (640px) | Logo text-7xl，padding 增加 |
| md (768px) | 侧栏出现（可折叠），mobile header 隐藏，画廊 3-4 列 |
| lg (1024px) | 完整桌面 |
| 2xl (1536px) | 画廊最多 6 列 |

### 触控
- 按钮: 28px(s) / 36px(m) / 48px(l)
- Mobile menu: 40×40 `rounded-full`
- 图片卡操作: 移动端始终可见

### 折叠
- 侧栏 → mobile header + bottom tabs
- 画廊: 6→4→3→2 列
- 生成表单: sticky 吸顶可折叠
- 星空: 移动端 opacity 降至 0.35

### 动效
- Theme toggle: View Transition 圆形遮罩揭示
- 缓动: `--expo-in` / `--expo-out` 自定义 linear timing
- BenefitCard: 8s 旋转边框 + 3s 浮动粒子 + hover shimmer
- Navigation: 400ms cell-reveal hover 动画
- 签到弹窗: 3D rotateY 翻转切换步骤
- `prefers-reduced-motion`: 禁用 nav-link cell 动画

## 9. Agent Prompt Guide

### 快速色彩查表
```
页面底色:       #020617 (极深蓝黑)
主交互色:       oklch(0.795 0.184 86.047) (金黄)
选中态:         yellow-400 (亮金黄)
VIP 标记:       amber-500
卡片面:         oklch(0.21 0.006 285.885)
主文本:         oklch(0.985 0 0) (近白)
次文本:         oklch(0.705 0.015 286.067) (灰)
边框:           oklch(1 0 0 / 10%)
Focus ring:     oklch(0.554 0.135 66.442) (暗金)
图片卡底:       bg-black/70
品牌 cyan:      #00BBD0 (仅 logo)
品牌 pink:      #FB64B6 (仅 logo)
Hero Logo:      Lab = cyan-400 -> blue-400 -> violet-400, nana = pink-400
Hero badge:     amber/orange, yellow/lime, sky/cyan, pink/fuchsia, indigo/blue, emerald/teal, rose/orange, slate/sky
Premium neon:   #00BBD0 -> #FB64B6 -> #00BBD0
免费/奖励:      emerald-400 / emerald-900/30
活动 indigo:    #6366F1 (GPT-Image-2 Free Trial / Free Quota)
促销 red:       #E63F3F / #FF224C
签到蓝光:       #0080FF, #3E73E2, #334C80 (仅签到弹窗)
Pro 金:         #C1A37A 边框, from-[#241B0E] to-[#45351E] 底
Popular badge:  #EFB100 on #6F522A
```

### 组件示例 Prompt

**AI 图片生成表单（核心交互区）：**
"在 #020617 背景上创建 sticky 表单卡片。使用毛玻璃处理（blur 16px + 半透明底色）。包含：多行 textarea、文件上传拖拽区（拖拽时 ring-2 金黄高亮 + bg-primary/10 覆盖层）、底部工具栏（模型选择器、分辨率、宽高比、数量）。生成按钮使用 bg-primary（金黄底深棕字）配 Sparkles 图标。VIP 专属选项旁加 amber-500 的 Crown 小图标。"

**图片画廊：**
"响应式瀑布流画廊。图片卡片 bg-black/70 无圆角，border 10% white。Hover 显示操作按钮。收藏按钮选中态：fill-yellow-400 text-yellow-400。底部用户信息。2-6 列自适应。整体效果是暗色海洋中漂浮的图片亮块。"

**定价页：**
"三档定价卡并排。全部 rounded-[24px]。Pro 卡：金色边框 #C1A37A + 深棕金渐变底 + Popular badge（#EFB100 字 #6F522A 底 rounded-[12px]）+ 金黄 CTA 按钮。Standard 卡：灰蓝边框 #747FAE + 深蓝灰渐变底。Free 卡：灰边框 + 透明底。功能列表用 CheckMark + mars-text-body-14。页面顶部若有活动 banner，可用限定活动色：GPT-Image-2 用 #6366F1 label，促销折扣用 #E63F3F，春节/新年用 #FF224C + #FFDFB0。"

**侧栏导航：**
"可折叠固定侧栏，边框 border-[#1E2336]。Logo 32px 圆角图标 + compact 'Lab' #00BBD0 + 'nana' #FB64B6 文字。导航项 active 使用金黄 bg-primary；hover 可用 cell-reveal（金黄色圆点从 hover 位置放大覆盖）。底部：amber Subscribe 按钮 + 签到入口 + 用户头像。不要把 hero 彩色 badge 渐变用到普通导航项。"

**Hero 首屏：**
"在 #020617 深空背景上创建居中 Hero。Logo 使用超大字：'Lab' cyan-400→blue-400→violet-400 渐变文字，'nana' pink-400。Logo 下方是 'Powered by Google Nano Banana' 的半透明 pill。再下方放 8 个 rounded-full 能力 badge，每个 badge 内层 bg-black/80 border-white/20 backdrop-blur-sm，外层同色渐变 blur-md 光晕：4K amber/orange、Nano Banana yellow/lime、Highly Detailed sky/cyan、Anime pink/fuchsia、UHD indigo/blue、Lossless emerald/teal、Portrait rose/orange、Concept Art slate/sky。"

**Premium Benefit 卡片：**
"创建一个紧凑会员诱因卡。外层 2px 旋转霓虹边框 #00BBD0 → #FB64B6 → #00BBD0，内部 from-[#0A0E1A] via-[#0F1629] to-[#0A0E1A]。加入 cyan/pink 模糊粒子和 hover shimmer，文字用 cyan→pink gradient text。该卡可以很彩色，但普通 CTA 仍使用金黄 primary。"

### 迭代指南
1. **暗黑 + 金黄交互 + 多彩 AI 光斑 = 这个产品的视觉身份**。只做暗金会显得少了灵魂。
2. 金黄有三个层级：primary（按钮/主交互）> yellow-400（选中态）> amber-500（VIP 标记）
3. 品牌光谱有三个场景：Logo、Hero 能力 badge、Premium/Benefit 装饰；绝不做普通交互色
4. 图片内容区永远是 `bg-black/70` 暗底——图片才是主角
5. 背景不是平面——星空+渐变+暗角构成宇宙空间感
6. 毛玻璃三层：半透明底 + 发光伪元素 + inset ring 边框
7. 定价用金色系区分档位（金>蓝灰>灰）
8. 表单是页面中心——sticky 吸顶 + glass card + 金黄生成按钮
9. 免费/奖励用 emerald，活动 campaign 用 indigo/red/festive gold，签到蓝光只留给签到弹窗
