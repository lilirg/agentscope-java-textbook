# 第12章：文档化与协作规范

> 教材完整内容（草稿 v1.8.0）

---

## 章节目录

| 节号 | 标题 | 学时 | 内容要点 |
|------|------|------|---------|
| 12.1 | 为什么需要本节技术？（现实场景引入） | 0.5 | 文档缺失、协作混乱、管理混乱 |
| 12.2 | 工具链与资源准备 | 0.5 | Git、Markdown、API文档、Scrum、Jira、CI/CD |
| 12.3 | 核心概念 | 1.0 | README、API文档、Git工作流、代码审查、Scrum、Jira、CI/CD |
| 12.4 | 最小可运行示例 | 1.5 | 项目结构、README、API文档、Git配置、CI/CD配置 |
| 12.5 | 常见陷阱与调试技巧 | 1.0 | README缺失、Git工作流混乱、Jira任务管理混乱、CI/CD失败 |
| 12.6 | 课后练习 | 1.0 | 填空、改错、设计、挑战 |
| 12.7 | 本章小结与延伸阅读 | 0.5 | 知识树、延伸阅读推荐 |

**总学时**：4学时（对应课程总学时48学时）

---

## 为什么需要本节技术？（现实场景引入）

> **学习目标**：理解文档化与协作规范的必要性

### 场景1：项目文档缺失导致协作困难

| 问题 | 解决方案 |
|------|---------|
| 文档缺失 | 完善的文档化体系（README、API文档、注释） |

### 场景2：代码协作混乱

| 问题 | 解决方案 |
|------|---------|
| 协作混乱 | Git工作流（Feature Branch）、代码审查、提交规范 |

### 场景3：项目管理混乱

| 问题 | 解决方案 |
|------|---------|
| 管理混乱 | 敏捷开发（Scrum）+ Jira项目管理 |

### 小结与思考题

- 问题1：为什么需要完善的文档化体系？  
- 问题2：Git工作流的核心原则是什么？  
- 问题3：敏捷开发与传统开发的区别是什么？

---

## 工具链与资源准备

> **学习目标**：掌握文档化与协作规范开发所需的完整工具链配置

### 开发环境

| 工具 | 版本 | 获取路径 |
|------|------|---------|
| JDK | ≥17 | Adoptium |
| Git | ≥2.40 | Git官网 |
| IDE | IntelliJ IDEA | JetBrains |

### 文档化工具

| 工具 | 获取路径 | 说明 |
|------|---------|------|
| Markdown | - | README编写 |
| MkDocs | mkdocs.org | 文档站点生成 |
| Swagger | swagger.io | REST API文档生成 |

### 协作规范工具

| 工具 | 获取路径 | 说明 |
|------|---------|------|
| Git Flow | Git插件 | 分支管理 |
| Conventional Commits | - | 提交规范 |

---

## 核心概念

> **学习目标**：掌握文档化与协作规范的核心原理

### Agent文档化

| 特性 | 实现要点 |
|------|---------|
| README编写 | 项目入口文档 |
| API文档生成 | 接口说明书 |
| 代码注释规范 | 代码说明书 |

### 协作规范

| 特性 | 实现要点 |
|------|---------|
| Git工作流 | Feature Branch |
| 代码审查 | PR审查 |
| 提交规范 | Conventional Commits |

### 项目管理

| 特性 | 实现要点 |
|------|---------|
| 敏捷开发（Scrum） | 迭代开发 |
| Jira项目管理 | Issue + Board + Workflow |

### CI/CD

| 特性 | 实现要点 |
|------|---------|
| 持续集成（CI） | 构建、测试、检查 |
| 持续部署（CD） | 推送Docker镜像、部署到K8s |

---

## 最小可运行示例

> **学习目标**：实现完整的文档化与协作系统

### 项目结构

```
agent-project/
├── docs/
│   ├── README.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── CONTRIBUTING.md
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── cd.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── issue-templates/
│       ├── bug.md
│       └── feature.md
├── .gitignore
└── pom.xml
```

### 关键代码

**README.md**：项目入口文档  
**API.md**：API文档  
**.gitignore**：Git忽略配置  
**ci.yml/cd.yml**：CI/CD配置

---

## 常见陷阱与调试技巧

> **学习目标**：掌握典型问题与解决方案

### Agent文档化

| 问题 | 解决方案 |
|------|---------|
| README缺失 | 创建README、完善内容 |
| API文档不完整 | 生成API文档、手动编写、定期更新 |

### 协作规范

| 问题 | 解决方案 |
|------|---------|
| Git工作流混乱 | Feature Branch、PR审查、Conventional Commits |
| 代码审查缺失 | 强制PR、审查清单、审查反馈 |

---

## 课后练习

> **学习目标**：通过实践巩固本章知识

### 基础填空（20分）

1. Agent文档化方式（README/API文档/代码注释）  
2. Git工作流原则（Feature Branch/代码审查/提交规范）  
3. Scrum活动（Sprint/Daily Scrum/Sprint Planning/Sprint Review/Sprint Retrospective）  
4. CI/CD流程（持续集成/持续部署）

### 代码改错（30分）

1. README缺失错误  
2. Git工作流混乱错误

### 小型设计（30分）

设计README文档

### 拓展挑战（20分）

1. CI/CD流程配置  
2. Jira项目管理配置

---

## 本章小结与延伸阅读

> **学习目标**：回顾核心知识，拓展学习方向

### 知识树

```
文档化与协作规范（Chapter 12）
├── Agent文档化
├── 协作规范
├── 项目管理
└── CI/CD
```

### 延伸阅读

| 文档 | 链接 |
|------|------|
| Git | [git-scm.com/book](https://git-scm.com/book) |
| Markdown | [markdownguide.org](https://www.markdownguide.org/) |
| Scrum | [scrum.org](https://www.scrum.org/) |

---

> 版本：v1.8.0-alpha  
> 更新日期：2026-04-17  
> 学时：4学时
