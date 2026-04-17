# 第4章 Agent架构与工具调用

> **学习目标**  
> - 应用：实现带Planning的单Agent系统  
> - 分析：工具调用中的错误传播机制  

---

## 4.1 Agent核心架构

### 4.1.1 模块划分

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Core Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │  Perceptor  │────▶│  Planner    │────▶│ Executor    │   │
│  │  (感知模块)  │     │  (规划模块)  │     │ (执行模块)  │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│        ▲                       │                       │   │
│        │                       ▼                       ▼   │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐│
│  │   Memory    │         │  Tools      │         │   API/DB    ││
│  │  (记忆模块)  │         │  (工具集)   │         │ (外部系统)  ││
│  └─────────────┘         └─────────────┘         └─────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.1.2 Java并发模型对Agent多线程的支持

| Agent模块 | 推荐Java机制 | 示例 |
|----------|------------|------|
| **Perceptor** | `Callable<V>` + `Future` | 异步接收用户输入 |
| **Planner** | `CompletableFuture` | 非阻塞规划 |
| **Executor** | `ExecutorService` | 并发工具调用 |
| **Memory** | `ConcurrentHashMap` | 多线程安全存储 |

#### 示例：Planner并发规划

```java
@Service
public class PlanningService {
    
    @Autowired
    private ExecutorService executorService;
    
    public CompletableFuture<List<Step>> plan(String task) {
        return CompletableFuture.supplyAsync(() -> {
            // LLM生成规划步骤
            String prompt = "请将任务'" + task + "'拆解为3个步骤，输出JSON：[{\"step\":...}]";
            String response = llmClient.generate(prompt);
            return parseSteps(response);
        }, executorService);
    }
}
```

---

## 4.2 工具绑定与执行

### 4.2.1 工具注册表设计

```java
// 1. 定义工具接口
public interface Tool {
    String getName();
    String getDescription();
    Object execute(Map<String, Object> params);
}

// 2. 实现具体工具
@Service
public class WeatherTool implements Tool {
    @Override
    public String getName() { return "weather"; }
    
    @Override
    public String getDescription() { return "查询指定城市的天气"; }
    
    @Override
    public Object execute(Map<String, Object> params) {
        String city = (String) params.get("city");
        return weatherAPI.getWeather(city);
    }
}

// 3. 工具注册表
@Component
public class ToolRegistry {
    
    @Autowired
    private List<Tool> tools;
    
    private final Map<String, Tool> toolMap = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void init() {
        tools.forEach(tool -> toolMap.put(tool.getName(), tool));
    }
    
    public Tool getTool(String name) {
        return toolMap.get(name);
    }
}
```

### 4.2.2 工具调用失败的降级策略

| 失败类型 | 降级策略 | 示例 |
|---------|---------|------|
| **工具不可用** | 返回预设错误消息 | "天气服务暂时不可用，请稍后重试" |
| **参数错误** | 重新提示用户修正 | "城市名称不合法，请重新输入" |
| **超时** | 返回缓存数据 | "网络超时，返回昨天天气" |

#### 示例：超时降级

```java
@Service
public class ToolExecutor {
    
    @Autowired
    private ToolRegistry toolRegistry;
    
    public Object execute(String toolName, Map<String, Object> params) {
        Tool tool = toolRegistry.getTool(toolName);
        if (tool == null) {
            throw new IllegalArgumentException("工具不存在: " + toolName);
        }
        
        try {
            return tool.execute(params);
        } catch (TimeoutException e) {
            log.warn("工具调用超时，使用缓存数据");
            return getFallbackData(toolName); // 降级逻辑
        } catch (Exception e) {
            log.error("工具调用失败", e);
            return "工具调用失败: " + e.getMessage();
        }
    }
    
    private Object getFallbackData(String toolName) {
        // 缓存数据逻辑
        return cacheManager.get(toolName);
    }
}
```

---

## 4.3 实战：实现单Agent工具调用系统

### 任务

构建一个带Planner的单Agent系统，支持工具调用：

1. 用户输入任务（如"帮我查北京明天的天气，并提醒我带伞"）  
2. Planner拆解步骤  
3. Executor调用工具  
4. Memory保存交互历史  

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent System                              │
├─────────────────────────────────────────────────────────────┤
│  1. UserInput → Perceptor (接收指令)                        │
│  2. Perceptor → Planner (请求规划)                          │
│  3. Planner → Tools (请求工具执行)                          │
│  4. Tools → Executor (执行并返回结果)                       │
│  5. Executor → Memory (保存历史)                            │
│  6. Memory → Output (生成最终回复)                          │
└─────────────────────────────────────────────────────────────┘
```

### 核心代码

```java
// 1. Agent主类
@Service
public class Agent {
    
    @Autowired
    private Perceptor perceptor;
    
    @Autowired
    private Planner planner;
    
    @Autowired
    private Executor executor;
    
    @Autowired
    private Memory memory;
    
    public String process(String userInput) {
        // Step 1: 感知用户输入
        UserTask task = perceptor.receive(userInput);
        
        // Step 2: 规划任务
        List<Step> steps = planner.plan(task);
        
        // Step 3: 执行工具
        List<Result> results = executor.execute(steps);
        
        // Step 4: 保存历史
        memory.save(task, results);
        
        // Step 5: 生成回复
        return generateResponse(results);
    }
}

// 2. Perceptor实现
@Service
public class Perceptor {
    public UserTask receive(String input) {
        return new UserTask(input);
    }
}

// 3. Planner实现
@Service
public class Planner {
    public List<Step> plan(UserTask task) {
        String prompt = "任务：" + task.getContent() + "，请拆解为3个步骤";
        String response = llmClient.generate(prompt);
        return parseSteps(response);
    }
}

// 4. Executor实现
@Service
public class Executor {
    public List<Result> execute(List<Step> steps) {
        List<Result> results = new ArrayList<>();
        for (Step step : steps) {
            Object toolResult = toolExecutor.execute(step.getTool(), step.getParams());
            results.add(new Result(step, toolResult));
        }
        return results;
    }
}

// 5. Memory实现
@Service
public class Memory {
    private final Map<String, List<Interaction>> history = new ConcurrentHashMap<>();
    
    public void save(UserTask task, List<Result> results) {
        String sessionId = task.getSessionId();
        history.computeIfAbsent(sessionId, k -> new ArrayList<>())
            .add(new Interaction(task, results));
    }
    
    public List<Interaction> getHistory(String sessionId) {
        return history.getOrDefault(sessionId, new ArrayList<>());
    }
}
```

---

## 4.4 本章小结

| 要点 | 内容 |
|------|------|
| **Agent架构** | Perceptor-Planner-Executor-Memory四模块 |
| **Java衔接** | `CompletableFuture`并发规划、`ConcurrentHashMap`多线程安全 |
| **工具调用** | 工具注册表、失败降级、超时处理 |

---

## 4.5 参考资源

- **AgentScope-Java源码**：`src/chapter4/AgentScopeAdapter.java`  
- **Agent架构详解**：`docs/Appendix_Components.md`

---

## 4.6 本章考核

### 编程题

**实现工具调用失败降级逻辑**

要求：
1. 捕获`TimeoutException`  
2. 返回预设缓存数据  
3. 记录日志  

```java
// 空白
public Object executeWithFallback(String toolName, Map<String, Object> params) {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
