# 第10章 Agent评测与优化

> **学习目标**  
> - 评价：评测指标设计合理性  
> - 应用：实施Agent性能优化  

---

## 10.1 评测指标体系

### 10.1.1 核心评测指标

| 指标 | 公式 | 说明 | 目标值 |
|------|------|------|-------|
| **任务完成率** | 完成任务数 / 总任务数 | Agent能否正确执行任务 | ≥90% |
| **精度** | TP / (TP + FP) | 正确响应占所有响应比例 | ≥85% |
| **召回率** | TP / (TP + FN) | 正确响应占应答任务比例 | ≥80% |
| **平均响应时间** | 总耗时 / 总任务数 | 用户等待时间 | ≤2s |
| **用户满意度** | NPS = (% promoters - % detractors) | 用户推荐意愿 | ≥40 |

### 10.1.2 JMH性能测试

```java
// 1. 添加依赖
// <dependency>
//     <groupId>org.openjdk.jmh</groupId>
//     <artifactId>jmh-core</artifactId>
//     <version>1.37</version>
// </dependency>
// <dependency>
//     <groupId>org.openjdk.jmh</groupId>
//     <artifactId>jmh-generator-annprocess</artifactId>
//     <version>1.37</version>
//     <scope>provided</scope>
// </dependency>

@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@Warmup(iterations = 3)
@Measurement(iterations = 5)
public class AgentPerformanceTest {
    
    @Benchmark
    public String testAgentRun() {
        Agent agent = new Agent();
        return agent.run("查北京天气");
    }
    
    public static void main(String[] args) throws RunnerException {
        Options opt = new OptionsBuilder()
            .include(AgentPerformanceTest.class.getSimpleName())
            .forks(1)
            .build();
        new Runner(opt).run();
    }
}
```

---

## 10.2 提示词迭代优化

### 10.2.1 优化前后对比

#### 问题：任务完成率低

**原因分析**：
- 提示词模糊 → LLM理解偏差  
- 缺少示例 → 输出格式不稳定  

#### 优化方案：CRISPE框架重写

```java
// 优化前
"查北京天气"

// 优化后
【角色】你是一位专业的天气助手  
【任务】请查询指定城市的天气  
【背景】用户需要知道实时天气以安排出行  
【步骤】  
  1. 提取城市名称  
  2. 调用weather工具  
  3. 解析JSON响应  
  4. 格式化输出  
【格式】输出格式为："{城市}当前{温度}℃，{天气状况}"  
【示例】  
  输入："查上海天气"  
  输出："上海当前25℃，晴"  
```

### 10.2.2 自动化测试框架

```java
@Service
public class PromptEvaluator {
    
    private final List<PromptTestCase> testCases = new ArrayList<>();
    
    public void addTestCase(String input, String expectedOutput) {
        testCases.add(new PromptTestCase(input, expectedOutput));
    }
    
    /**
     * 评估提示词效果
     */
    public EvaluationResult evaluate(Agent agent) {
        int success = 0;
        int total = testCases.size();
        
        for (PromptTestCase testCase : testCases) {
            String output = agent.run(testCase.getInput());
            if (output.contains(testCase.getExpectedOutput())) {
                success++;
            }
        }
        
        return new EvaluationResult(success, total, success * 100.0 / total);
    }
}

class PromptTestCase {
    private final String input;
    private final String expectedOutput;
    
    public PromptTestCase(String input, String expectedOutput) {
        this.input = input;
        this.expectedOutput = expectedOutput;
    }
    
    // Getters...
}

class EvaluationResult {
    private final int success;
    private final int total;
    private final double accuracy;
    
    public EvaluationResult(int success, int total, double accuracy) {
        this.success = success;
        this.total = total;
        this.accuracy = accuracy;
    }
    
    // Getters...
}
```

---

## 10.3 实战：设计Agent评测方案并实施

### 任务

以「邮件摘要Agent」为例，设计评测方案：

1. 定义评测指标  
2. 设计测试用例  
3. 实施评测并分析  

### 评测方案

#### 步骤1：定义指标

| 指标 | 目标值 | 测量方式 |
|------|-------|---------|
| 任务完成率 | ≥90% | 能否生成摘要 |
| 精度 | ≥85% | 摘要内容准确 |
| 平均响应时间 | ≤1.5s | 响应耗时 |

#### 步骤2：设计测试用例

```java
@Test
public void testEmailSummarizer() {
    Agent agent = new EmailSummarizerAgent();
    
    // 测试用例1：正常邮件
    String input1 = "收件箱中有3封新邮件：\n" +
        "1. 主题：会议通知 - 内容：明天10点开会...\n" +
        "2. 主题：项目进展 - 内容：已完成50%...\n" +
        "3. 主题：报销申请 - 内容：请审批...";
    String expected1 = "3封邮件：会议通知、项目进展、报销申请";
    assert agent.run(input1).contains(expected1);
    
    // 测试用例2：垃圾邮件
    String input2 = "收件箱中有1封垃圾邮件：主题：优惠促销...";
    String expected2 = "1封垃圾邮件：优惠促销";
    assert agent.run(input2).contains(expected2);
    
    // 测试用例3：空收件箱
    String input3 = "收件箱为空";
    String expected3 = "收件箱为空";
    assert agent.run(input3).contains(expected3);
}
```

#### 步骤3：实施评测

```java
@Service
public class AgentPerformanceMonitor {
    
    @Autowired
    private EmailSummarizerAgent agent;
    
    /**
     * 监控性能
     */
    @Scheduled(fixedRate = 3600000) // 每小时
    public void monitor() {
        long startTime = System.currentTimeMillis();
        String result = agent.summarize("user123", 5);
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("Agent响应时间: {}ms", duration);
        
        if (duration > 1500) {
            log.warn("Agent响应超时！当前: {}ms, 阈值: 1500ms", duration);
        }
    }
}
```

---

## 10.4 本章小结

| 要点 | 内容 |
|------|------|
| **评测指标** | 任务完成率、精度、召回率、平均响应时间、用户满意度 |
| **优化策略** | 提示词迭代、工具调用优化、缓存机制 |
| **Java衔接** | JMH性能测试、JUnit单元测试、@Scheduled定时任务 |

---

## 10.5 参考资源

- **JMH官方文档**：https://openjdk.java.net/projects/code-tools/jmh/  
- **Agent评测最佳实践**：`docs/Appendix_Evaluation.md`

---

## 10.6 本章考核

### 编程题

**实现任务完成率统计**

要求：
1. 统计100次任务调用的成功/失败次数  
2. 计算完成率  
3. 判断是否达标（≥90%）  

```java
// 空白
public class CompletionRateCalculator {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
