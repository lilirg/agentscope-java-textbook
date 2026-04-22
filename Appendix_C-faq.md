
# 附录C：常见问题FAQ

> 本附录收集Agent开发中常见的问题与解决方案，帮助用户快速解决问题

---

## C.1 环境配置问题

### C.1.1 JDK版本不兼容

**问题**：JDK版本低于17，编译失败  
**症状**：`Unsupported major.minor version`错误  
**原因**：agentscope-java要求JDK ≥17  
**解决方案**：
```bash
# 检查JDK版本
java -version

# 下载JDK 17
# Windows: https://adoptium.net
# Linux: sdk install java 17-tem

# 配置JAVA_HOME
export JAVA_HOME=/path/to/jdk-17
```

### C.1.2 Maven依赖下载失败

**问题**：Maven无法下载依赖  
**症状**：`Could not resolve dependencies`错误  
**原因**：网络问题或镜像配置错误  
**解决方案**：
```bash
# 配置Maven镜像（~/.m2/settings.xml）
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <mirrors>
    <mirror>
      <id>aliyun</id>
      <mirrorOf>central</mirrorOf>
      <name>阿里云公共仓库</name>
      <url>https://maven.aliyun.com/repository/central</url>
    </mirror>
  </mirrors>
</settings>
```

### C.1.3 Ollama启动失败

**问题**：Ollama服务无法启动  
**症状**：`Connection refused`错误  
**原因**：端口被占用或依赖缺失  
**解决方案**：
```bash
# 检查端口占用
# Windows
netstat -ano | findstr :11434
# Linux/Mac
lsof -i :11434

# 启动Ollama
ollama serve

# 验证Ollama
curl http://localhost:11434/api/tags
```

---

## C.2 API调用问题

### C.2.1 API Key配置错误

**问题**：API Key配置错误，调用失败  
**症状**：`Invalid API Key`错误  
**原因**：.env文件未正确加载  
**解决方案**：
```env
# .env（确保文件名正确）
OPENAI_API_KEY=sk-xxxxxxxx
DASHSCOPE_API_KEY=sk-xxxxxxxx
```

```java
// 确保使用dotenv-java加载
Dotenv dotenv = Dotenv.configure()
    .directory(".env")
    .ignoreIfMissing()
    .load();
String apiKey = dotenv.get("OPENAI_API_KEY");
```

### C.2.2 API调用超时

**问题**：API调用超时  
**症状**：`SocketTimeoutException`错误  
**原因**：网络延迟高或API配额不足  
**解决方案**：
```java
// 增加超时时间
HttpClient client = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(30))
    .build();

// 实现重试机制
public String callApiWithRetry(String url, int maxRetries) {
    for (int i = 0; i < maxRetries; i++) {
        try {
            return callApi(url);
        } catch (SocketTimeoutException e) {
            logger.warn("API call timeout (attempt {}/{}), retrying...", i + 1, maxRetries);
            Thread.sleep(1000 * (i + 1));
        }
    }
    throw new RuntimeException("API call failed after " + maxRetries + " retries");
}
```

---

## C.3 模型问题

### C.3.1 模型推理速度慢

**问题**：模型推理速度慢  
**症状**：响应时间长（>5秒）  
**原因**：模型参数量大或未启用GPU加速  
**解决方案**：
```java
// 使用轻量级模型
Pipeline pipeline = new Pipeline("distilgpt2");

// 启用量化
pipeline.enableQuantization();

// 批处理
List<String> results = llmService.generate(batchPrompts);
```

### C.3.2 模型幻觉问题

**问题**：模型生成虚假信息  
**症状**：编造不存在的数据  
**原因**：未检索真实数据或提示词设计不当  
**解决方案**：
```java
// 使用RAG增强
String augmentedPrompt = buildAugmentedPrompt(userQuery, retrievedDocs);
Response response = llm.generate(augmentedPrompt);

// 置信度过滤
if (response.getConfidence() < 0.8) {
    return new Response("I'm not sure about this. Could you please provide more details?", "low_confidence");
}
```

---

## C.4 数据库问题

### C.4.1 Redis连接失败

**问题**：Redis连接失败  
**症状**：`Connection refused`错误  
**原因**：Redis服务未启动或配置错误  
**解决方案**：
```bash
# Docker启动Redis
docker run -p 6379:6379 redis:7-alpine

# 验证Redis
redis-cli ping

# 配置Spring Boot Redis连接
spring:
  redis:
    host: localhost
    port: 6379
```

### C.4.2 Chroma连接失败

**问题**：Chroma连接失败  
**症状**：`Connection refused`错误  
**原因**：Chroma服务未启动或端口配置错误  
**解决方案**：
```bash
# Docker启动Chroma
docker run -p 8000:8000 chromadb/chroma:latest

# 验证Chroma
curl http://localhost:8000/api/v1/heartbeat

# 配置Chroma客户端
ChromaClient client = new ChromaClient("http://localhost:8000");
```

---

## C.5 部署问题

### C.5.1 Docker容器崩溃

**问题**：Docker容器频繁崩溃  
**症状**：容器重启频繁  
**原因**：内存不足或环境变量未设置  
**解决方案**：
```yaml
# docker-compose.yml
version: '3.8'
services:
  ai-app:
    image: ai-app:latest
    mem_limit: 4g
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### C.5.2 CI/CD流水线失败

**问题**：CI/CD流水线构建/部署失败  
**症状**：构建失败或部署失败  
**原因**：构建脚本错误或依赖未下载  
**解决方案**：
```yaml
# .github/workflows/deploy.yml
jobs:
  build:
    steps:
      - uses: actions/checkout@v3
      - name: Setup JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          cache: maven  # 启用依赖缓存
      - name: Build with Maven
        run: mvn clean package -DskipTests
```

---

## C.6 性能问题

### C.6.1 内存泄漏

**问题**：程序运行过程中内存持续增长  
**症状**：`OutOfMemoryError`  
**原因**：未关闭资源或静态集合无限增长  
**解决方案**：
```java
// 使用try-with-resources
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement stmt = conn.prepareStatement(sql);
     ResultSet rs = stmt.executeQuery()) {
    // 处理结果
}

// 定期清理缓存
scheduler.scheduleAtFixedRate(this::cleanupCache, 0, 1, TimeUnit.HOURS);
```

### C.6.2 数据库查询慢

**问题**：数据库查询速度慢  
**症状**：查询时间长（>1秒）  
**原因**：未创建索引或SQL未优化  
**解决方案**：
```sql
-- 创建索引
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- 优化SQL
SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?;
```

---

## C.7 安全问题

### C.7.1 API Key泄露

**问题**：API Key泄露风险  
**症状**：API Key硬编码在代码中  
**原因**：未使用.env文件或加密存储  
**解决方案**：
```java
// 使用环境变量
@Value("${openai.api.key}")
private String apiKey;

// 或使用System.getenv()
private final String apiKey = System.getenv("OPENAI_API_KEY");
```

```env
# .env（添加到.gitignore）
OPENAI_API_KEY=sk-xxxxxxxx
```

### C.7.2 SQL注入攻击

**问题**：存在SQL注入风险  
**症状**：使用字符串拼接SQL  
**原因**：未使用预编译语句  
**解决方案**：
```java
// 使用预编译语句
String sql = "SELECT * FROM users WHERE email = ?";
jdbcTemplate.queryForObject(sql, new Object[]{email}, new BeanPropertyRowMapper<>(User.class));

// 输入验证
public static void validateEmail(String email) {
    if (email.length() > 256) {
        throw new IllegalArgumentException("Email too long");
    }
}
```

---

## C.8 日常维护问题

### C.8.1 文档与代码不一致

**问题**：文档内容与实际代码不一致  
**症状**：文档过时或API文档错误  
**原因**：代码更新后未同步文档  
**解决方案**：
```yaml
# 使用Swagger自动生成API文档
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
            .apis(RequestHandlerSelectors.any())
            .paths(PathSelectors.any())
            .build();
    }
}
```

### C.8.2 测试覆盖率不足

**问题**：测试覆盖率不足  
**症状**：缺陷难以发现或回归测试困难  
**原因**：单元测试不足或集成测试不足  
**解决方案**：
```java
// 单元测试
@RunWith(MockitoJUnitRunner.class)
public class AgentServiceTest {
    @Test
    public void testGenerateResponse() {
        when(llmService.generate(prompt)).thenReturn(expectedResponse);
        String actualResponse = agentService.generate(prompt);
        assertEquals(expectedResponse, actualResponse);
    }
}

// 集成测试
@SpringBootTest
public class AgentControllerIntegrationTest {
    @Test
    public void testRunAgent() throws Exception {
        mockMvc.perform(post("/api/agents/test-agent/run")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
            .andExpect(status().isOk());
    }
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-20  
> 作者：AI Agent（FMzx7o）
