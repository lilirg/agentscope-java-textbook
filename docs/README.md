# 教材源文档（Markdown格式）

> 本目录存放教材的原始源文档，采用Markdown格式，支持自动化排版

## 目录结构

```
chapters/                # 教材章节（13章）
  ├── 01-introduction/    # 第1章：认识AI Agent
  ├── 02-prompt-engineering/  # 第2章：提示词工程与LLM API接入
  ├── 03-api-integration/  # 第3章：本地与云端API接入实践
  ├── 04-agent-architecture/  # 第4章：Agent架构设计
  ├── 05-memory-rag/  # 第5章：记忆与RAG
  ├── 06-multimodal/  # 第6章：多模态
  ├── 07-agentscope-core/  # 第7章：AgentScope-Java核心模块
  ├── 08-multi-agent/  # 第8章：多Agent协作
  ├── 09-security/  # 第9章：安全与防护
  ├── 10-performance/  # 第10章：性能优化
  ├── 11-deployment/  # 第11章：部署与监控
  ├── 12-documentation/  # 第12章：文档与规范
  └── 13-capstone/  # 第13章：Capstone项目
```

## 自动化排版管线

### 编译为PDF

```bash
pandoc chapters/01-introduction/1.1-why-need.md \
  --from=markdown \
  --to=pdf \
  --output=dist/Chapter1.pdf \
  --pdf-engine=xelatex \
  --metadata-file=config/latex/metadata.yml \
  --css=config/latex/styles.css
```

### 编译为EPUB

```bash
pandoc chapters/*.md \
  --from=markdown \
  --to=epub3 \
  --output=dist/Textbook.epub
```

### 编译为HTML

```bash
pandoc chapters/*.md \
  --from=markdown \
  --to=html \
  --output=dist/Textbook.html \
  --standalone
```

## 贡献指南

1. 使用标准Markdown语法  
2. 每章以`# 第X章`开头  
3. 代码块标注语言（如`java`）  
4. 附带图表使用Mermaid语法  

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
