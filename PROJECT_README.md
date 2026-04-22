# README for agentscope-java-textbook

> 本项目为《AI应用开发：从零到AgentScope-Java实战》教材源码库

---

## 项目介绍

本教材面向本科计算机专业学生，采用**分阶段提示词工作流 + 人工校验 + 自动化排版管线**的生产模式，目标是产出高质量、可交付的本科教材。

### 核心特征

| 特征 | 说明 |
|------|------|
| **零基础起点** | 学生仅需Java基础与数据结构知识 |
| **企业级终点** | 能独立开发含工具调用、记忆管理、多Agent协作的企业级AI应用 |
| **框架中立** | 以AgentScope-Java为参照，但强调通用设计思想 |
| **工程化导向** | 覆盖开发→测试→部署→监控全链路 |

---

## 目录结构

```
agentscope-java-textbook/
├── README.md                      # 本文件
├── BUILD_GUIDE.md                 # 构建与运行指南
├── .gitignore                     # Git忽略配置
├── src/                           # 示例代码（Java）
│   └── chapter4/
│       └── AgentImplementation.java
├── docs/                          # 教材源文档
│   ├── README.md                  # docs目录说明
│   ├── chapters/                  # 分章节内容（13章）
│   │   ├── 01-intro.md
│   │   ├── 02-prompting.md
│   │   ├── 03-api-practice.md
│   │   ├── 04-agent-architecture.md
│   │   ├── 05-memory-rag.md
│   │   ├── 06-multimodal.md
│   │   ├── 07-agentscope-core.md
│   │   ├── 08-multi-agent.md
│   │   ├── 09-security.md
│   │   ├── 10-evaluation.md
│   │   ├── 11-deployment-monitoring.md
│   │   ├── 12-documentation.md
│   │   └── 13-capstone.md
│   └── TABLE_OF_CONTENTS.md       # 课程目录
└── config/                        # 自动化排版配置（待创建）
    ├── pandoc/
    └── latex/
```

---

## 快速开始

### 1. 克隆项目

```bash
cd E:\github\agentscope-java-textbook
```

### 2. 构建项目（Java部分）

```bash
mvn clean compile
```

### 3. 编译教材（Markdown部分）

```bash
# 安装Pandoc和TeX Live（参考BUILD_GUIDE.md）
# 编译PDF
pandoc docs/chapters/01-introduction/1.1-why-need.md --from=markdown --to=pdf --output=dist/Chapter1.pdf
```

---

## 使用说明

### 作为学生

1. 阅读`docs/chapters/`下的章节  
2. 运行`src/`下的示例代码  
3. 完成章节末尾的考核题  

### 作为教师

1. 使用`docs/TABLE_OF_CONTENTS.md`作为教学计划  
2. 根据学生水平调整`src/`代码难度  
3. 使用`docs/chapters/13-capstone.md`布置Capstone项目  

### 作为开发者

1. 遵循`docs/`中的Markdown规范  
2. 使用`BUILD_GUIDE.md`中的命令编译  
3. 保持`src/`代码质量（测试覆盖率 ≥ 80%）  

---

## 课程信息

| 项目 | 内容 |
|------|------|
| **学时** | 48学时（3学分） |
| **前置知识** | Java基础、数据结构 |
| **核心框架** | AgentScope-Java v0.2.0 |
| **毕业要求** | 独立开发含工具调用、记忆管理、多Agent协作的企业级AI应用 |

---

## 贡献指南

### 1. Fork本仓库

### 2. 创建分支

```bash
git checkout -b feature/chapterX
```

### 3. 开发并提交

```bash
git add .
git commit -m "Add chapter X"
git push origin feature/chapterX
```

### 4. 发起PR

---

## 许可证

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证。

- ✅ 允许非商业使用、演绎、分享，只要署名并以相同许可证共享  
- ❌ 禁止商业用途（如出售教材）  

---

## 致谢

- AgentScope-Java团队提供技术参照  
- 本科计算机专业师生提供教学反馈  

---

## 联系方式

如有问题或建议，欢迎在 GitHub Issues 中反馈。

---

> 本项目仍在开发中，当前版本：v0.1.0-alpha  
> 预计完成时间：2026-Q3
