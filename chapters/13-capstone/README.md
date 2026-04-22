# 第13章：Capstone项目

> 教材完整内容（草稿 v1.8.0）

---

## 章节目录

| 节号 | 标题 | 学时 | 内容要点 |
|------|------|------|---------|
| 13.1 | 为什么需要本节技术？（现实场景引入） | 0.5 | 项目规划、系统设计、系统实现、项目交付的必要性 |
| 13.2 | 工具链与资源准备 | 0.5 | 需求分析、技术选型、团队分工、架构设计、模块设计 |
| 13.3 | 核心概念 | 1.0 | 项目规划、系统设计、系统实现、项目交付核心原理 |
| 13.4 | 最小可运行示例 | 1.5 | 完整项目结构、需求文档、系统设计、系统实现、项目交付 |
| 13.5 | 常见陷阱与调试技巧 | 1.0 | 需求分析、系统设计、系统实现、项目交付常见问题 |
| 13.6 | 课后练习 | 1.0 | 填空、改错、设计、挑战 |
| 13.7 | 本章小结与延伸阅读 | 0.5 | 知识树、延伸阅读推荐 |

**总学时**：4学时（对应课程总学时48学时）

---

## 为什么需要Capstone项目？

> **学习目标**：理解完整项目开发流程的必要性，建立工程化开发意识

### 场景1：项目需求不明确导致开发失败

| 问题 | 解决方案 |
|------|---------|
| 需求不明确 | 完整的需求分析、技术选型、团队分工 |

### 场景2：系统设计混乱导致开发困难

| 问题 | 解决方案 |
|------|---------|
| 系统设计混乱 | 完整的架构设计、模块设计、接口设计 |

### 场景3：项目交付质量低下

| 问题 | 解决方案 |
|------|---------|
| 交付质量低下 | 完整的单元测试、文档、演示脚本 |

### 小结与思考题

- 问题1：为什么需要需求分析？  
- 问题2：为什么需要系统设计？  
- 问题3：为什么需要项目交付？

---

## 工具链与资源准备

> **学习目标**：掌握Capstone项目开发所需的完整工具链配置

### 项目规划工具

| 工具 | 获取路径 | 说明 |
|------|---------|------|
| **用户故事** | 需求文档 | 用户需求描述 |
| **功能列表** | 需求文档 | 功能清单 |
| **优先级矩阵** | 需求文档 | 功能优先级 |

### 系统设计工具

| 工具 | 获取路径 | 说明 |
|------|---------|------|
| **架构图** | PlantUML | 架构图绘制 |
| **模块图** | PlantUML | 模块图绘制 |
| **接口定义** | OpenAPI | 接口定义 |

### 系统实现工具

| 工具 | 获取路径 | 说明 |
|------|---------|------|
| **IDE** | IntelliJ IDEA | 代码编辑 |
| **代码规范** | Checkstyle | 代码规范检查 |
| **单元测试** | JUnit + Mockito | 单元测试 |
| **集成测试** | Spring Boot Test | 集成测试 |

### 项目交付工具

| 工具 | 获取路径 | 说明 |
|------|---------|------|
| **README** | Markdown | 项目文档 |
| **API文档** | OpenAPI | API文档 |
| **演示脚本** | Markdown | 演示脚本 |

---

## 核心概念

> **学习目标**：掌握Capstone项目开发的核心原理

### 项目规划

| 特性 | 实现要点 |
|------|---------|
| **需求分析** | 需求收集、需求分析、需求文档 |
| **技术选型** | 成熟稳定、社区活跃、性能优秀、易于维护 |
| **团队分工** | 明确职责、技能匹配、合理负荷 |

### 系统设计

| 特性 | 实现要点 |
|------|---------|
| **架构设计** | 分层设计、模块化设计、松耦合、高内聚 |
| **模块设计** | 单一职责、接口定义、依赖注入 |
| **接口设计** | 稳定接口、清晰定义、错误处理 |

### 系统实现

| 特性 | 实现要点 |
|------|---------|
| **编码实现** | 代码规范、注释完整、单元测试 |
| **测试** | 单元测试（≥80%）、集成测试（≥70%）、系统测试（100%） |
| **部署** | Docker、K8s、CI/CD |

### 项目交付

| 特性 | 实现要点 |
|------|---------|
| **文档编写** | README、API文档、用户手册、运维手册 |
| **演示** | 演示脚本、演示环境、演示备份 |
| **评审** | 需求评审、设计评审、实现评审、交付评审 |

---

## 最小可运行示例

> **学习目标**：实现完整的Capstone项目，掌握项目开发全流程

### 项目结构

```
capstone-project/
├── docs/
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── CONTRIBUTING.md
├── requirements/
│   ├── 01-requirements.md
│   └── 02-technical-spec.md
├── design/
│   ├── 01-architecture.png
│   ├── 02-module.png
│   ├── 03-api.yaml
│   └── 04-database.sql
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── agentscope/
│   │   │           └── capstone/
│   │   └── resources/
│   └── test/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── cd.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── issue-templates/
├── Dockerfile
├── docker-compose.yml
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── pom.xml
├── .gitignore
└── build.sh
```

### 需求文档

**requirements/01-requirements.md**：
```markdown
# 需求文档 v1.0

## 1. 项目背景
- **项目名称**：Agent Capstone项目
- **项目目标**：实现一个完整的Agent系统，支持Agent协作、安全防护、性能监控

## 2. 用户需求
- 用户角色：管理员、用户
- 用户故事：管理员登录、查询Agent状态、处理请求

## 3. 功能需求
| 功能编号 | 功能名称 | 功能描述 | 优先级 |
|----------|----------|----------|--------|
| F001 | 用户登录 | 用户登录系统 | 高 |
| F002 | 查询Agent | 查询Agent状态 | 中 |
| F003 | 处理请求 | 处理用户请求 | 高 |

## 4. 非功能需求
- 性能需求：系统响应时间 ≤ 1s（QPS ≥ 100）
- 安全需求：支持RBAC、ABAC安全模型
- 可用性需求：系统可用性 ≥ 99.9%

## 5. 技术需求
| 模块 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Spring Boot | 3.2.5 |
| Agent框架 | agentscope-java | 0.2.0 |
| 消息队列 | Kafka | 3.6.0 |
| 安全框架 | Spring Security | 6.2 |
| 监控系统 | Prometheus | 2.47 |

## 6. 项目约束
- 时间约束：项目周期：2个月
- 成本约束：项目预算：¥50万
- 资源约束：团队规模：5人
```

### 系统设计

**design/03-api.yaml**：
```yaml
openapi: 3.0.0
info:
  title: Agent Capstone API
  version: 1.0.0
paths:
  /api/agent/status:
    get:
      summary: 查询Agent状态
      parameters:
        - name: agentId
          in: query
          required: true
          schema:
            type: string
```

### 系统实现

**src/main/java/com/agentscope/capstone/api/AgentController.java**：
```java
@RestController
@RequestMapping("/api/agent")
public class AgentController {
    
    @Autowired
    private AgentService agentService;
    
    @GetMapping("/status")
    public ResponseEntity<AgentStatus> getStatus(@RequestParam String agentId) {
        AgentStatus status = agentService.getStatus(agentId);
        return ResponseEntity.ok(status);
    }
}
```

### 配置文件

**docker-compose.yml**：
```yaml
version: '3.8'

services:
  agent-app:
    build: .
    ports:
      - "8080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
```

### CI/CD配置

**.github/workflows/ci.yml**：
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven
      - name: Build with Maven
        run: mvn -B package --file pom.xml
      - name: Run unit tests
        run: mvn test
```

### 项目交付

**docs/README.md**：
```markdown
# Agent Capstone项目

> Agent Capstone项目，实现一个完整的Agent系统，支持Agent协作、安全防护、性能监控。

## 🚀 特性

- ✅ **Agent协作**：支持Agent间协作
- ✅ **安全防护**：支持RBAC、ABAC安全模型
- ✅ **性能监控**：支持性能监控、日志采集

## 📦 安装

```bash
git clone https://github.com/lilirg/agentscope-java-textbook.git
cd capstone-project
mvn clean package
docker-compose up -d
```

## 💡 使用

访问 `http://localhost:8080` 查看Agent系统。

## 📚 API文档

访问 `http://localhost:8080/swagger-ui.html` 查看API文档。
```

---

## 常见陷阱与调试技巧

> **学习目标**：掌握Capstone项目开发中的典型问题与解决方案

### 需求分析陷阱

| 陷阱 | 解决方案 |
|------|---------|
| 需求不明确 | 需求评审、需求确认 |
| 需求变更 | 变更控制、版本管理 |

### 系统设计陷阱

| 陷阱 | 解决方案 |
|------|---------|
| 架构混乱 | 架构评审、架构文档 |
| 模块耦合高 | 依赖注入、接口定义 |

### 系统实现陷阱

| 陷阱 | 解决方案 |
|------|---------|
| 代码质量低 | 代码审查、单元测试 |
| 测试不完整 | 测试覆盖率、测试策略 |

### 项目交付陷阱

| 陷阱 | 解决方案 |
|------|---------|
| 文档不完整 | 文档评审、文档模板 |
| 演示失败 | 演示演练、演示备份 |

---

## 课后练习

> **学习目标**：通过实践巩固本章知识，掌握项目开发流程

### 基础填空（20分）

1. Capstone项目开发的四个阶段是：______、______、______、______  
2. 需求分析的三个步骤是：______、______、______  
3. 技术选型的四个原则是：______、______、______、______  

### 代码改错（30分）

1. 需求文档缺失（15分）  
2. 接口定义缺失（15分）

### 小型设计（30分）

1. 用户故事设计（15分）  
2. 架构图设计（15分）

### 拓展挑战（20分）

1. 需求变更处理（10分）  
2. CI/CD流程设计（10分）

---

## 本章小结与延伸阅读

> **学习目标**：回顾本章核心知识，拓展学习方向

### 知识树

```
Capstone项目（Chapter 13）
├── 项目规划（需求分析、技术选型、团队分工）
├── 系统设计（架构设计、模块设计、接口设计）
├── 系统实现（编码实现、测试、部署）
└── 项目交付（文档编写、演示、评审）
```

### 延伸阅读

| 文档 | 链接 |
|------|------|
| Spring Boot | [spring.io/projects/spring-boot](https://spring.io/projects/spring-boot) |
| Docker | [docs.docker.com](https://docs.docker.com/) |
| Kubernetes | [kubernetes.io](https://kubernetes.io/) |

---

> 版本：v1.8.0-alpha  
> 更新日期：2026-04-17  
> 学时：4学时
