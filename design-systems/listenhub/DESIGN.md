# ListenHub

> Category: AI & LLM
> AI 音频内容创作平台。Mars 设计系统，白底黑字工作台，橙粉蓝品牌渐变高光，内容封面驱动视觉。

## Visual Theme & Atmosphere

明亮的音频创作工作台。白色画布、浅灰侧栏、黑色主操作、薄边框、低 alpha 阴影。内容封面（播客、图片、slides）是视觉焦点，UI 框架保持克制。

主交互色是黑色 `#000000`：CTA、submit、play/pause、定价购买。橙粉蓝渐变仅用于品牌高光：Pro 推荐、upgrade、referral、loading 动效。`#6648ff` 是 Mars 品牌 token，不是全局 CTA。

字体 Inter + D-DIN-Bold（数字）。全局 letter-spacing 为 0。

## Color Palette & Roles

### Mars Core Tokens

源文件：`src/assets/styles/mars-design-system.css`

| Token | Light | Dark | Role |
|---|---|---|---|
| `mars-basic-white` | `#ffffff` | `#000000` | 页面/卡片底色 |
| `mars-basic-black` | `#000000` | `#ffffff` | 主操作、强文字 |
| `mars-basic-bk01` | `#101010` | `#fbfbfb` | 标题/前景 |
| `mars-basic-bk02` | `#333333` | `#cccccc` | 次级强文字 |
| `mars-basic-bk03` | `#666666` | `#9a9a9a` | 正文/描述/侧栏未激活 |
| `mars-basic-bk04` | `#808080` | `#808080` | 占位符、弱辅助 |
| `mars-basic-bk05` | `#999999` | `#676767` | 禁用/元数据/时长 |
| `mars-basic-bk06` | `#eaeaea` | `#2e2e2e` | 边框、分割线、骨架 |
| `mars-basic-bk07` | `#f6f6f6` | `#232323` | 侧栏、浅面板、hover |
| `mars-surface-background` | `#ffffff` | `#181818` | 应用/播放器/页面背景 |
| `mars-static-white` | `#ffffff` | `#ffffff` | 不反转的白 |
| `mars-static-black` | `#000000` | `#000000` | 不反转的黑 |

### Brand & Functional Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `mars-branding` | `#6648ff` | `#6648ff` | Mars 品牌，少量链接/强调 |
| `mars-color-error` | `#e63f3f` | `#e63f3f` | 错误、折扣 |
| `mars-color-blue-100` | `#b8d2ff` | `#072352` | 浅蓝辅助背景（voice cloning loading、tooltip） |
| `mars-color-blue-900` | `#3574e3` | `#0d53ce` | 小型 badge（Popular、年付折扣）、markdown 链接 |
| `mars-color-pink-100` | `#ffd3e8` | `#5f0630` | 产品图标背景 |
| `mars-color-pink-900` | `#ea378c` | `#ea378c` | 粉色图标/文字 |
| `mars-color-purple-100` | `#e2ddff` | `#3a316a` | 会员 badge 背景 |
| `mars-color-purple-900` | `#6f61c3` | `#715ee4` | 升级文案、定价图标 |
| `mars-color-green-100` | `#92e5ba` | `#005c2c` | AI Image/Voice 产品背景 |
| `mars-color-green-900` | `#38BC78` | `#00a34f` | 成功/绿色产品图标 |
| `mars-story-book` | `#593605` | — | Storybook 书本文字 |
| `mars-story-book-muted` | `#bead92` | — | Storybook 弱文字 |

### Gradients

源文件 CSS 变量直接摘录：

```css
--gradient-background-liner: linear-gradient(to right, #e1e5ff, #efe2ff);
--gradient-brand-color: linear-gradient(to right, #ff8e43, #ff58b4, #3aadff);
--color-linear-gradient: linear-gradient(90.03deg, #fca76f 0.03%, #ed8fe5 36.59%, #7ebdea 86.28%);
```

其他组件级渐变：
- Pro 卡片边框：`linear-gradient(151.66deg, #FCA76F 1.24%, #ED8FE5 48.81%, #7EBDEA 96.1%)`
- Pro 卡片表面 light：`linear-gradient(154.3deg, #FFFAF6 2.06%, #FFF5FE 50.52%, #F5FBFF 98.18%)`
- Pro 卡片表面 dark：`#2E1200 → #20001E → #02111C`
- 定价弹窗 light：`linear-gradient(180deg, #D7DBFF, #FFE5E5)`
- 定价弹窗 dark：`linear-gradient(180deg, #2A2F55, #33101C)`
- 动画渐变容器：`#7EBDEA → #ED8FE5 → #FCA76F → #ED8FE5 → #7EBDEA`，`background-size: 200% 100%`

### Shadcn Compatibility Tokens

源文件：`src/assets/styles/tailwind.css`，附属于 Mars tokens。

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
  --destructive: oklch(0.577 0.245 27.325);
}
```

### Campaign Palettes

仅限特定活动页面，不用于常规 UI。

- **Zhihu Radio**：背景 `#FFF9EF → #FEEDD3`，红 `#C91133`，金 `#E2A76F`，暖 pill `#ffecd2`
- **Pricing 活动**：新年标签 `#FFB200`，春节红金 `#FF224C / #FFDFB0`

## Typography Rules

### Fonts

- **Primary**：Inter via `next/font/google`（`--font-inter` → `--font-sans`）
- **Numeric**：D-DIN-Bold (`public/fonts/D-DIN-Bold.woff2`)
- **Fallback**：`SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif`
- **Campaign**：`Petit Formal Script` 仅 Zhihu Radio 日期

```css
@font-face {
  font-family: D-DIN-Bold;
  src: url('/fonts/D-DIN-Bold.woff2') format('woff2'),
       url('/fonts/D-DIN-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Mars Typography Utilities

源文件：`mars-design-system.css` `@utility` 定义。

| Utility | Size | Line-height | Weight | Use |
|---|---:|---:|---:|---|
| `mars-text-title-34` | 34px | 48px | 600 | 定价大标题 |
| `mars-text-title-22` | 22px | 30px | 500 | 区块标题、计划名 |
| `mars-text-body-22` | 22px | 30px | 400 | 大段正文 |
| `mars-text-title-17` | 17px | 24px | 500 | CTA、对话框标题 |
| `mars-text-body-17` | 17px | 24px | 400 | 创建页描述 |
| `mars-text-title-15` | 15px | 22px | 500 | 卡片标题、按钮文字 |
| `mars-text-body-15` | 15px | 22px | 400 | 区块描述、输入文字 |
| `mars-text-title-14` | 14px | 18px | 500 | Tab、导航、按钮 |
| `mars-text-body-14` | 14px | 18px | 400 | 列表、元数据 |
| `mars-text-title-13` | 13px | 18px | 500 | 辅助标签 |
| `mars-text-body-13` | 13px | 18px | 400 | 支撑文字、Footer |
| `mars-text-title-12` | 12px | 16px | 500 | Badge |
| `mars-text-body-12` | 12px | 16px | 400 | 播放器时长、卡片底部 |
| `mars-text-title-11` | 11px | 14px | 500 | 微型 badge |
| `mars-text-body-11` | 11px | 14px | 400 | 最弱元数据 |

`mars-text-ddin`：`font-family: D-DIN-Bold, 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif`，用于价格和数字。

## Component Stylings

### Buttons

- **default**：`bg-mars-basic-black text-mars-basic-white hover:opacity-80`
- **outline**：`border-mars-basic-bk06 bg-background`，黑色文字
- **ghost**：透明，hover 改变透明度
- **emphasis**：全圆角 pill，三色渐变 `bg-accent-emphasis-vibrant → #FF6B8B → #DD94FD`，白色文字，inset 白光 shadow
- **link**：primary 文字，hover 下划线
- Sizes：s=28px/6px radius、m=36px/8px radius、l=48px/12px radius、icon=36px 方形
- Marketing CTA 常用 `rounded-full px-8 py-4.5`

### Cards

- 标准卡片：`border-bk06`，`shadow-[0_0_16px_rgba(0,0,0,.04)]`，白底
- Podcast 卡片：`aspect-square rounded-2xl`，全铺封面 + 底部 progressive blur，白色标题覆盖
- Gallery masonry：真实图片宽高比，`rounded-xl border-bk06`，白色 footer，hover `scale-105`
- TTS 卡片：封面 blur 全背景 + 半透明白遮罩 + 清晰封面图
- Slides 卡片：`aspect-video rounded-xl`，hover `scale-103`

### Sidebar

- 宽度：expanded 240px / collapsed 64px / mobile 22rem
- 背景 `mars-basic-bk07`，边框 `mars-basic-bk06`
- Nav row：36px 高，`rounded-m`，8px gap
- Active：`bg-mars-basic-bk07`，黑色文字/图标
- Inactive：`text-mars-basic-bk03`

### Player

- Desktop：fixed bottom 96px，`mars-surface-background`，top border `bk06`，避开侧栏宽度
- Mobile：full-width 56px + safe-area，`shadow-[0_-4px_16px_rgba(0,0,0,.04)]`
- 播放按钮：36px 黑色圆形

### Pricing Page

源文件：`src/app/[locale]/(app)/(full-page)/pricing/`、`src/components/pricing/`、`src/components/popup/pricing.tsx`

#### 页面布局

- 外层：`max-w-[1500px]`，`lg:max-w-[1340px]`，`md:px-[100px] lg:px-4`
- 定价页标题：`text-[28px] leading-8 font-bold` / mobile `mars-text-title-22`
- 标题渐变部分：`text-[34px] leading-[50px] font-bold`，`bg-(image:--gradient-brand-color) bg-clip-text text-transparent`
- "Powered by" 品牌行：`mars-text-body-14 text-mars-basic-bk03`，品牌名 `mars-text-title-14`
- FAQ 容器宽度：`w-200`（800px），标题 `text-5xl font-bold` / mobile `text-2xl`

#### Plan 卡片 Grid

- Grid：`grid gap-x-4 gap-y-6`
- 定价页变体：`sm:grid-cols-2 xl:grid-cols-4`
- Landing 变体：`md:grid-cols-3`
- 首登弹窗变体：`lg:grid-cols-2`

#### Plan 卡片结构

**外层 wrapper**（仅 Popular 可见）：
- `rounded-[26px]`，Popular 加 `p-0.5`
- Popular 渐变边框：`bg-linear-[151.66deg,#FCA76F_1.24%,#ED8FE5_48.81%,#7EBDEA_96.1%]`
- Mobile Popular 置顶：`max-sm:order-0!`

**内层卡片**：
- `rounded-3xl bg-mars-basic-white px-6 py-4`
- 非 Popular 边框：`border border-mars-basic-bk05/20`
- Popular 表面 light：`bg-linear-[154.3deg,#FFFAF6_2.06%,#FFF5FE_50.52%,#F5FBFF_98.18%]`
- Popular 表面 dark：`bg-linear-[154.3deg,#2E1200_2.06%,#20001E_50.52%,#02111C_98.18%]`

**卡片内容**：
- 计划名：`mars-text-title-22 text-mars-basic-black`
- Popular badge：`h-6 rounded-full bg-mars-color-blue-900 px-2.5 mars-text-title-12 text-white`
- 价格 $：`text-[17px] inline-block w-[11px]`
- 价格数字：`mars-text-ddin text-[38px]`
- /month：`mars-text-body-14 text-mars-basic-bk05`
- 年付提示：`mars-text-body-13 text-mars-basic-bk05`
- Credits box：`h-[58px] rounded-[12px] border border-mars-basic-bk06 px-3`
- Credits 数字：`mars-text-ddin text-[16px]`
- 估算文字：`mars-text-body-12 text-mars-basic-bk04`
- 权益列表：`gap-2.5`，条目 `mars-text-body-14 leading-5 text-mars-basic-black`，勾 `size-4.5 text-mars-basic-bk02`
- 权益说明：`mars-text-body-14 text-mars-basic-bk04`

**CTA 按钮**：
- 标准：`h-12 rounded-[12px] mars-text-title-15 hover:opacity-80`
- Pro/普通购买：default variant（黑底白字）
- Free/已订阅：outline variant
- 首登非 Popular：`bg-mars-basic-bk07 text-mars-basic-black`
- 禁用：`disabled:border-mars-basic-bk06 disabled:text-mars-basic-bk05`

#### Duration Tabs

- TabsList：`h-10 rounded-full bg-mars-basic-bk07`
- 激活态：`outline outline-mars-basic-bk06 shadow-[0px_4px_30px_0px_#00000014]`
- 未激活态：`text-mars-basic-bk03`
- 年付折扣 badge：`h-5 rounded-full bg-mars-color-blue-900 mars-text-title-12 text-white`

#### 定价弹窗（Pricing Popup）

- Dialog：`w-[760px] rounded-[24px] p-0` / mobile `w-[350px]`
- 左面板：`w-[380px] px-7.5 pt-7 pb-7.5`
- 左面板渐变 light：`bg-[linear-gradient(180deg,#D7DBFF,#FFE5E5)]`
- 左面板渐变 dark：`bg-[linear-gradient(180deg,#2A2F55,#33101C)]`
- VIP 标题：`text-[28px] leading-[48px] font-bold` / mobile `mars-text-title-22`
- 功能 icon：`size-6`，`gap-[9px]`
- 功能文字：`mars-text-title-14`
- 右面板：`w-[380px] px-10 pt-15.5 pb-8` / mobile `px-7.5 pt-4 pb-4`
- Credits box：`rounded-[12px] border border-mars-basic-black/11`
- Duration 选中：`border-[1.5px] border-mars-basic-black rounded-[12px] px-4 py-3`
- Duration 未选中：`border border-mars-basic-bk06 rounded-[12px]`
- 价格 $：`mars-text-ddin text-[17px]`
- 价格数字：`mars-text-ddin text-[28px]`
- 保障 badges：`mars-text-body-14 text-mars-basic-bk03`，分隔 `border-l border-mars-basic-bk06 h-3`

#### Pack 充值页

- Pack 卡片 Grid：`grid max-w-[916px] grid-cols-4 gap-3` / mobile `grid-cols-2`
- 标题：`mars-text-title-34`
- Pack 卡片：`rounded-lg shadow-none`
- Pack 卡片边框 Popular：`border-mars-color-purple-900`
- Pack 卡片边框非 Popular：`border-mars-color-purple-100`
- CardContent：`px-10 pt-[26.5px] pb-[25.5px]`
- Credits icon：`size-5.5 text-mars-color-purple-900`
- Credits 数字：`mars-text-ddin text-mars-color-purple-900`
- 按钮：`mt-6 w-full` size="m"

**VipBanner**：
- `max-w-[916px] rounded-[12px] border border-mars-color-purple-100 px-[65px] py-[30px]`
- 功能 icon：`size-7 gap-[45px]`
- 模糊光圈 bottom：`h-[268px] blur-[100px]`，light `#FBF5FF` / dark `#200C2B`
- 模糊光圈 top：`size-[217px] blur-[198.9px]`，light `#E6F3FF` / dark `#200C2B`

#### Enterprise

- 触发器：`h-15 rounded-[12px] border border-mars-basic-bk06`
- 建筑 icon：trigger `size-6.5`，dialog `size-8`
- Checklist 区：`rounded-[12px] bg-mars-basic-bk07 py-3`
- 对勾 icon：`size-4.5 text-mars-color-green-900`

#### Extra Credits Pack

- 条形容器：`h-13 max-w-[705px] rounded-[12px] border-mars-basic-bk06 bg-mars-basic-white`
- 按钮：`h-7 rounded-[6px] mars-text-title-12`

#### FAQ

- 问题：`mars-text-title-17 text-mars-basic-black`
- 答案：`mars-text-body-15 whitespace-pre-line text-mars-basic-bk03`
- Accordion 分割：`border-mars-basic-bk06`
- 底部联系：`mars-text-body-17 text-mars-basic-black`，邮箱 `mars-text-title-17 hover:underline`

#### Payment-zh 支付弹窗

- Dialog：`max-w-[480px] rounded-[16px]`
- 支付选项 Grid：`grid grid-cols-2 gap-2`
- 选项卡片：`rounded-m border border-mars-basic-bk06 px-3 py-3.5` / 选中 `border-mars-basic-black`
- 支付宝文字：`#358AE8`
- 微信支付文字：`#24C323`
- 购买按钮：`h-12 w-65.5 rounded-[12px] mars-text-title-15`

#### Annual Payment Dialog

- Dialog：`w-[305px] rounded-[20px] px-5 pt-8 pb-5`
- VipFill icon：`size-8`
- 对比表格：`rounded-m border border-mars-basic-bk06`，行 `p-3 border-t border-mars-basic-bk06`
- 按钮：`h-12 rounded-[12px]`

#### Activity Banner（Campaign）

- 容器：`h-[120px] rounded-[12px] border border-mars-basic-bk06`
- Timer box：`h-19 w-16 rounded-md backdrop-blur-[26.2px]`
  - 标准：`bg-[rgba(241,241,241,.7)] dark:bg-[rgba(63,63,63,.7)]`
  - 春节：`bg-[#FF224C]`，数字/单位 `text-[#FFDFB0]`
- 折扣文字：`text-mars-color-error`
- 新年标签：`bg-[#FFB200] text-black`
- 春节标签：`bg-[#FF224C] text-[#FFDFB0]`
- GPT 标签：`bg-[#6366F1] text-white`
- 庆祝烟花色：`#a786ff`、`#fd8bbc`

#### Redemption Code

- 容器：`max-w-[332px]`
- 输入框：`h-12 rounded-[12px] border-mars-basic-bk05 bg-mars-basic-white`
- 错误：`rounded-lg border border-mars-color-error`
- 提交按钮：`h-12 rounded-[12px] bg-black text-[15px] font-medium text-white`

#### 定价相关关键色总结

| 语义 | Token / 值 |
|---|---|
| Popular badge | `bg-mars-color-blue-900` |
| 年付折扣 badge | `bg-mars-color-blue-900` |
| Pro CTA（联系）| `bg-mars-color-purple-900` |
| Pack 卡片强调边框 | `border-mars-color-purple-900` |
| Pack 弱边框 / VipBanner | `border-mars-color-purple-100` |
| Credits 数字 / icon | `text-mars-color-purple-900` |
| 升级链接 / checkout | `text-mars-color-purple-900` |
| 折扣/错误 | `text-mars-color-error` |
| 非 Popular 卡片边框 | `border-mars-basic-bk05/20` |

## Layout Principles

- App shell = 侧栏 + 主内容区
- Base spacing rhythm：4px
- 侧栏 expanded 240px / collapsed 64px
- 工具页面 max-width 常用 720px（输入）/ 1120px（gallery）
- 产品入口 grid：desktop 3col / mobile 2col
- Gallery masonry：`break-inside-avoid`，不强制等高

## Depth & Elevation

### Shadow Tokens

源文件：`src/assets/styles/--shadow.css`，完整摘录。

**基础方向阴影：**
```css
--drop-shadow-bottom: 0px 4px 16px #0000000a;
--drop-shadow-top: 0px -4px 16px #0000000a;
--drop-shadow-center: 0px 0px 16px #0000000a;
--shadow-drop-bottom-medium: 0 4px 30px 0 rgba(0, 0, 0, 0.08);
```

**Drop 系列（xs → 2xl）：**
多层 `rgba(107,111,122,0.05)` 堆叠 + 白色 inset 高光。每级增加一层更大偏移。

```css
--shadow-drop-xs:
  0px 3px 3px -1.5px rgba(107, 111, 122, 0.05),
  0px 1px 1px -0.5px rgba(107, 111, 122, 0.05),
  inset 0px 0px 0px 1px rgba(255, 255, 255, 0.02),
  inset 0px 1px 0px 0px rgba(255, 255, 255, 0.08);

--shadow-drop-sm: /* +1 layer: 6px 6px -3px */
--shadow-drop-md: /* +1 layer: 12px 12px -6px */
--shadow-drop-lg: /* +1 layer: 24px 24px -12px */
--shadow-drop-xl: /* +1 layer: 48px 48px -24px */
--shadow-drop-2xl: /* +1 layer: 96px 96px -48px, 12px layer uses 0.12 alpha */
```

**Inner 系列：**
```css
--shadow-inner-xs: inset 0px 1px 1px 0px rgba(107,111,122,0.05), inset 0px 0px 1px 0.5px rgba(107,111,122,0.05);
--shadow-inner-sm: inset 0px 1px 1px 0px ..., inset 0px 2px 4px 0px ..., inset 0px 0px 20px 1px ...;
--shadow-inner-upward-xs: inset 0px -1px 0px 0px rgba(183,184,189,0.2);
--shadow-inner-upward-sm: inset 0px -2px 0px 0px rgba(183,184,189,0.2);
```

**Modul 系列：**
```css
--shadow-modul-card: 0px 6px 15px -3px rgba(107,111,122,0.05), ...;
--shadow-modul-area: drop + inner 混合;
--shadow-modul-slider: 0.5px ring rgba(183,184,189,0.2) + drop + white inset;
--shadow-modul-slider-muted: ring 0.3 alpha 版;
```

**Loop 系列（带 outline ring）：**
Drop 系列 + `0px 0px 0px 1px rgba(183,184,189,0.2)` outline。xs → 2xl 同层递增。

特殊变体：
```css
--shadow-loop-accent: ...outline rgba(251,146,60,0.3)...;  /* 品牌橙高光 */
--shadow-loop-overlay-3dp: ...0px 0px 0px 3px rgba(0,0,0,0.17), 0px 0px 0px 1px rgba(0,0,0,0.22)...; /* 强覆盖 */
```

### Practical Elevation

| Surface | Elevation |
|---|---|
| 侧栏 | `bk07` + border `bk06`，无重阴影 |
| 标准卡片 | border `bk06` + `0 0 16px rgba(0,0,0,.04)` |
| 创建输入 | `0 4px 30px rgba(0,0,0,.08)` |
| Hover 菜单 | `0 0 16px rgba(0,0,0,.04)` |
| Mobile 播放器 | `0 -4px 16px rgba(0,0,0,.04)` + inset border |
| Pro 推荐 | 渐变边框 + 渐变表面 |
| Dialog | overlay black/50 + `backdrop-blur-sm` |

### Animations

源文件：`tailwind.css` + `animations.css`

```css
--animate-fade-in: fade-in 0.5s linear forwards;
--animate-slide-up: slide-up 0.3s ease-out;
--animate-gradient-shift: gradient-shift 4s linear infinite;
--animate-flip-x: flip-x 0.6s ease-in-out;
--animate-shiny-text: shiny-text 2.5s cubic-bezier(0.4, 0, 0.8, 1) infinite;
```

额外 keyframes（`animations.css`）：`flip-in/flip-out`（0.6s）、`slide-loader`（1.6s）、`up-and-down`（clip-path 音频可视化）、`float-circle-1/2/3`（AI loading 不规则漂浮）、`wiggle`（prompt 卡片晃动）。

内容卡片 hover：200ms `scale-103` ~ `scale-105`。

## Do's and Don'ts

- 普通 CTA 用黑色，不是紫色或渐变
- 页面主体是白/灰/黑，内容图片承载色彩
- 橙粉蓝渐变限用于 Pro、upgrade、referral、loading、品牌高光
- Campaign 色（Zhihu Radio 红金、活动标签）不外溢到常规 UI
- 内容卡片按类型（Podcast/Gallery/TTS/Slides）使用对应表面，不统一为一种白色圆角矩形
- 数字价格/积分用 D-DIN
- 阴影保持低 alpha，除非是 campaign 或 overlay 场景

## Responsive Behavior

### Layout Variables

```css
:root {
  --sidebar-width: 240px;
  --sidebar-width-icon: 4rem;
  --sidebar-width-mobile: 22rem;
  --mobile-nav-height: 48px;
  --player-height-mobile: 56px;
  --player-height-desktop: 96px;
  --episode-header-height-mobile: 48px;
  --episode-header-height-desktop: 64px;
}
```

### Breakpoints

- `sm 640px`：desktop 播放器/header 变量切换
- `md 768px`：feature header CTA 右置，slides 2col
- `lg 1024px`：app desktop 布局，gallery 4col
- `xl+`：内容 max-width 放宽至 1120px ~ 1500px

### Radius Tokens

```css
--radius-2xs: 2px;
--radius-xs: 4px;
--radius-m: 8px;
--radius-l: 12px;
--radius-xl: 16px;
```

更大值按组件使用：20px（创建输入）、24px（定价弹窗）、26px（定价外卡）、9999px（pill/头像）。

### Scrollbars

- Light：track `#f1f1f1`、thumb `#c1c1c1`、hover `#a8a8a8`
- Dark：track `#1a1a1a`、thumb `#333`、hover `#444`
- `.scrollbar-hide`：隐藏滚动条
- `.scrollbar-overlay`：8px overlay thumb，透明 border

## Agent Prompt Guide

Token 速查：

```
白底：           #ffffff / mars-basic-white
浅面板：         #f6f6f6 / mars-basic-bk07
标题：           #101010 / mars-basic-bk01
正文：           #666666 / mars-basic-bk03
占位符：         #808080 / mars-basic-bk04
边框：           #eaeaea / mars-basic-bk06
主操作：         #000000 / mars-basic-black
品牌渐变：       #ff8e43 → #ff58b4 → #3aadff
Linear 渐变：    #fca76f → #ed8fe5 → #7ebdea
字体：           Inter + D-DIN-Bold
排版：           mars-text-title-*/mars-text-body-* 工具类
紫色高级：       #6f61c3 / mars-color-purple-900 → 升级、充值、Pro CTA
粉色产品：       #ea378c / mars-color-pink-900 → 产品图标、女性标记
```

生成时检查：CTA 是黑色的吗？页面是白/灰/黑为主吗？渐变仅出现在品牌高光处吗？数字用了 D-DIN 吗？紫色仅在升级/充值场景吗？
