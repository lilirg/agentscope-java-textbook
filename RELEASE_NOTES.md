# v0.1.0-alpha Release Notes

> 📅 发布日期：2026-04-17  
> 🎯 目标：本科计算机专业AI应用开发课程教材（48学时）

---

## 🚀 首个预发行版本

这是本教材的第一个预发行版本（Alpha），提供完整的教学大纲、教材源文档和示例代码，供教师和学生试用反馈。

---

## ✨ 主要功能

### 📚 教材内容（13章）

| 章节 | 标题 | 学时 | 状态 |
|------|------|------|------|
| 第1章 | 认识AI Agent | 2 | ✅ 已完成 |
| 第2章 | 提示词工程与LLM API接入 | 2 | ✅ 已完成 |
| 第3章 | 本地与云端API接入实践 | 4 | ✅ 已完成 |
| 第4章 | Agent架构与工具调用 | 2 | ✅ 已完成 |
| 第5章 | 记忆系统与RAG集成 | 4 | ✅ 已完成 |
| 第6章 | 多模态输入处理 | 4 | ✅ 已完成 |
| 第7章 | AgentScope-Java核心模块分析 | 4 | ✅ 已完成 |
| 第8章 | 多Agent协作系统 | 4 | ✅ 已完成 |
| 第9章 | 安全与权限控制 | 4 | ✅ 已完成 |
| 第10章 | Agent评测与优化 | 4 | ✅ 已完成 |
| 第11章 | 部署与监控 | 4 | ✅ 已完成 |
| 第12章 | 文档化与协作规范 | 2 | ✅ 已完成 |
| 第13章 | Capstone项目 | 2 | ✅ 已完成 |

### 🛠️ 自动化排版管线

- **Pandoc配置**：支持PDF/EPUB/HTML编译  
- **LaTeX样式**：专业教材排版（A4/US Letter）  
- **自动目录**：自动生成带编号的TOC  

### 📁 项目结构

```
agentscope-java-textbook/
├── docs/                          # 教材源文档
│   ├── chapters/                 # 13章内容（Markdown）
│   └── TABLE_OF_CONTENTS.md      # 课程目录
├── src/                           # 示例代码（Java）
│   └── chapter4/AgentImplementation.java
├── config/                        # 自动化排版配置
│   ├── pandoc/README.md
│   └── latex/
│       ├── metadata.yml
│       └── styles.css
├── README.md                      # 项目总览
├── BUILD_GUIDE.md                 # 构建指南
├── TEACHING_PLAN.md              # 教师用教学计划
└── LICENSE.md                     # CC BY-NC-SA 4.0
```

---

## 🔧 技术栈

| 类型 | 技术 | 说明 |
|------|------|------|
| **开发语言** | Java 17 | Agent应用开发 |
| **框架** | Spring Boot 3.x | Web应用框架 |
| **Agent引擎** | AgentScope-Java v0.2.0 | Agent核心引擎 |
| **文档工具** | Pandoc + LaTeX | 自动化排版 |
| **测试** | JUnit + JMH + Mockito | 单元测试 + 性能测试 |

---

## ⚠️ 已知问题

1. **网络限制**：部分API调用可能受网络限制（建议使用本地模型）  
2. **文档格式**：PDF编译需安装TeX Live（可选，HTML/EPUB无需安装）  
3. **版本依赖**：AgentScope-Java v0.2.0为预发布版本，后续可能有API变更  

---

## 🎯 下一步计划

| 版本 | 计划时间 | 主要内容 |
|------|---------|---------|
| v0.2.0 | 2026-05 | 补充附录（API对比、模型列表） + 示例代码增强 |
| v1.0.0 | 2026-07 | 完整教材终版 + GitHub Pages部署 |
| v1.1.0 | 2026-08 | 更新AgentScope-Java兼容性 + 新增案例 |

---

## 🤝 贡献指南

欢迎参与本项目！

### 贡献方式

1. **提交Issue**：报告问题或建议  
2. **提交PR**：改进教材内容或代码  
3. **试用反馈**：使用教材并提供反馈  

### 贡献流程

```bash
# 1. Fork本仓库
# 2. 创建分支
git checkout -b feature/xxx

# 3. 提交修改
git commit -m "Add feature: xxx"

# 4. 推送
git push origin feature/xxx

# 5. 发起PR
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
- 所有试用者和贡献者  

---

## 📞 联系方式

- GitHub Issues：https://github.com/lilirg/agentscope-java-textbook/issues  
- 邮箱：（教师联系方式，待补充）

---

> 版本：v0.1.0-alpha  
> 发布日期：2026-04-17  
> 状态：预发行版本（Alpha）
