# 第2章 提示词工程与LLM API接入

> **学习目标**  
> - 应用：编写结构化提示词  
> - 分析：不同LLM API的接口差异  

---

## 提示词设计原则

### CRISPE框架

| 字母 | 含义 | 示例 |
|------|------|------|
| **C** | Character（角色） | "你是一位专业的数据分析师" |
| **R** | Role（任务） | "请根据销售数据生成季度报告" |
| **I** | Instance（示例） | "参考以下模板：" |
| **S** | Style（风格） | "使用表格呈现，每项不超过20字" |
| **P** | Persona（人设） | "保持专业但亲切的语气" |
| **E** | Environment（环境） | "用户是企业高管，时间紧张" |

### 目标驱动 vs 问题驱动

| 类型 | 特点 | 适用场景 |
|------|------|---------|
| **问题驱动** | "你好，请问..." | 问答、聊天 |
| **目标驱动** | "帮我完成X，要求Y" | 任务执行、Agent系统 |

---

## LLM API调用基础

### OpenAI API调用（Java示例）

```java
// 1. 添加Maven依赖
// <dependency>
//     <groupId>com.openai</groupId>
//     <artifactId>openai-java</artifactId>
//     <version>0.10.0</version>
// </dependency>

// 2. 配置API Key（环境变量）
String apiKey = System.getenv("OPENAI_API_KEY");
OpenAI api = new OpenAI(apiKey);

// 3. 发送请求
ChatCompletionRequest request = ChatCompletionRequest.builder()
    .model("gpt-4o")
    .messages(List.of(
        new Message("system", "你是一位专业的数据分析师"),
        new Message("user", "请根据销售数据生成季度报告")
    ))
    .build();

String response = api.createChatCompletion(request).choices().get(0).message().content();
```

### 阿里云通义千问API对比

| 功能 | OpenAI API | 通义千问API |
|------|------------|------------|
| **模型** | gpt-4o | qwen-max |
| **调用地址** | https://api.openai.com/v1/chat/completions | https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation |
| **认证方式** | Bearer Token | AK/SK签名 |
| **流式输出** | 支持（sse） | 支持（sse） |
| **价格（每百万token）** | $5.00输入/$15.00输出 | ¥2.4输入¥7.2输出 |

---

## 错误处理与超时重试

### 异常处理模式

```java
public String callLLM(ChatCompletionRequest request) {
    try {
        return api.createChatCompletion(request).choices().get(0).message().content();
    } catch (RateLimitException e) {
        log.warn("Rate limit exceeded, waiting 60s...");
        Thread.sleep(60000);
        return retry(request, 1); // 重试1次
    } catch (TimeoutException e) {
        log.error("Request timeout");
        throw new RuntimeException("LLM服务超时", e);
    } catch (Exception e) {
        log.error("Unexpected error", e);
        throw new RuntimeException("LLM调用失败", e);
    }
}
```

### 重试策略

| 场景 | 重试次数 | 间隔 | 备注 |
|------|---------|------|------|
| RateLimit | 3 | 指数退避（1s, 2s, 4s） | OpenAI官方建议 |
| Timeout | 2 | 固定30s | 网络波动 |
| ServerError | 1 | 固定60s | 模型服务异常 |

---

## 实战：调用OpenAI API实现天气查询

### 任务

构建一个简单的天气查询Agent，步骤：

1. 用户输入城市名称  
2. 调用OpenAI API生成天气提示词  
3. 调用天气API获取数据  
4. 整理并返回结果  

### 代码框架

```java
// 1. 天气API接口（示例：OpenWeatherMap）
public class WeatherAPI {
    public String getWeather(String city) {
        String url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s", city, apiKey);
        // REST调用...
    }
}

// 2. Agent主流程
public String queryWeather(String city) {
    // Step 1: LLM生成提示词
    String prompt = "我需要查询" + city + "的天气，请用JSON格式输出：{\"city\":..., \"temp\":..., \"condition\":...}";
    
    // Step 2: 调用LLM API
    String llmResponse = callLLM(prompt);
    
    // Step 3: 解析JSON（简化版，实际需校验格式）
    JSONObject json = new JSONObject(llmResponse);
    String cityFromLLM = json.getString("city");
    
    // Step 4: 调用天气API
    WeatherAPI weatherAPI = new WeatherAPI();
    String weatherData = weatherAPI.getWeather(cityFromLLM);
    
    return weatherData;
}
```

---

## 本章小结

| 要点 | 内容 |
|------|------|
| **提示词设计** | CRISPE框架：Character、Role、Instance、Style、Persona、Environment |
| **API调用** | 认证方式、请求格式、流式输出支持 |
| **错误处理** | 异常分类、重试策略（退避算法）、降级方案 |
| **Java衔接** | REST客户端（RestTemplate/WebClient）、JSON解析（Jackson/Gson） |

---

## 参考资源

- **CRISPE框架详解**：`docs/Appendix_Prompting.md`
- **主流LLM API对比**：`docs/Appendix_API_Comparison.md`
- **API定价参考**：`docs/Appendix_API_Pricing.md`

---

## 本章考核

### 编程题

**实现带错误处理的天气查询函数**

要求：
1. 使用`RestTemplate`调用OpenAI API  
2. 捕获`RateLimitException`并重试3次  
3. 返回JSON解析后的天气数据  

```java
// 空白
public String queryWeather(String city) {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
