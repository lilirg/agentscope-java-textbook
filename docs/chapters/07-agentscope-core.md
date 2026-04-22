# 第7章 AgentScope-Java核心模块分析

> **学习目标**  
> - 分析：AgentScope-Java源码结构  
> - 评价：配置管理最佳实践  

---

## AgentScope-Java基础架构

### 核心模块概览

| 模块 | 包名 | 功能 | 教材对应 |
|------|------|------|---------|
| `agentscope-core` | `com.alibaba.agentscope` | Agent核心组件 | 第4章、本章 |
| `agentscope-langchain` | `com.alibaba.agentscope.langchain` | LangChain桥接 | 第7章 |
| `agentscope-jdbc` | `com.alibaba.agentscope.jdbc` | JDBC工具集成 | 第4章 |
| `agentscope-spring` | `com.alibaba.agentscope.spring` | Spring Boot集成 | 第7章、第11章 |
| `agentscope-monitor` | `com.alibaba.agentscope.monitor` | 监控与可观测性 | 第11章 |

### 核心类结构

```java
// 1. Agent（Agent实例）
public class Agent {
    private String name;
    private String systemPrompt;
    private List<Tool> tools;
    private MemoryManager memoryManager;
    private Planner planner;
    private Executor executor;
    
    public String run(String input);
    public String run(String input, Map<String, Object> variables);
}

// 2. AgentSession（会话管理）
public class AgentSession {
    private String sessionId;
    private List<Message> messages; // 短期记忆
    private long createdAt;
    private long lastActiveAt;
    
    public void addMessage(Message message);
    public List<Message> getMessages(int limit);
}

// 3. MemoryManager（记忆管理）
public class MemoryManager {
    private ShortTermMemory shortTermMemory;
    private LongTermMemory longTermMemory;
    
    public void save(UserTask task, List<Result> results);
    public List<Interaction> getHistory(String sessionId);
}

// 4. ToolExecutor（工具执行器）
public class ToolExecutor {
    private Map<String, Tool> toolMap;
    
    public Object execute(String toolName, Map<String, Object> params);
}

// 5. Planner（规划器）
public class Planner {
    private LLMClient llmClient;
    
    public List<Step> plan(String task);
}

// 6. AgentRunner（Agent运行时）
public class AgentRunner {
    private Agent agent;
    private AgentSession session;
    
    public String run(String input);
}
```

---

## 配置管理

### YAML配置文件结构

```yaml
# application.yml
agentscope:
  llm:
    provider: openai
    model: gpt-4o
    api-key: ${OPENAI_API_KEY}
    temperature: 0.7
  memory:
    short-term:
      max-size: 10
    long-term:
      enabled: true
      backend: redis
      ttl: 3600
  tools:
    - name: weather
      type: http
      endpoint: http://api.weather.com/v1
    - name: calculator
      type: python
      script: |
        def calculate(expr):
            return eval(expr)
  monitoring:
    enabled: true
    metrics-endpoint: /actuator/prometheus
```

### Spring Boot集成

```java
@Configuration
@EnableConfigurationProperties(AgentScopeProperties.class)
public class AgentScopeAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public LLMClient llmClient(AgentScopeProperties props) {
        LLMConfig config = props.getLlm();
        return new OpenAILLMClient(config.getApiKey(), config.getModel());
    }
    
    @Bean
    @ConditionalOnMissingBean
    public MemoryManager memoryManager(AgentScopeProperties props) {
        MemoryConfig memoryConfig = props.getMemory();
        return new MemoryManager(
            new ShortTermMemory(memoryConfig.getShortTerm().getMaxSize()),
            new LongTermMemory(memoryConfig.getLongTerm())
        );
    }
    
    @Bean
    @ConditionalOnMissingBean
    public ToolRegistry toolRegistry(AgentScopeProperties props) {
        ToolConfig toolConfig = props.getTools();
        return new ToolRegistry(toolConfig.getTools());
    }
    
    @Bean
    @ConditionalOnMissingBean
    public AgentRunner agentRunner(LLMClient llmClient, 
                                   MemoryManager memoryManager,
                                   ToolRegistry toolRegistry) {
        Agent agent = new Agent("default", "", 
            toolRegistry.getTools(), memoryManager);
        return new AgentRunner(agent, new AgentSession());
    }
}
```

---

## Java SE知识衔接点

### 并发模型

| AgentScope-Java特性 | Java SE对应 | 说明 |
|-------------------|------------|------|
| `AgentRunner`异步执行 | `CompletableFuture` | 非阻塞工具调用 |
| `MemoryManager`多线程访问 | `ConcurrentHashMap` | 线程安全会话管理 |
| `ToolExecutor`并行执行 | `ExecutorService` | 多工具并发调用 |

### 异常处理

| 异常类型 | AgentScope-Java处理 | Java SE最佳实践 |
|---------|-------------------|---------------|
| `ToolNotFoundException` | 返回错误消息 | 自定义异常 |
| `TimeoutException` | 降级返回缓存 | 重试+超时控制 |
| `ConfigurationException` | 启动时抛出 | `@ConfigurationProperties`校验 |

### 设计模式

| AgentScope-Java模块 | 设计模式 | 作用 |
|-------------------|---------|------|
| `ToolRegistry` | 策略模式 | 动态工具注册 |
| `LLMClient` | 工厂模式 | 多LLM实现切换 |
| `AgentRunner` | 适配器模式 | 统一Agent接口 |

---

## 实战：分析AgentScope-Java配置文件

### 任务

给定一个AgentScope-Java的YAML配置文件，分析：
1. LLM提供商与模型  
2. 记忆系统配置  
3. 工具集  
4. 监控配置  

### 示例配置

```yaml
agentscope:
  llm:
    provider: qwen
    model: qwen-max
    api-key: ${DASHSCOPE_API_KEY}
  memory:
    short-term:
      max-size: 5
    long-term:
      enabled: true
      backend: chroma
  tools:
    - name: search
      type: http
      endpoint: https://api.search.com/v1
    - name: calculator
      type: python
      script: eval(${expression})
  monitoring:
    enabled: true
    metrics-endpoint: /actuator/prometheus
```

### 分析结果

| 组件 | 配置项 | 说明 |
|------|--------|------|
| **LLM** | provider: qwen, model: qwen-max | 阿里云通义千问最大版本 |
| **短期记忆** | max-size: 5 | 最多保留5轮对话 |
| **长期记忆** | backend: chroma | 使用Chroma向量数据库 |
| **工具** | search, calculator | 搜索+计算器工具 |
| **监控** | enabled: true | 启用Prometheus指标 |

---

## 本章小结

| 要点 | 内容 |
|------|------|
| **核心模块** | Agent、AgentSession、MemoryManager、ToolExecutor、Planner、AgentRunner |
| **配置管理** | YAML配置 + Spring Boot自动装配 |
| **Java衔接** | 并发模型（CompletableFuture）、异常处理、设计模式 |

---

## 参考资源

- **AgentScope-Java官方文档**：https://agentscope.io  
- **Spring Boot自动配置**：https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.developing-auto-configuration  
- **Java并发编程**：`src/chapter7/ConcurrencyDemo.java`

---

## 本章考核

### 编程题

**自定义AgentScope-Java配置类**

要求：
1. 使用`@ConfigurationProperties`绑定YAML配置  
2. 提供默认值（如model: gpt-4o）  
3. 添加校验逻辑（如api-key非空）  

```java
// 空白
@ConfigurationProperties(prefix = "agentscope.llm")
public class LLMProperties {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
