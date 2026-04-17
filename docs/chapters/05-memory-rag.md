# 第5章 记忆系统与RAG集成

> **学习目标**  
> - 应用：设计短/长期记忆机制  
> - 评价：RAG在Agent记忆中的适用性  

---

## 5.1 记忆系统设计

### 5.1.1 短期记忆（短期上下文）

**作用**：保存当前对话的交互历史

**实现方式**：`LinkedList<Message>` + 固定窗口

```java
public class ShortTermMemory {
    
    private final int maxHistorySize = 10; // 最多保留10轮对话
    
    private final LinkedList<Message> history = new LinkedList<>();
    
    public void add(UserMessage message) {
        history.add(message);
        trim();
    }
    
    public void add(AssistantMessage message) {
        history.add(message);
        trim();
    }
    
    private void trim() {
        while (history.size() > maxHistorySize) {
            history.removeFirst();
        }
    }
    
    public List<Message> getHistory() {
        return new ArrayList<>(history);
    }
}
```

#### 优化：上下文压缩

当对话轮次较多时，可压缩早期对话：

```java
private String compress(List<Message> messages) {
    String prompt = "请将以下对话压缩为简洁摘要（不超过50字）：\n";
    for (Message msg : messages) {
        prompt += msg.getRole() + ": " + msg.getContent() + "\n";
    }
    return llmClient.generate(prompt);
}
```

### 5.1.2 长期记忆（用户偏好+知识库）

**作用**：保存用户偏好、历史任务、外部知识

**实现方式**：  
1. **用户偏好**：JSON序列化存储（文件/数据库）  
2. **知识库**：RAG（检索增强生成）

#### 示例：用户偏好存储

```java
@Service
public class LongTermMemory {
    
    private final Map<String, JSONObject> preferences = new ConcurrentHashMap<>();
    
    public void savePreference(String userId, String key, Object value) {
        JSONObject userPref = preferences.computeIfAbsent(userId, 
            k -> new JSONObject());
        userPref.put(key, value);
        persist(userId);
    }
    
    public Object getPreference(String userId, String key) {
        JSONObject userPref = preferences.get(userId);
        return userPref != null ? userPref.get(key) : null;
    }
    
    private void persist(String userId) {
        // 保存到文件/数据库
        String filePath = "data/" + userId + "_pref.json";
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(preferences.get(userId).toString(2));
        } catch (IOException e) {
            log.error("保存用户偏好失败", e);
        }
    }
}
```

---

## 5.2 RAG集成

### 5.2.1 RAG基础流程

```
┌─────────────────────────────────────────────────────────────┐
│                    RAG流程                                   │
├─────────────────────────────────────────────────────────────┤
│  1. Query Encoding → 向量化用户查询                          │
│  2. Vector Search → 在向量库中检索相关片段                   │
│  3. Context Augmentation → 将检索结果作为上下文              │
│  4. LLM Generation → LLM基于上下文生成回答                   │
└─────────────────────────────────────────────────────────────┘
```

### 5.2.2 向量数据库选择

| 数据库 | 优点 | 缺点 | 适用场景 |
|--------|------|------|---------|
| **Chroma** | 轻量级、易于部署 | 功能较少 | 本地开发/测试 |
| **Weaviate** | 功能丰富、支持插件 | 较重 | 生产环境 |
| **Milvus** | 高性能、分布式 | 复杂度高 | 大规模数据 |

#### 示例：Chroma集成（Java）

```java
// 1. 添加依赖
// <dependency>
//     <groupId>io.chroma</groupId>
//     <artifactId>chroma-java-client</artifactId>
//     <version>0.1.0</version>
// </dependency>

@Service
public class RAGService {
    
    private ChromaClient client;
    private Collection collection;
    
    @PostConstruct
    public void init() {
        // 连接Chroma
        client = new ChromaClient("http://localhost:8000");
        
        // 创建集合
        collection = client.createCollection(
            "user_knowledge", 
            new EmbeddingFunction.SentenceTransformer("all-MiniLM-L6-v2")
        );
    }
    
    /**
     * 添加知识片段
     */
    public void addKnowledge(String id, String content) {
        collection.add(
            Collections.singletonList(id),
            Collections.singletonList(content),
            null
        );
    }
    
    /**
     * 检索相关片段
     */
    public List<Chunk> retrieve(String query, int topK) {
        Embedding embedding = new EmbeddingFunction.SentenceTransformer("all-MiniLM-L6-v2")
            .call(Collections.singletonList(query));
        
        QueryResult result = collection.query(
            embedding,
            topK,
            null,
            null,
            null
        );
        
        return result.getDocuments().stream()
            .map(doc -> new Chunk(doc, result.getDistances().get(0)))
            .collect(Collectors.toList());
    }
}
```

---

## 5.3 Agent中的记忆应用

### 5.3.1 记忆驱动的对话优化

**场景**：用户多次询问相同问题

**优化方案**：

1. 检查短期记忆 → 若有相似对话，直接复用结果  
2. 检查长期记忆 → 若有相关知识，检索RAG  
3. 调用LLM → 若无历史，生成新回答并保存

```java
@Service
public class MemoryOptimizedAgent {
    
    @Autowired
    private ShortTermMemory shortTermMemory;
    
    @Autowired
    private LongTermMemory longTermMemory;
    
    @Autowired
    private RAGService ragService;
    
    public String answer(String query) {
        // Step 1: 检查短期记忆
        String cached = checkShortTermCache(query);
        if (cached != null) {
            return cached;
        }
        
        // Step 2: 检查长期记忆（RAG）
        List<Chunk> chunks = ragService.retrieve(query, 3);
        if (!chunks.isEmpty()) {
            String context = chunks.stream()
                .map(Chunk::getContent)
                .collect(Collectors.joining("\n"));
            return llmClient.generate("问题：" + query + "\n\n背景信息：\n" + context);
        }
        
        // Step 3: 生成新回答
        String answer = llmClient.generate("问题：" + query);
        
        // Step 4: 保存到短期记忆
        shortTermMemory.add(new UserMessage(query));
        shortTermMemory.add(new AssistantMessage(answer));
        
        return answer;
    }
}
```

### 5.3.2 实战：带记忆的邮件摘要Agent

#### 任务

构建一个邮件摘要Agent，支持：
1. 用户提供邮箱权限  
2. 读取最近N封邮件  
3. 生成摘要  
4. **记住用户偏好的摘要风格**（如"简洁版"/"详细版"）

#### 核心代码

```java
@Service
public class EmailSummarizerAgent {
    
    @Autowired
    private EmailAPI emailAPI;
    
    @Autowired
    private LongTermMemory longTermMemory;
    
    @Autowired
    private RAGService ragService;
    
    public String summarize(String userId, int limit) {
        // Step 1: 获取用户偏好
        String preference = (String) longTermMemory.getPreference(userId, "summary_style");
        if (preference == null) {
            preference = "standard"; // 默认
        }
        
        // Step 2: 读取邮件
        List<Email> emails = emailAPI.fetchRecent(userId, limit);
        
        // Step 3: 生成摘要（根据偏好）
        String prompt = buildPrompt(emails, preference);
        String summary = llmClient.generate(prompt);
        
        // Step 4: 保存到短期记忆（供后续对话使用）
        shortTermMemory.add(new UserMessage("总结最近" + limit + "封邮件"));
        shortTermMemory.add(new AssistantMessage(summary));
        
        return summary;
    }
    
    private String buildPrompt(List<Email> emails, String style) {
        StringBuilder sb = new StringBuilder();
        sb.append("请根据以下邮件内容生成摘要：\n");
        
        for (Email email : emails) {
            sb.append("发件人：").append(email.getFrom()).append("\n");
            sb.append("主题：").append(email.getSubject()).append("\n");
            sb.append("内容：").append(email.getContent()).append("\n\n");
        }
        
        if ("concise".equals(style)) {
            sb.append("要求：每封邮件1句话摘要，不超过20字\n");
        } else if ("detailed".equals(style)) {
            sb.append("要求：每封邮件3-5句摘要，包含关键信息\n");
        }
        
        return sb.toString();
    }
}
```

---

## 5.4 本章小结

| 要点 | 内容 |
|------|------|
| **短期记忆** | `LinkedList<Message>` + 固定窗口，支持对话历史 |
| **长期记忆** | JSON存储偏好 + RAG检索知识 |
| **RAG集成** | 向量数据库（Chroma/Weaviate/Milvus）+ Embedding |

---

## 5.5 参考资源

- **Chroma文档**：https://docs.trychroma.com  
- **Sentence Transformers**：https://www.sbert.net  
- **RAG最佳实践**：`docs/Appendix_RAG.md`

---

## 5.6 本章考核

### 编程题

**实现带RAG的邮件摘要Agent**

要求：
1. 用户提供邮箱权限  
2. 读取最近3封邮件  
3. 生成摘要（根据用户偏好）  
4. 使用Chroma存储邮件摘要向量  

```java
// 空白
public String summarizeWithRAG(String userId, int limit) {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
