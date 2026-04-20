# 第3章 本地与云端API接入实践

> **学习目标**  
> - 应用：配置多API接入系统  
> - 评价：不同API的优劣与适用场景  

---

## 3.1 本地模型部署（LLaMA.cpp/Qwen2）

### 3.1.1 LLaMA.cpp部署步骤

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1. 下载模型 | `git clone https://github.com/ggerganov/llama.cpp` | 主仓库 |
| 2. 编译 | `make` | Linux/macOS，Windows需MinGW |
| 3. 转换模型 | `./examples/qwen2/convert-qwen2-to-gguf.py` | 支持Qwen2模型 |
| 4. 启动服务 | `./server -m models/qwen2-7b.gguf -c 4096` | 默认端口8080 |

### 3.1.2 Java REST客户端封装

```java
// 1. 添加依赖
// <dependency>
//     <groupId>org.springframework.boot</groupId>
//     <artifactId>spring-boot-starter-web</artifactId>
// </dependency>

// 2. 封装本地API调用
@Service
public class LocalLLMAPI {
    
    @Value("${local.llm.url:http://localhost:8080}")
    private String baseUrl;
    
    @Value("${local.llm.model:qwen2-7b}")
    private String model;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public String generate(String prompt) {
        Map<String, Object> request = new HashMap<>();
        request.put("model", model);
        request.put("prompt", prompt);
        request.put("temperature", 0.7);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                baseUrl + "/v1/chat/completions",
                request,
                Map.class
            );
            return (String) response.getBody().get("content");
        } catch (Exception e) {
            log.error("Local LLM调用失败", e);
            throw new RuntimeException("本地模型服务不可用", e);
        }
    }
}
```

---

## 3.2 云端API安全实践

### 3.2.1 API密钥管理

| 方式 | 安全性 | 推荐场景 |
|------|--------|---------|
| **环境变量** | ★★★★☆ | 开发/测试环境 |
| **配置文件（加密）** | ★★★☆☆ | 生产环境（需额外加密） |
| **Secret Manager** | ★★★★★ | 云平台（AWS Secrets Manager/Aliyun KMS） |

#### 示例：使用环境变量

```java
@Configuration
public class APIConfig {
    
    @Bean
    public OpenAI openAI() {
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("OPENAI_API_KEY未配置");
        }
        return new OpenAI(apiKey);
    }
}
```

#### 示例：使用阿里云KMS解密

```java
@Service
public class ALIKMS {
    
    @Value("${aliyun.kms.endpoint:kms.cn-hangzhou.aliyuncs.com}")
    private String endpoint;
    
    @Value("${aliyun.kms.cipher-text}")
    private String cipherText;
    
    public String decryptApiKey() {
        KmsClient client = KmsClientBuilder.builder()
            .endpoint(endpoint)
            .accessKeyId(System.getenv("ALIBABA_CLOUD_ACCESS_KEY_ID"))
            .accessKeySecret(System.getenv("ALIBABA_CLOUD_ACCESS_KEY_SECRET"))
            .build();
        
        DecryptRequest request = new DecryptRequest()
            .setCipherText(cipherText);
        
        DecryptResponse response = client.decrypt(request);
        return response.getPlaintext();
    }
}
```

### 3.2.2 访问控制与速率限制

#### OpenAI速率限制处理

| 错误码 | 含义 | 应对策略 |
|--------|------|---------|
| 429 | Rate limit exceeded | 指数退避重试 |
| 401 | Invalid API key | 检查密钥有效性 |
| 403 | Quota exceeded | 联系客服提升配额 |

#### 自定义速率限制器（Java）

```java
@Component
public class RateLimiter {
    
    private final Map<String, RateLimiter> apiRateLimiters = new ConcurrentHashMap<>();
    
    public void acquire(String apiKey) {
        RateLimiter limiter = apiRateLimiters.computeIfAbsent(apiKey, 
            k -> RateLimiter.create(10.0)); // 10 requests/second
        
        limiter.acquire();
    }
}
```

---

## 3.3 实战：构建多API切换的天气Agent

### 任务

实现支持三重切换（本地+OpenAI+通义千问）的天气Agent：

1. 用户选择API来源（下拉菜单）  
2. 根据选择调用对应LLM  
3. 调用天气API获取数据  
4. 返回结果  

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                           │
│  [API来源: ▼] [城市输入框] [查询按钮]                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Router                               │
│  根据用户选择 → LocalLLMAPI / OpenAI / QwenAPI             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Weather Service                          │
│  调用天气API → 返回结果                                      │
└─────────────────────────────────────────────────────────────┘
```

### 核心代码

```java
// 1. 定义API接口
public interface LLMService {
    String generate(String prompt);
}

// 2. 实现三种API
@Service
public class LocalLLMAPI implements LLMService {
    // 本地模型实现（见3.1节）
}

@Service
public class OpenAIAPI implements LLMService {
    // OpenAI实现（见2.2节）
}

@Service
public class QwenAPI implements LLMService {
    // 通义千问实现
}

// 3. API路由
@RestController
public class WeatherController {
    
    @Autowired
    @Qualifier("localLLMAPI") // 可替换为openAIAPI/qwenAPI
    private LLMService llmService;
    
    @PostMapping("/weather")
    public String queryWeather(@RequestParam String city) {
        // Step 1: LLM生成提示词
        String prompt = "查询" + city + "的天气，输出JSON：{\"temp\":..., \"condition\":...}";
        String llmResponse = llmService.generate(prompt);
        
        // Step 2: 解析JSON
        JSONObject json = new JSONObject(llmResponse);
        
        // Step 3: 调用天气API
        WeatherService weatherService = new WeatherService();
        return weatherService.getWeather(city);
    }
}
```

---

## 3.4 本章小结

| 要点 | 内容 |
|------|------|
| **本地部署** | LLaMA.cpp + Qwen2模型 + REST封装 |
| **云端API** | 密钥管理（环境变量/KMS）、速率限制、错误处理 |
| **Java衔接** | REST客户端（RestTemplate）、配置绑定（@Value）、单例模式 |

---

## 3.5 参考资源

- **LLaMA.cpp文档**：https://github.com/ggerganov/llama.cpp  
- **通义千问API文档**：https://help.aliyun.com/document_detail/611860.html  
- **Spring Boot配置管理**：`src/chapter3/ConfigDemo.java`

---

## 3.6 本章考核

### 编程题

**实现API切换逻辑（策略模式）**

要求：
1. 定义`LLMService`接口  
2. 实现`LocalLLMAPI`、`OpenAIAPI`、`QwenAPI`三个实现类  
3. 使用策略模式动态选择API  

```java
// 空白
public class LLMAPIFactory {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
