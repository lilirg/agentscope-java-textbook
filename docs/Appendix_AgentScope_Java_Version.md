# AgentScope-Java版本说明

> 本教材以 **AgentScope-Java v0.2.0**（2026Q1稳定版）为参照框架

---

## 版本信息

| 项目 | 值 |
|------|------|
| **版本号** | v0.2.0 |
| **发布日期** | 2026年Q1 |
| **稳定程度** | 生产可用（GA） |
| **Java版本要求** | JDK 17+ |

---

## 核心模块

| 模块 | 功能 | 对应教材章节 |
|------|------|------------|
| `agentscope-core` | Agent核心组件（Planning、Tools、Memory） | 第4章、第7章 |
| `agentscope-jdbc` | JDBC工具集成 | 第4章 |
| `agentscope-langchain` | LangChain桥接支持 | 第7章 |
| `agentscope-spring` | Spring Boot集成 | 第7章、第11章 |
| `agentscope-monitor` | 监控与可观测性 | 第11章 |

---

## 与教材的映射关系

### 第7章：AgentScope-Java核心模块分析

| AgentScope-Java类 | 功能 | 教材对应内容 |
|------------------|------|------------|
| `Agent` | Agent实例 | 7.1节：核心模块划分 |
| `AgentSession` | 会话管理 | 5.1节：短期记忆 |
| `MemoryManager` | 记忆管理 | 5.2节：长期记忆与RAG |
| `ToolExecutor` | 工具执行器 | 4.2节：工具绑定 |
| `Planner` | 规划器 | 4.1节：Agent架构 |
| `AgentRunner` | Agent运行时 | 7.2节：配置管理 |

### 第8章：多Agent协作系统

| AgentScope-Java特性 | 功能 | 教材对应内容 |
|-------------------|------|------------|
| `AgentGroup` | Agent组管理 | 8.1节：协作模式 |
| `MessageQueue` | 消息队列 | 8.2节：通信协议 |
| `TaskScheduler` | 任务调度 | 8.2节：任务调度 |

---

## 替代方案（如版本升级）

| 功能 | AgentScope-Java v0.2.0 | 替代方案 |
|------|----------------------|---------|
| 核心Agent | `Agent`类 | 自定义实现（第4章方案） |
| 会话管理 | `AgentSession` | 本地存储（JSON序列化） |
| 工具注册 | `ToolExecutor` | 策略模式+Map注册 |

> 教材保持**框架中立性**，核心内容不依赖具体API

---

## 下载与安装

### Maven依赖

```xml
<dependency>
    <groupId>com.alibaba.agentscope</groupId>
    <artifactId>agentscope-spring</artifactId>
    <version>0.2.0</version>
</dependency>
```

### Gradle依赖

```groovy
implementation 'com.alibaba.agentscope:agentscope-spring:0.2.0'
```

---

> 版本更新日志：  
> - 2026-04-17：初始化教材映射  
> - 未来：随AgentScope-Java版本更新同步调整
