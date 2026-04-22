# 《AI应用开发：从零到AgentScope-Java实战》

> 本科计算机专业AI应用开发课程教材｜48学时（3学分）｜基于AgentScope-Java v0.2.0

---

## 📚 项目介绍

本项目是系统化教材开发仓库，采用 **"分阶段提示词工作流 + 人工校验 + 自动化排版管线"** 生产模式，目标是产出高质量、可交付的本科教材。

### 核心特征

| 特征 | 说明 |
|------|------|
| **零基础起点** | 学生仅需Java基础与数据结构知识 |
| **企业级终点** | 能独立开发含工具调用、记忆管理、多Agent协作的企业级AI应用 |
| **框架中立** | 以AgentScope-Java为参照，但强调通用设计思想 |
| **工程化导向** | 覆盖开发→测试→部署→监控全链路 |

---

## 🗂️ 项目结构

```
agentscope-java-textbook/
├── .github/              # GitHub CI/CD 配置
│   └── workflows/        # GitHub Actions 工作流
│       ├── build.yml     # 构建工作流（Markdown检查、链接检查）
│       ├── deploy.yml    # 部署工作流（自动发布）
│       └── static.yml    # 静态检查工作流
├── config/               # 自动化排版管线配置
│   ├── pandoc/           # Pandoc配置
│   │   └── README.md     # Pandoc使用说明
│   └── latex/            # LaTeX模板
│       ├── metadata.yml  # 元数据配置
│       └── styles.css    # 样式配置
├── docs/                 # 教材源文档（Markdown）
│   ├── chapters/         # 分章节内容（13章）
│   │   ├── 01-introduction/      # 第1章：简介
│   │   ├── 02-prompt-engineering/ # 第2章：提示词工程
│   │   ├── 03-api-integration/   # 第3章：API集成
│   │   ├── 04-agent-architecture/ # 第4章：Agent架构
│   │   ├── 05-memory-rag/        # 第5章：记忆与RAG
│   │   ├── 06-multimodal/        # 第6章：多模态
│   │   ├── 07-agentscope-core/   # 第7章：AgentScope核心
│   │   ├── 08-multi-agent/       # 第8章：多Agent协作
│   │   ├── 09-security/          # 第9章：安全
│   │   ├── 10-performance/       # 第10章：性能
│   │   ├── 11-deployment/        # 第11章：部署
│   │   ├── 12-documentation/     # 第12章：文档
│   │   └── 13-capstone/          # 第13章：毕业设计
│   ├── Appendix_*.md     # 附录（API对比、模型列表、FAQ等）
│   ├── .vitepress/       # VitePress配置（可选）
│   └── README.md         # docs目录说明
├── scripts/              # 自动化脚本（构建、测试、生成）
├── examples/             # 完整项目案例
│   └── capstone/         # Capstone项目模板
├── LICENSE.md            # 许可证文件
├── README.md             # 项目说明（本文件）
├── PROJECT_README.md     # 项目详细说明
├── BUILD_GUIDE.md        # 构建指南
├── TEACHING_PLAN.md      # 教学计划
└── RELEASE_NOTES.md      # 版本更新日志
```

> 💡 **项目结构说明**
> - 所有章节按 `XX-topic/` 格式组织，便于版本管理和查找
> - `docs/` 目录是主要开发区域，包含全部教材内容
> - `config/` 目录包含自动化排版管线配置，支持 PDF/EPUB/HTML 输出

---

## 🛠️ 使用说明

### 编译为PDF/EPUB/HTML

本项目使用 **Pandoc + LaTeX** 实现自动化排版：

```bash
# 安装依赖（Windows）
# 1. 安装 Pandoc (https://pandoc.org/installing.html)
# 2. 安装 TeX Live (https://www.tug.org/texlive/)

# 编译PDF（示例：编译第1章第1节）
pandoc docs/chapters/01-introduction/1.1-why-need.md \
  --from=markdown \
  --to=pdf \
  --output=dist/Chapter1-Section1.pdf \
  --pdf-engine=xelatex \
  --metadata-file=config/latex/metadata.yml \
  --css=config/latex/styles.css

# 编译EPUB（示例：编译第1章所有分节文件）
pandoc docs/chapters/01-introduction/*.md \
  --from=markdown \
  --to=epub3 \
  --output=dist/Textbook.epub
```

### 自动化CI/CD（可选）

项目预留 `.github/workflows/` 目录，可集成 GitHub Actions 实现：
- Markdown语法检查
- 链接健康检查
- 自动编译PDF/EPUB并发布

---

## 🎯 课程信息

| 项目 | 内容 |
|------|------|
| **学时** | 48学时（3学分） |
| **前置知识** | Java基础、数据结构 |
| **核心框架** | AgentScope-Java v0.2.0 |
| **毕业要求** | 独立开发含工具调用、记忆管理、多Agent协作的企业级AI应用 |

### 课程目录

详见 `docs/TABLE_OF_CONTENTS.md`

---

## 📝 贡献指南

本项目采用协作开发模式：

1. **提示词生成**：使用标准化模板生成章节初稿
2. **人工校验**：逐字逐句修订，确保专业性与教学性
3. **排版输出**：自动化管线生成多种格式

### 贡献流程

```bash
# 1. Fork本仓库
# 2. 创建分支
git checkout -b feature/chapter5

# 3. 提交修改（需通过Markdown Lint检查）
npm run lint

# 4. 发起PR
```

---

## 📄 许可证

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证。

- ✅ 允许非商业使用、演绎、分享，只要署名并以相同许可证共享
- ❌ 禁止商业用途（如出售教材）

---

## 🙏 致谢

- AgentScope-Java团队提供技术参照
- 本科计算机专业师生提供教学反馈

---

## 📞 联系方式

如有问题或建议，欢迎在 GitHub Issues 中反馈。

---

> 本项目仍在开发中，当前版本：v0.1.0-alpha  
> 预计完成时间：2026-Q3
