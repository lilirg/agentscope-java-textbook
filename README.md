# 教材源文档（Markdown格式）

> 本目录存放教材的原始源文档，采用Markdown格式，支持自动化排版

## 目录结构

```
chapters/                # 教材章节（13章）
  ├── 01-intro.md       # 第1章：认识AI Agent
  ├── 02-prompting.md   # 第2章：提示词工程与LLM API接入
  ├── 03-api-practice.md# 第3章：本地与云端API接入实践
  ├── 04-agent-architecture.md
  ├── 05-memory-rag.md
  ├── 06-multimodal.md
  ├── 07-agentscope-core.md
  ├── 08-multi-agent.md
  ├── 09-security.md
  ├── 10-evaluation.md
  ├── 11-deployment-monitoring.md
  ├── 12-documentation.md
  └── 13-capstone.md
```

## 自动化排版管线

### 编译为PDF

```bash
pandoc chapters/01-intro.md \
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
