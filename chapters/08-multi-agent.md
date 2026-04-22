# 第8章 多Agent协作系统

> **学习目标**  
> - 分析：多Agent通信协议设计  
> - 创造：设计角色分工的Agent团队  

---

## 多Agent协作模式

### 常见协作模式

| 模式 | 架构 | 适用场景 | 示例 |
|------|------|---------|------|
| **Manager-Worker** | 1个Manager + N个Worker | 任务分发与汇总 | 销售Agent+客服Agent |
| **Chain-of-Thought** | Agent链式调用 | 多步骤推理 | 问题分析→方案设计→执行 |
| **Teamwork** | 多个平等Agent协作 | 并行任务处理 | 多个搜索Agent并行检索 |

#### Manager-Worker模式

```
┌─────────────────────────────────────────────────────────────┐
│                    Manager Agent                           │
│  - 接收用户请求                                               │
│  - 拆解任务为子任务                                           │
│  - 分发给Worker Agents                                        │
│  - 汇总结果并返回                                             │
└─────────────────────────────────────────────────────────────┘
                    ↓ 分发
┌─────────────────────────────────────────────────────────────┐
│                    Worker Agents (Parallel)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Worker 1 │  │ Worker 2 │  │ Worker 3 │                 │
│  │ (搜索)   │  │ (分析)   │  │ (生成)   │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                    ↓ 汇总
┌─────────────────────────────────────────────────────────────┐
│                    Manager Agent (Final Result)              │
│  整合结果 → 返回用户                                          │
└─────────────────────────────────────────────────────────────┘
```

### Java并发模型对协作的适配

| 协作模式 | Java机制 | 示例 |
|---------|---------|------|
| **Manager-Worker** | `CompletableFuture.allOf()` | 并行执行多个Worker |
| **Chain-of-Thought** | `CompletableFuture.thenCompose()` | 链式调用 |
| **Teamwork** | `CountDownLatch` | 等待所有Agent完成 |

#### 示例：Manager-Worker协作

```java
@Service
public class ManagerAgent {
    
    @Autowired
    private WorkerAgent searchAgent;
    
    @Autowired
    private WorkerAgent analyzeAgent;
    
    @Autowired
    private WorkerAgent generateAgent;
    
    /**
     * 管理多Worker协作
     */
    public CompletableFuture<String> run(String task) {
        CompletableFuture<String> searchResult = searchAgent.run(task);
        CompletableFuture<String> analyzeResult = analyzeAgent.run(task);
        CompletableFuture<String> generateResult = generateAgent.run(task);
        
        // 并行执行
        return CompletableFuture.allOf(searchResult, analyzeResult, generateResult)
            .thenApply(v -> {
                // 汇总结果
                String combined = String.join("\n\n", 
                    searchResult.join(),
                    analyzeResult.join(),
                    generateResult.join()
                );
                return "任务完成：\n" + combined;
            });
    }
}
```

---

## 通信协议与任务调度

### 消息队列集成

| 队列系统 | 优点 | 缺点 | AgentScope-Java集成 |
|---------|------|------|-------------------|
| **RabbitMQ** | 功能完善、稳定 | 较重 | `agentscope-rabbit`模块 |
| **Kafka** | 高吞吐、分布式 | 复杂度高 | `agentscope-kafka`模块 |
| **Redis Stream** | 轻量、易部署 | 功能较少 | `agentscope-redis`模块 |

#### 示例：Kafka集成（Java）

```java
// 1. 添加依赖
// <dependency>
//     <groupId>org.springframework.kafka</groupId>
//     <artifactId>spring-kafka</artifactId>
// </dependency>

@Service
public class AgentMessageBus {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    /**
     * 发送消息
     */
    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
    
    /**
     * 接收消息
     */
    @KafkaListener(topics = "agent-messages")
    public void listen(String message) {
        // 解析消息并执行Agent
        AgentMessage agentMsg = parseMessage(message);
        agentRunner.run(agentMsg.getTask());
    }
}
```

### Agent间状态同步

#### 示例：使用Redis同步状态

```java
@Service
public class AgentStateSync {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    /**
     * 保存Agent状态
     */
    public void saveState(String sessionId, String agentId, String state) {
        String key = String.format("agent:%s:%s", sessionId, agentId);
        redisTemplate.opsForValue().set(key, state, Duration.ofMinutes(5));
    }
    
    /**
     * 获取Agent状态
     */
    public String getState(String sessionId, String agentId) {
        String key = String.format("agent:%s:%s", sessionId, agentId);
        return redisTemplate.opsForValue().get(key);
    }
    
    /**
     * 同步所有Agent状态
     */
    public Map<String, String> getAllStates(String sessionId) {
        String pattern = String.format("agent:%s:*", sessionId);
        Set<String> keys = redisTemplate.keys(pattern);
        Map<String, String> states = new HashMap<>();
        for (String key : keys) {
            states.put(key, redisTemplate.opsForValue().get(key));
        }
        return states;
    }
}
```

---

## 实战：设计销售+客服双Agent协作系统

### 任务

设计一个订单处理系统：
1. **SalesAgent**：接收用户订单请求  
2. **ServiceAgent**：处理用户咨询  
3. **ManagerAgent**：协调两者并返回结果  

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                            │
│  [下单按钮] [咨询按钮]                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Manager Agent                             │
│  - 判断用户意图（下单/咨询）                                 │
│  - 分发给SalesAgent或ServiceAgent                            │
│  - 汇总结果                                                   │
└─────────────────────────────────────────────────────────────┘
                    ↓ 分发
┌─────────────────────────────────────────────────────────────┐
│              SalesAgent / ServiceAgent                       │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ SalesAgent   │      │ ServiceAgent │                    │
│  │ - 接收订单   │      │ - 接收咨询   │                    │
│  │ - 库存检查   │      │ - 知识库检索 │                    │
│  │ - 生成订单号 │      │ - 生成回答   │                    │
│  └──────────────┘      └──────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### 核心代码

```java
// 1. Manager Agent
@Service
public class ManagerAgent {
    
    @Autowired
    private SalesAgent salesAgent;
    
    @Autowired
    private ServiceAgent serviceAgent;
    
    public String route(String input) {
        // 意图识别
        String intent = detectIntent(input);
        
        if ("order".equals(intent)) {
            return salesAgent.process(input);
        } else if ("inquiry".equals(intent)) {
            return serviceAgent.process(input);
        } else {
            return "无法识别您的意图，请重试";
        }
    }
    
    private String detectIntent(String input) {
        String prompt = "判断用户意图（order/inquiry）：\n" + input;
        String response = llmClient.generate(prompt);
        return response.trim().toLowerCase();
    }
}

// 2. Sales Agent
@Service
public class SalesAgent {
    
    public String process(String input) {
        // 解析订单信息
        Order order = parseOrder(input);
        
        // 检查库存
        boolean inStock = checkStock(order);
        if (!inStock) {
            return "抱歉，该商品缺货";
        }
        
        // 生成订单
        String orderId = generateOrderId(order);
        
        return "订单创建成功，订单号：" + orderId;
    }
    
    private Order parseOrder(String input) {
        String prompt = "从以下文本中提取订单信息，输出JSON：\n" + input;
        String response = llmClient.generate(prompt);
        return JSONObject.parseObject(response, Order.class);
    }
}

// 3. Service Agent
@Service
public class ServiceAgent {
    
    @Autowired
    private KnowledgeBase knowledgeBase;
    
    public String process(String input) {
        // 检索知识库
        List<Chunk> chunks = knowledgeBase.retrieve(input);
        
        // 生成回答
        String context = chunks.stream()
            .map(Chunk::getContent)
            .collect(Collectors.joining("\n"));
        
        String prompt = "基于以下知识回答用户问题：\n" + input + "\n\n知识：\n" + context;
        return llmClient.generate(prompt);
    }
}
```

---

## 本章小结

| 要点 | 内容 |
|------|------|
| **协作模式** | Manager-Worker、Chain-of-Thought、Teamwork |
| **通信协议** | 消息队列（Kafka/RabbitMQ/Redis Stream） |
| **Java衔接** | `CompletableFuture`并行执行、`RedisTemplate`状态同步 |

---

## 参考资源

- **AgentScope-Java多Agent文档**：https://agentscope.io/docs/multi-agent  
- **Kafka Spring Boot集成**：https://docs.spring.io/spring-kafka/docs/current/reference/html/  

---

## 本章考核

### 编程题

**实现Manager-Worker协作系统**

要求：
1. 定义ManagerAgent类  
2. 实现意图识别与分发逻辑  
3. 并行执行两个Worker Agents  

```java
// 空白
@Service
public class ManagerAgent {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
