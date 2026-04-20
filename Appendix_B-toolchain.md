---
title: 工具链速查表
chapter: Appendix B
keywords: toolchain, quick reference, jdk, ide, maven, git, api, environment
version: B.0
---

# 附录B：工具链速查表

> 本附录提供Agent开发相关工具链的快速参考，方便开发过程中查阅

---

## B.1 开发环境工具

| 工具 | 版本要求 | 获取路径 | 用途 | 注意事项 |
|------|---------|---------|------|---------|
| **JDK** | ≥17 | [Adoptium](https://adoptium.net) / `sdk install java 17-tem` | Java编译与运行环境 | 检查版本：`java -version` |
| **IDE** | ≥2023.1 | [JetBrains](https://www.jetbrains.com/idea/download) | 代码编辑与调试 | 推荐IntelliJ IDEA |
| **Maven** | ≥3.8 | [Maven官网](https://maven.apache.org/download.cgi) | Java依赖管理 | 检查版本：`mvn -version` |
| **Git** | ≥2.30 | [Git官网](https://git-scm.com/download) | 版本控制 | 检查版本：`git --version` |

---

## B.2 API Key与配额

| 工具 | 版本要求 | 获取成本 | 获取路径 | 用途 | 是否必需 |
|------|---------|---------|---------|------|---------|
| **OpenAI API Key** | 最新版 | 按调用收费（¥0.6/百万tokens） | [OpenAI Platform](https://platform.openai.com/api-keys) | 云端LLM调用（GPT-4/Claude） | ⚠️ 可选（推荐教育优惠） |
| **通义千问API Key** | 最新版 | 按调用收费（¥2.4/百万tokens） | [阿里云百炼](https://bailian.console.aliyun.com/api-key) | 云端LLM调用（qwen-max） | ⚠️ 可选（教育优惠：¥100/年额度） |
| **Ollama** | ≥0.1.0 | 免费 | `curl -fsSL https://ollama.com/install.sh \| sh` | 本地LLM运行（Qwen2/Llama3） | ✅ 推荐（本地开发） |
| **vLLM** | ≥0.2.0 | 免费 | `pip install vllm` | 本地LLM高性能服务 | ✅ 推荐（生产环境） |

---

## B.3 依赖清单（Maven）

| 库名 | Maven坐标 | 版本 | 用途 | 官方文档URL |
|-----|----------|------|------|------------|
| **agentscope-java-spring** | `com.alibaba.agentscope:agentscope-spring` | `0.2.0` | Agent框架集成 | [agentscope.io](https://agentscope.io) |
| **Chroma Java Client** | `io.chroma:chroma-java-client` | `0.1.0` | 向量数据库客户端 | [trychroma.com](https://docs.trychroma.com) |
| **Sentence Transformers** | `org.allenai.sbert:all-minilm-l6-v2` | `2.2.0` | 文本向量化 | [sbert.net](https://www.sbert.net) |
| **Spring Boot Starter** | `org.springframework.boot:spring-boot-starter` | `3.2.0` | Spring Boot核心 | [spring.io](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle) |
| **Jackson** | `com.fasterxml.jackson.core:jackson-databind` | `2.15.0` | JSON序列化 | [fasterxml.com](https://github.com/FasterXML/jackson) |
| **Mockito** | `org.mockito:mockito-core` | `5.8.0` | 单元测试Mock | [mockito.org](https://site.mockito.org) |
| **dotenv-java** | `io.github.cdimascio:dotenv-java` | `3.0.0` | 加载.env文件 | [GitHub](https://github.com/cdimascio/dotenv-java) |
| **SLF4J** | `org.slf4j:slf4j-api` | `2.0.13` | 日志接口 | [slf4j.org](https://www.slf4j.org) |
| **Logback** | `ch.qos.logback:logback-classic` | `1.5.6` | 日志实现 | [logback.qos.ch](https://logback.qos.ch) |

---

## B.4 调试与观测工具

| 工具 | 版本要求 | 获取成本 | 获取路径 | 用途 | 是否必需 |
|------|---------|---------|---------|------|---------|
| **SLF4J + Logback** | ≥1.7 | 免费 | `org.slf4j:slf4j-api` + `ch.qos.logback:logback-classic` | 日志记录与查看 | ✅ 必需 |
| **JMH** | ≥1.35 | 免费 | `org.openjdk.jmh:jmh-core` | 性能基准测试 | ✅ 推荐 |
| **Postman** | 最新版 | 免费（基本版） | [postman.com](https://www.postman.com/downloads) | HTTP请求抓包 | ✅ 推荐 |
| **Mockito** | ≥5.0 | 免费 | `org.mockito:mockito-core` | Mock外部依赖 | ✅ 必需 |
| **JProfiler** | 最新版 | 商业版 | [ej-technologies.com](https://www.ej-technologies.com/products/jprofiler/overview.html) | JVM性能分析 | ✅ 推荐 |
| **YourKit** | 最新版 | 商业版 | [yourkit.com](https://www.yourkit.com) | JVM性能分析 | ✅ 推荐 |

---

## B.5 容器与部署工具

| 工具 | 版本要求 | 获取成本 | 获取路径 | 用途 | 是否必需 |
|------|---------|---------|---------|------|---------|
| **Docker** | ≥20.10 | 免费（社区版） | [Docker官网](https://docs.docker.com/get-docker) | 容器化部署 | ✅ 推荐 |
| **Kubernetes** | ≥1.24 | 免费 | [Kubernetes官网](https://kubernetes.io/docs/setup/) | 容器编排 | ✅ 推荐 |
| **Helm** | ≥3.0 | 免费 | [Helm官网](https://helm.sh/docs/intro/install/) | Kubernetes包管理 | ✅ 推荐 |
| **Prometheus** | ≥2.0 | 免费 | [Prometheus官网](https://prometheus.io/docs/introduction/install/) | 监控系统 | ✅ 推荐 |
| **Grafana** | ≥8.0 | 免费 | [Grafana官网](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) | 可视化监控 | ✅ 推荐 |

---

## B.6 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `java -version` | 检查JDK版本 | `java -version` |
| `mvn -version` | 检查Maven版本 | `mvn -version` |
| `git --version` | 检查Git版本 | `git --version` |
| `ollama serve` | 启动Ollama本地LLM | `ollama serve` |
| `docker run -p 8000:8000 chromadb/chroma:latest` | 启动Chroma向量数据库 | `docker run -p 8000:8000 chromadb/chroma:latest` |
| `docker run -p 6379:6379 redis:7-alpine` | 启动Redis缓存 | `docker run -p 6379:6379 redis:7-alpine` |
| `docker build -t ai-app:latest .` | 构建Docker镜像 | `docker build -t ai-app:latest .` |
| `kubectl apply -f deployment.yaml` | 部署到Kubernetes | `kubectl apply -f deployment.yaml` |

---

## B.7 常用工具命令速查

### B.7.1 JDK命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `javac` | 编译Java代码 | `javac -d target/classes src/main/java/*.java` |
| `java` | 运行Java程序 | `java -jar target/app.jar` |
| `javadoc` | 生成Java文档 | `javadoc -d docs src/main/java/*.java` |
| `jdb` | Java调试器 | `jdb -attach 5005` |

### B.7.2 Maven命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `mvn clean` | 清理项目 | `mvn clean` |
| `mvn compile` | 编译项目 | `mvn compile` |
| `mvn test` | 运行测试 | `mvn test` |
| `mvn package` | 打包项目 | `mvn package` |
| `mvn install` | 安装到本地仓库 | `mvn install` |
| `mvn dependency:tree` | 查看依赖树 | `mvn dependency:tree` |

### B.7.3 Git命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `git config` | 配置Git | `git config --global user.name "Your Name"` |
| `git clone` | 克隆仓库 | `git clone https://github.com/user/repo.git` |
| `git add` | 添加文件 | `git add src/main/java/*.java` |
| `git commit` | 提交更改 | `git commit -m "Add feature X"` |
| `git push` | 推送更改 | `git push origin main` |

### B.7.4 Docker命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `docker build` | 构建镜像 | `docker build -t ai-app:latest .` |
| `docker run` | 运行容器 | `docker run -p 8080:8080 ai-app:latest` |
| `docker ps` | 列出运行中的容器 | `docker ps` |
| `docker logs` | 查看容器日志 | `docker logs container_id` |
| `docker stop` | 停止容器 | `docker stop container_id` |

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-20  
> 作者：AI Agent（FMzx7o）
