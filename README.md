# Lab AI 前端项目

这是一个基于 Vue 2 和 Element UI 构建的实验室平台前端项目，集成了众多实用和进阶的业务组件与功能模块，适用于快速开发企业级后台管理系统或相关实验平台。

## 🛠 技术栈

本项目主要采用以下技术与库构建：

- **核心框架**：[Vue 2.6.x](https://v2.vuejs.org/)
- **路由状态**：Vue Router、Vuex
- **UI 组件库**：[Element UI](https://element.eleme.cn/#/zh-CN)
- **图表展示**：[ECharts](https://echarts.apache.org/) - 强大的数据可视化支持
- **富文本编辑器**：TinyMCE (`@tinymce/tinymce-vue`)
- **视频播放**：Video.js (`vue-video-player`)
- **表格与数据导出**：`xlsx` & `file-saver`
- **拖拽排序**：`sortablejs`
- **代码高亮**：PrismJS
- **网络请求**：Axios
- **样式预处理**：Sass / SCSS

## 📦 安装与运行

> **注意：** 本项目强制约定使用 `pnpm` 作为包管理工具进行依赖下载与管理。

### 1. 安装依赖

```bash
# 推荐使用 pnpm 进行安装
pnpm install
```

### 2. 启动本地开发服务

```bash
pnpm run serve
```
启动后，项目默认运行在开发环境，并自带了一部分接口的 Mock 数据（如 `/api/table/list`），方便直接预览组件和页面效果。

### 3. 构建生产环境代码

```bash
pnpm run build
```
执行完毕后，生成的静态文件默认会输出到 `lab-project` 目录中。

### 4. 代码格式化校验

```bash
pnpm run lint
```

## 📁 核心目录结构

```text
lab-ai/
├── public/               # 静态资源与 Mock 数据目录
│   ├── mock/             # 本地 Mock 数据配置
│   └── index.html        # HTML 模板
├── src/                  # 源代码主目录
│   ├── components/       # 全局自动注册的复用组件
│   ├── directives/       # 全局自动注册的自定义指令
│   ├── router/           # 路由配置文件
│   ├── store/            # Vuex 状态管理
│   ├── styles/           # 全局样式与 SCSS 变量/Mixins
│   ├── App.vue           # 根组件
│   └── main.js           # 项目主入口
├── vue.config.js         # Vue CLI 项目配置文件
└── package.json          # 项目依赖与脚本配置
```


## ✨ 功能特性

### 1. 核心架构优化
- **全局组件自动注册**：在 `src/components` 目录下的常用组件可实现自动注册，减少频繁的 `import` 引入。
- **自定义指令系统**：内置丰富的指令库（`src/directives`）并自动挂载。
- **配置化打包**：提供了完整的 `vue.config.js`，包含别名配置、Sass 变量自动注入及本地 Mock 接口拦截功能。

### 2. 丰富的内置业务组件
本项目封装了大量开箱即用的高级业务组件：
- **`LabTable` 系列**：高级表格（`LabTable`）、带分页的表格容器（`LabTablePage`）、表格穿梭框（`LabTableTransfer`）。
- **表单与输入**：高级表单生成器（`LabForm`）、支持模糊搜索的下拉选择（`LabFuzzySelect`）、IP 地址专用输入框（`LabIpInput`）。
- **多媒体与可视化**：
  - 基于 ECharts 的图表组件（`LabChart`）
  - 富文本编辑器（`LabRichText`，基于 TinyMCE）
  - 视频播放器（`LabVideo`，基于 Video.js）
- **实用工具组件**：文件上传组件（`LabUpload`）、二维码生成器（`LabQRCode`）、文字滚动跑马灯（`LabTextRoll`）、切片上传框架等。

### 3. 多场景的自定义指令
在 `src/directives` 中封装了多种可以直接在 DOM 元素上使用的指令，如：权限控制、防抖节流、拖拽等，极大提升开发体验。

### 4. 数据展现与导出
集成 ECharts 大屏/图表和基于 `xlsx` + `file-saver` 的 Excel 纯前端导入导出功能。

## 📄 开源协议 (License)

本项目代码部分采用 **[GNU General Public License v3.0 (GPLv3)](./LICENSE)** 协议开源。
你可以自由地学习、修改和分发本项目代码。但**如果任何商业机构或个人将本项目代码用于自身的闭源商业产品中，必须将其整个项目一并开源，并同样采用 GPLv3 协议**。

> **提示**：由于 GPLv3 的强传染性，这在极大程度上限制了商业闭源“白嫖”行为，保护了开源作者的权益。

## 📝 开发规范

1. **命名规范**：项目中所有新建的组件、工具函数、静态资源等**务必使用小驼峰命名法（camelCase）**。示例：`userInfoCard.vue`、`formatDate.js`。
2. **样式隔离**：Vue 组件内部样式建议使用 `<style lang="scss" scoped>`，避免影响全局。在必要时使用深度作用选择器（如 `::v-deep`）覆盖子组件样式。
3. **注释要求**：所有复杂的组件、逻辑方法以及自定义指令等，都需要配以清晰简洁的中文注释。

---

如果遇到任何问题，欢迎提出 Issue 或进行探讨分析。
