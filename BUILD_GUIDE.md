# 项目构建与运行指南

> 本项目使用Maven构建，基于Spring Boot 3.x

---

## 1. 环境要求

| 工具 | 版本 | 下载 |
|------|------|------|
| **JDK** | 17+ | https://adoptium.net |
| **Maven** | 3.8+ | https://maven.apache.org/download.cgi |
| **Git** | 最新版 | https://git-scm.com/downloads |

---

## 2. 项目结构

```
agentscope-java-textbook/
├── pom.xml                      # Maven配置
├── src/                         # 源代码
│   ├── main/
│   │   └── java/
│   │       └── com/textbook/
│   │           ├── chapter2/    # 第2章示例（提示词工程）
│   │           ├── chapter3/    # 第3章示例（API接入）
│   │           └── chapter4/    # 第4章示例（Agent架构）
│   └── test/                    # 单元测试
├── docs/                        # 教材源文档
│   ├── chapters/               # 分章节内容
│   └── Appendices/             # 附录
└── config/                      # 自动化排版配置
```

---

## 3. 构建项目

### 3.1 初始化项目

```bash
# 克隆项目（如果你有Git仓库）
git clone https://github.com/your-repo/agentscope-java-textbook.git
cd agentscope-java-textbook

# 或直接使用本目录
cd E:\github\agentscope-java-textbook
```

### 3.2 编译项目

```bash
# 清理旧构建
mvn clean

# 编译项目
mvn compile

# 运行单元测试
mvn test

# 打包JAR
mvn package
```

---

## 4. 运行示例代码

### 4.1 第2章：提示词工程

```bash
cd src/main/java/com/textbook/chapter2
javac -cp ".;$(mvn dependency:build-classpath -q -DincludeScope=compile -Dmdep.outputFile=/dev/stdout)" WeatherAPI.java
java -cp ".;$(mvn dependency:build-classpath -q -DincludeScope=compile -Dmdep.outputFile=/dev/stdout)" WeatherAPI
```

### 4.2 第4章：Agent架构

```bash
# 启动Spring Boot应用
cd agentscope-java-textbook
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8080"
```

访问：`http://localhost:8080/agent/process`

---

## 5. 编译教材（PDF/EPUB/HTML）

### 5.1 安装依赖

| 工具 | 下载 | 说明 |
|------|------|------|
| **Pandoc** | https://pandoc.org/installing.html | 文档转换 |
| **TeX Live** | https://www.tug.org/texlive/ | PDF渲染 |
| **Calibre** | https://calibre-ebook.com/download | EPUB生成 |

### 5.2 编译PDF

```bash
# Windows
pandoc docs/chapters/01-introduction/1.1-why-need.md ^
  --from=markdown ^
  --to=pdf ^
  --output=dist/Chapter1.pdf ^
  --pdf-engine=xelatex ^
  --metadata-file=config/latex/metadata.yml ^
  --css=config/latex/styles.css
```

### 5.3 编译EPUB

```bash
pandoc docs/chapters/*.md ^
  --from=markdown ^
  --to=epub3 ^
  --output=dist/Textbook.epub
```

### 5.4 编译HTML

```bash
pandoc docs/chapters/*.md ^
  --from=markdown ^
  --to=html ^
  --output=dist/Textbook.html ^
  --standalone
```

---

## 6. 常见问题

### Q1: Maven编译报错"无法找到符号"

**原因**：依赖未下载

**解决**：
```bash
mvn dependency:resolve
```

### Q2: PDF编译失败"找不到xelatex"

**原因**：TeX Live未安装

**解决**：安装TeX Live并配置PATH

### Q3: API调用超时

**原因**：网络延迟或API配额

**解决**：
1. 检查API密钥有效性
2. 增加重试次数
3. 使用本地模型替代

---

## 7. 贡献指南

### 7.1 开发流程

```bash
# 1. Fork本仓库
# 2. 创建分支
git checkout -b feature/chapter5

# 3. 开发并提交
git add .
git commit -m "Add chapter 5"

# 4. 推送
git push origin feature/chapter5

# 5. 发起PR
```

### 7.2 代码规范

- 使用Google Java Format
- 方法注释遵循Javadoc规范
- 单元测试覆盖率 ≥ 80%

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
