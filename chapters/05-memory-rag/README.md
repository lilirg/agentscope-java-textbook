# 第5章：记忆系统与RAG集成

> 教材完整内容（草稿 v0.1.0）

---

## 章节目录

| 节号 | 标题 | 学时 | 内容要点 |
|------|------|------|---------|
| 5.1 | 为什么需要本节技术？（现实场景引入） | 0.5 | 短期/长期记忆缺失的3个典型场景 |
| 5.2 | 工具链与资源准备 | 0.5 | JDK、IDE、Maven、API Key、Chroma等 |
| 5.3 | 核心概念 | 1.0 | 短期记忆、长期记忆、RAG的原理与数据结构 |
| 5.4 | 最小可运行示例 | 1.5 | 完整代码（ShortTermMemory、LongTermMemory、RAG） |
| 5.5 | 常见陷阱与调试技巧 | 1.0 | 上下文溢出、JSON序列化、Chroma超时等 |
| 5.6 | 课后练习 | 1.0 | 填空、改错、设计、挑战 |
| 5.7 | 本章小结与延伸阅读 | 0.5 | 知识树、延伸阅读推荐 |

**总学时**：4学时（对应课程总学时48学时）

---

## 5.1 为什么需要本节技术？（现实场景引入）

> **学习目标**：理解记忆系统设计的必要性

### 5.1.1 场景1：用户多轮对话时的上下文丢失

| 问题 | 解决方案 |
|------|---------|
| 对话超过3轮，任务完成率下降42% | 短期记忆：固定窗口20条 |

### 5.1.2 场景2：用户偏好无法沉淀

| 问题 | 解决方案 |
|------|---------|
| 每次需重新输入10+字段 | 长期记忆：JSON持久化 + Redis缓存 |

### 5.1.3 场景3：知识库检索效率低下

| 问题 | 解决方案 |
|------|---------|
| LLM知识有截止日期 | RAG：实时检索用户私有知识库 |

### 5.1.4 小结与思考题

- 问题1：为什么说"LLM有记忆"是误解？
- 问题2：如果用户对话超过100轮，如何设计短期记忆？
- 问题3：RAG与传统全文检索的区别是什么？

---

## 5.2 工具链与资源准备

> **学习目标**：掌握记忆系统开发所需的完整工具链配置

### 5.2.1 开发环境（JDK、IDE、Maven、Git）

| 工具 | 版本 | 获取路径 |
|------|------|---------|
| JDK | ≥17 | Adoptium |
| IDE | IntelliJ/Eclipse | JetBrains |
| Maven | ≥3.8 | Maven官网 |
| Git | ≥2.30 | Git官网 |

### 5.2.2 密钥与配额（OpenAI、通义千问、Ollama）

| 工具 | 获取路径 | 教育优惠 |
|------|---------|---------|
| OpenAI API | platform.openai.com | ¥0.6/百万tokens |
| 通义千问 | bailian.console.aliyun.com | ¥100/年额度 |
| Ollama | ollama.com | 免费（本地资源） |

### 5.2.3 依赖清单（Maven）

| 库名 | Maven坐标 | 版本 |
|------|----------|------|
| agentscope-java-spring | `com.alibaba.agentscope:agentscope-spring` | `0.2.0` |
| Chroma Java Client | `io.github.trychroma:chroma-java-client` | `0.1.0` |
| Sentence Transformers | `org.allenai.sbert:all-minilm-l6-v2` | `2.2.0` |

### 5.2.4 安全规范（禁止硬编码Key）

- ✅ 使用`.env` + `dotenv-java`  
- ✅ 使用`System.getenv()`  
- ❌ 禁止硬编码：`String key = "sk-xxx"`

---

## 5.3 核心概念

> **学习目标**：掌握短期记忆、长期记忆与RAG的核心原理

### 5.3.1 短期记忆（Short-Term Memory）

| 特性 | 说明 |
|------|------|
| 数据结构 | `LinkedList` |
| 策略 | 固定窗口（20条） + FIFO |
| 优化 | 摘要压缩、窗口调整 |

### 5.3.2 长期记忆（Long-Term Memory）

| 特性 | 说明 |
|------|------|
| 数据格式 | JSON |
| 缓存 | Redis（毫秒级） |
| 持久化 | 文件（断电不丢失） |

### 5.3.3 RAG（Retrieval-Augmented Generation）

| 步骤 | 说明 |
|------|------|
| 向量化 | Sentence Transformer |
| 检索 | Chroma（向量数据库） |
| 相似度 | 余弦相似度 |

---

## 5.4 最小可运行示例

> **学习目标**：实现包含短期记忆、长期记忆与RAG的完整Agent系统

### 5.4.1 项目结构

```
memory-system/
├── src/main/java/com/textbook/chapter5/
│   ├── AgentWithMemory.java
│   ├── ShortTermMemory.java
│   ├── LongTermMemory.java
│   ├── RAGRepository.java
│   ├── ConfigLoader.java
│   └── Main.java
├── pom.xml
├── .env
└── README.md
```

### 5.4.2 关键代码

**ShortTermMemory.java**：
```java
public class ShortTermMemory {
    private final LinkedList<Message> history = new LinkedList<>();
    private final int maxMessages = 20;

    public void add(Message msg) {
        history.addLast(msg);
        while (history.size() > maxMessages) {
            history.removeFirst();
        }
    }

    public List<Message> getRecent() {
        return new ArrayList<>(history);
    }
}
```

**LongTermMemory.java**：
```java
public class LongTermMemory {
    private String userId;
    private Map<String, Object> preferences;
    private List<SessionRecord> history;

    public String toJson() {
        return objectMapper.writeValueAsString(this);
    }

    public static LongTermMemory fromJson(String json) {
        return objectMapper.readValue(json, LongTermMemory.class);
    }
}
```

**RAGRepository.java**：
```java
public class RAGRepository {
    private final ChromaClient client;
    private final SentenceTransformer sentenceTransformer;

    public void addDocument(String text) {
        Embedding embedding = sentenceTransformer.encode(text);
        client.addEmbeddings("documents", ...);
    }

    public List<String> retrieve(String query, int k) {
        Embedding queryEmbedding = sentenceTransformer.encode(query);
        QueryResult result = client.query("documents", ...);
        return result.getDocuments();
    }
}
```

---

## 5.5 常见陷阱与调试技巧

> **学习目标**：掌握记忆系统开发中的典型问题与解决方案

### 5.5.1 短期记忆

| 问题 | 解决方案 |
|------|---------|
| 上下文窗口溢出 | 压缩摘要、降低窗口 |
| 对话顺序混乱 | `synchronized` + `ConcurrentLinkedDeque` |

### 5.5.2 长期记忆

| 问题 | 解决方案 |
|------|---------|
| JSON序列化失败 | 添加无参构造函数 |
| Redis缓存穿透 | 缓存空值、降级到文件 |

### 5.5.3 RAG

| 问题 | 解决方案 |
|------|---------|
| Chroma连接超时 | 健康检查、Mock |
| 向量化内存溢出 | 批量处理、轻量级模型 |

---

## 5.6 课后练习

> **学习目标**：通过实践巩固本章知识

### 5.6.1 基础填空（20分）

1. 短期记忆使用 **`________`** 数据结构，窗口大小建议 **____** 条。
2. 长期记忆使用 **`________`** 格式，Redis Key设计为 **`________`**。
3. RAG全称是 **`________________________`**。

### 5.6.2 代码改错（30分）

1. 短期记忆未实现固定窗口策略
2. 长期记忆未处理`null`值

### 5.6.3 小型设计（30分）

设计多会话短期记忆系统（`Map<String, ShortTermMemory>`）

### 5.6.4 拓展挑战（20分）

1. RAG相似度阈值调优
2. 短期记忆压缩优化

---

## 5.7 本章小结与延伸阅读

> **学习目标**：回顾核心知识，拓展学习方向

### 5.7.1 知识树

```
记忆系统（Chapter 5）
├── 短期记忆（Short-Term Memory）
├── 长期记忆（Long-Term Memory）
└── RAG（Retrieval-Augmented Generation）
```

### 5.7.2 延伸阅读

| 文档 | 链接 |
|------|------|
| AgentScope-Java文档 | [agentscope.io/docs](https://agentscope.io/docs) |
| Chroma文档 | [docs.trychroma.com](https://docs.trychroma.com) |
| RAG论文 | [arXiv:2005.11401](https://arxiv.org/abs/2005.11401) |

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17  
> 学时：4学时
