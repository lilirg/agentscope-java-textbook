# Pandoc配置文件

> 本目录存放Pandoc编译配置

---

## 1. 编译命令

### 编译PDF

```bash
pandoc chapters/01-intro.md \
  --from=markdown \
  --to=pdf \
  --output=dist/Chapter1.pdf \
  --pdf-engine=xelatex \
  --metadata-file=config/latex/metadata.yml \
  --css=config/latex/styles.css \
  --toc \
  --toc-depth=2 \
  --number-sections
```

### 编译EPUB

```bash
pandoc chapters/*.md \
  --from=markdown \
  --to=epub3 \
  --output=dist/Textbook.epub \
  --metadata-file=config/latex/metadata.yml \
  --toc \
  --toc-depth=2
```

### 编译HTML

```bash
pandoc chapters/*.md \
  --from=markdown \
  --to=html \
  --output=dist/Textbook.html \
  --metadata-file=config/latex/metadata.yml \
  --toc \
  --toc-depth=2 \
  --standalone \
  --css=config/latex/styles.css
```

---

## 2. 配置说明

### metadata.yml

```yaml
title: AI应用开发：从零到AgentScope-Java实战
author: 超级教材写手
date: 2026-04-17
version: v0.1.0-alpha
lang: zh-CN
 toc: true
 toc-depth: 2
 number-sections: true
```

### styles.css

```css
/* 标题样式 */
h1 { font-size: 24pt; font-weight: bold; }
h2 { font-size: 18pt; font-weight: bold; margin-top: 24pt; }
h3 { font-size: 14pt; font-weight: bold; margin-top: 18pt; }

/* 段落样式 */
p { font-size: 12pt; line-height: 1.5; margin-bottom: 12pt; }

/* 代码块样式 */
code {
  font-family: 'Courier New', monospace;
  background-color: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
}

/* 表格样式 */
table {
  border-collapse: collapse;
  width: 100%;
}
table, th, td {
  border: 1px solid #ddd;
}
th, td {
  padding: 12px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
  font-weight: bold;
}
```

---

## 3. 常用Pandoc选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `--from` | 输入格式 | `markdown` |
| `--to` | 输出格式 | `pdf`/`epub3`/`html` |
| `--output` | 输出文件 | `dist/Chapter1.pdf` |
| `--pdf-engine` | PDF引擎 | `xelatex` |
| `--metadata-file` | 元数据文件 | `config/latex/metadata.yml` |
| `--css` | CSS样式 | `config/latex/styles.css` |
| `--toc` | 生成目录 | `true` |
| `--toc-depth` | 目录深度 | `2` |
| `--number-sections` | 编号章节 | `true` |

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
