# 第11章 部署与监控

> **学习目标**  
> - 应用：部署Agent应用到生产环境  
> - 评价：监控指标的有效性  

---

## 11.1 部署模型

### 11.1.1 Docker容器化部署

#### Dockerfile

```dockerfile
# 1. 使用OpenJDK 17基础镜像
FROM openjdk:17-jdk-slim

# 2. 设置工作目录
WORKDIR /app

# 3. 复制JAR包
COPY target/agentscope-textbook-1.0.0.jar app.jar

# 4. 设置环境变量
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# 5. 暴露端口
EXPOSE 8080

# 6. 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  agent-service:
    build: .
    ports:
      - "8080:8080"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/agents
    depends_on:
      - db
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=agent
      - POSTGRES_PASSWORD=agent123
      - POSTGRES_DB=agents
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 11.1.2 Java应用启动参数优化

```bash
# 启动脚本
#!/bin/bash

# 1. 内存配置
export JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# 2. GC日志
export JAVA_OPTS="$JAVA_OPTS -Xlog:gc*:file=logs/gc.log:time,uptime,level,tags"

# 3. JMX监控
export JAVA_OPTS="$JAVA_OPTS -Dcom.sun.management.jmxremote"
export JAVA_OPTS="$JAVA_OPTS -Dcom.sun.management.jmxremote.port=9999"
export JAVA_OPTS="$JAVA_OPTS -Dcom.sun.management.jmxremote.authenticate=false"
export JAVA_OPTS="$JAVA_OPTS -Dcom.sun.management.jmxremote.ssl=false"

# 4. 启动
java $JAVA_OPTS -jar agentscope-textbook-1.0.0.jar
```

---

## 11.2 监控与日志

### 11.2.1 日志集成（SLF4J + Logback）

#### logback-spring.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <!-- 文件输出 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/agent-service.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/agent-service.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <!-- Agent-specific logging -->
    <logger name="com.textbook.chapter4.Agent" level="INFO"/>
    <logger name="com.textbook.chapter8.MultiAgent" level="INFO"/>
    
    <!-- 根Logger -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

### 11.2.2 Prometheus + Grafana监控

#### Spring Boot Actuator配置

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
    metrics:
      enabled: true

# 自定义Agent指标
@Component
public class AgentMetrics {
    
    private final Counter taskCounter;
    private final Timer taskTimer;
    
    public AgentMetrics(MeterRegistry registry) {
        this.taskCounter = registry.counter("agent.tasks.total");
        this.taskTimer = registry.timer("agent.tasks.duration");
    }
    
    public void recordTask(String taskType) {
        taskCounter.increment();
        // Timer会自动记录耗时
    }
}
```

#### Grafana Dashboard

```json
{
  "panels": [
    {
      "title": "任务总数",
      "type": "graph",
      "expr": "sum(agent_tasks_total)",
      "legendFormat": "任务数"
    },
    {
      "title": "任务耗时分布",
      "type": "histogram",
      "expr": "histogram_quantile(0.95, sum(rate(agent_tasks_duration_seconds_bucket[5m])) by (le))"
    },
    {
      "title": "错误率",
      "type": "graph",
      "expr": "sum(rate(agent_tasks_errors_total[5m])) / sum(rate(agent_tasks_total[5m]))"
    }
  ]
}
```

---

## 11.3 实战：部署多Agent系统到测试环境

### 任务

将第8章的多Agent系统部署到Docker测试环境：

1. 构建Docker镜像  
2. 启动服务  
3. 验证监控指标  

### 实施步骤

#### 步骤1：构建镜像

```bash
# 1. 构建JAR
mvn clean package

# 2. 构建Docker镜像
docker build -t agentscope-textbook:latest .

# 3. 启动服务
docker-compose up -d
```

#### 步骤2：验证服务

```bash
# 检查服务状态
docker ps

# 查看日志
docker-compose logs -f agent-service

# 健康检查
curl http://localhost:8080/actuator/health
```

#### 步骤3：监控指标

```bash
# 查看Prometheus指标
curl http://localhost:8080/actuator/prometheus

# 输出示例：
# agent_tasks_total{type="sales",} 123.0
# agent_tasks_total{type="service",} 456.0
# agent_tasks_duration_seconds_sum{type="all",} 1234.56
# agent_tasks_duration_seconds_count{type="all",} 579.0
```

---

## 11.4 本章小结

| 要点 | 内容 |
|------|------|
| **部署模型** | Docker容器化 + Java启动参数优化 |
| **监控体系** | SLF4J日志 + Prometheus指标 + Grafana可视化 |
| **Java衔接** | `@Scheduled`定时任务、`MeterRegistry`指标注册 |

---

## 11.5 参考资源

- **Docker官方文档**：https://docs.docker.com  
- **Spring Boot Actuator**：https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html  
- **Prometheus官方文档**：https://prometheus.io/docs/introduction/overview/

---

## 11.6 本章考核

### 编程题

**实现自定义Agent指标**

要求：
1. 注册`agent_tasks_total`计数器  
2. 按任务类型分类统计  
3. 输出Prometheus格式指标  

```java
// 空白
@Component
public class AgentMetrics {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
