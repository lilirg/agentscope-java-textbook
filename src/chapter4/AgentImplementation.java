# Agent架构实现示例（第4章）

> 本示例展示基于Spring Boot的Agent核心组件实现

---

## 1. Agent核心类

```java
package com.textbook.chapter4;

import com.textbook.chapter4.memory.Memory;
import com.textbook.chapter4.planner.Planner;
import com.textbook.chapter4.executor.Executor;
import com.textbook.chapter4.perceptor.Perceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Agent核心类
 * 协调Perceptor-Planner-Executor-Memory四模块
 */
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

    /**
     * 处理用户输入
     */
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

    private String generateResponse(List<Result> results) {
        StringBuilder sb = new StringBuilder();
        for (Result result : results) {
            sb.append("步骤: ").append(result.getStep().getDescription()).append("\n");
            sb.append("结果: ").append(result.getData()).append("\n");
        }
        return sb.toString();
    }
}
```

---

## 2. Perceptor（感知模块）

```java
package com.textbook.chapter4.perceptor;

import org.springframework.stereotype.Service;

/**
 * 感知模块：接收用户输入
 */
@Service
public class Perceptor {

    /**
     * 接收用户输入并转换为UserTask
     */
    public UserTask receive(String input) {
        return new UserTask(input);
    }
}
```

---

## 3. Planner（规划模块）

```java
package com.textbook.chapter4.planner;

import com.textbook.chapter4.perceptor.UserTask;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 规划模块：拆解任务为步骤
 */
@Service
public class Planner {

    private final ExecutorService executorService = Executors.newFixedThreadPool(2);

    /**
     * 并发规划任务
     */
    public CompletableFuture<List<Step>> plan(UserTask task) {
        return CompletableFuture.supplyAsync(() -> {
            // LLM生成规划步骤
            String prompt = "请将任务'" + task.getContent() + "'拆解为3个步骤，输出JSON数组";
            String response = LLMClient.generate(prompt);

            // 解析JSON响应
            return StepParser.parse(response);
        }, executorService);
    }
}
```

---

## 4. Executor（执行模块）

```java
package com.textbook.chapter4.executor;

import com.textbook.chapter4.perceptor.UserTask;
import com.textbook.chapter4.planner.Step;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

/**
 * 执行模块：调用工具执行步骤
 */
@Service
public class Executor {

    @Autowired
    private ToolRegistry toolRegistry;

    @Autowired
    private CacheManager cacheManager;

    private final ExecutorService executorService = Executors.newFixedThreadPool(4);

    /**
     * 并发执行工具
     */
    public List<Result> execute(List<Step> steps) {
        List<CompletableFuture<Result>> futures = new ArrayList<>();

        for (Step step : steps) {
            futures.add(CompletableFuture.supplyAsync(() -> {
                try {
                    Object toolResult = executeWithFallback(step);
                    return new Result(step, toolResult);
                } catch (Exception e) {
                    return new Result(step, "执行失败: " + e.getMessage());
                }
            }, executorService));
        }

        // 等待所有工具执行完成
        CompletableFuture<Void> allDone = CompletableFuture.allOf(
            futures.toArray(new CompletableFuture[0])
        );

        try {
            allDone.get(30, TimeUnit.SECONDS);
            return futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());
        } catch (TimeoutException e) {
            throw new RuntimeException("工具调用超时", e);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("工具调用失败", e);
        }
    }

    /**
     * 工具调用失败降级
     */
    private Object executeWithFallback(Step step) {
        try {
            Tool tool = toolRegistry.getTool(step.getToolName());
            if (tool == null) {
                throw new IllegalArgumentException("工具不存在: " + step.getToolName());
            }
            return tool.execute(step.getParams());
        } catch (TimeoutException e) {
            // 超时降级
            return cacheManager.get(step.getToolName());
        } catch (Exception e) {
            // 其他异常
            throw e;
        }
    }
}
```

---

## 5. ToolRegistry（工具注册表）

```java
package com.textbook.chapter4.executor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 工具注册表：管理所有工具
 */
@Component
public class ToolRegistry {

    @Autowired
    private List<Tool> tools;

    private final Map<String, Tool> toolMap = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        toolMap.putAll(tools.stream()
            .collect(Collectors.toMap(Tool::getName, t -> t)));
    }

    public Tool getTool(String name) {
        return toolMap.get(name);
    }
}

/**
 * 工具接口
 */
interface Tool {
    String getName();
    String getDescription();
    Object execute(Map<String, Object> params);
}

/**
 * 示例：天气工具
 */
@Service
class WeatherTool implements Tool {
    @Override
    public String getName() { return "weather"; }

    @Override
    public String getDescription() { return "查询指定城市的天气"; }

    @Override
    public Object execute(Map<String, Object> params) {
        String city = (String) params.get("city");
        return "北京明天晴，气温15-25℃";
    }
}
```

---

## 6. Memory（记忆模块）

```java
package com.textbook.chapter4.memory;

import com.textbook.chapter4.perceptor.UserTask;
import com.textbook.chapter4.executor.Result;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 记忆模块：保存交互历史
 */
@Service
public class Memory {

    private final Map<String, List<Interaction>> history = new ConcurrentHashMap<>();

    /**
     * 保存交互
     */
    public void save(UserTask task, List<Result> results) {
        String sessionId = task.getSessionId();
        history.computeIfAbsent(sessionId, k -> new ArrayList<>())
            .add(new Interaction(task, results));
    }

    /**
     * 获取历史
     */
    public List<Interaction> getHistory(String sessionId) {
        return history.getOrDefault(sessionId, new ArrayList<>());
    }
}

/**
 * 交互记录
 */
class Interaction {
    private final UserTask task;
    private final List<Result> results;

    public Interaction(UserTask task, List<Result> results) {
        this.task = task;
        this.results = results;
    }

    // Getters...
}
```

---

## 7. 配置类

```java
package com.textbook.chapter4.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Agent配置类
 */
@Configuration
public class AgentConfig {

    @Bean
    public ExecutorService plannerExecutor() {
        return Executors.newFixedThreadPool(2);
    }

    @Bean
    public ExecutorService executorExecutor() {
        return Executors.newFixedThreadPool(4);
    }
}
```

---

## 8. 使用示例

```java
@RestController
public class AgentController {

    @Autowired
    private Agent agent;

    @PostMapping("/agent/process")
    public String process(@RequestBody UserTask task) {
        return agent.process(task.getContent());
    }
}
```

---

> 本示例为精简版，实际项目需补充异常处理、日志、监控等逻辑
