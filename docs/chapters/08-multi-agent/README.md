# 第8章：多Agent协作系统

> 教材完整内容（草稿 v0.1.0）

---

## 章节目录

| 节号 | 标题 | 学时 | 内容要点 |
|------|------|------|---------|
| 8.1 | 为什么需要本节技术？（现实场景引入） | 0.5 | 复杂任务分解、Agent协作、角色专业化 |
| 8.2 | 工具链与资源准备 | 0.5 | Kafka、RabbitMQ、Redis Streams选型 |
| 8.3 | 核心概念 | 1.0 | 通信协议、角色分工、调度算法 |
| 8.4 | 最小可运行示例 | 1.5 | Kafka消息队列、Manager/Worker/Observer实现 |
| 8.5 | 常见陷阱与调试技巧 | 1.0 | Kafka连接失败、消息丢失、调度不生效 |
| 8.6 | 课后练习 | 1.0 | 填空、改错、设计、挑战 |
| 8.7 | 本章小结与延伸阅读 | 0.5 | 知识树、延伸阅读推荐 |

**总学时**：4学时（对应课程总学时48学时）

---

## 8.1 为什么需要本节技术？（现实场景引入）

> **学习目标**：理解多Agent协作的必要性

### 8.1.1 场景1：复杂任务分解与分工

| 问题 | 解决方案 |
|------|---------|
| 单Agent无法并行处理 | 多Agent分工协作（Manager+Workers） |

### 8.1.2 场景2：Agent能力不足时的协作

| 问题 | 解决方案 |
|------|---------|
| 单Agent能力单一 | 多Agent专业分工（财务/法律/文案） |

### 8.1.3 场景3：Agent角色专业化

| 问题 | 解决方案 |
|------|---------|
| 单Agent职责模糊 | 多Agent角色专业化（Manager/Worker/Observer） |

### 8.1.4 小结与思考题

- 问题1：为什么说"单Agent无法处理复杂任务"？
- 问题2：多Agent协作与单Agent调用多个工具的区别是什么？
- 问题3：如何选择多Agent的通信协议？

---

## 8.2 工具链与资源准备

> **学习目标**：掌握多Agent协作系统开发所需的完整工具链配置

### 8.2.1 开发环境（JDK、IDE、Maven）

| 工具 | 版本 | 获取路径 |
|------|------|---------|
| JDK | ≥17 | Adoptium |
| IDE | IntelliJ/Eclipse | JetBrains |
| Maven | ≥3.8 | Maven官网 |

### 8.2.2 消息队列

| 工具 | 获取路径 | 选型建议 |
|------|---------|---------|
| Kafka | kafka.apache.org | 高并发/大数据处理 |
| RabbitMQ | rabbitmq.com | 学习/演示环境 |
| Redis Streams | redis.io | 快速原型开发 |

---

## 8.3 核心概念

> **学习目标**：掌握多Agent协作系统的核心原理

### 8.3.1 通信协议

| 特性 | 说明 |
|------|------|
| 消息格式 | id/type/source/target/payload |
| Topic/Queue | Kafka使用Topic，RabbitMQ使用Queue |

### 8.3.2 角色分工

| 特性 | 说明 |
|------|------|
| Manager | 接收请求、任务分解、分发任务、整合结果 |
| Worker | 执行具体任务（图像识别、数据分析、写作） |
| Observer | 监控系统状态、收集日志 |

### 8.3.3 调度算法

| 特性 | 说明 |
|------|------|
| 轮询 | 按顺序分配任务（公平） |
| 随机 | 随机选择Worker（避免热点） |
| 优先级 | 根据优先级分配（高性能Worker处理高优先级任务） |

---

## 8.4 最小可运行示例

> **学习目标**：实现包含通信协议、角色分工、调度算法的完整多Agent系统

### 8.4.1 项目结构

```
multi-agent-system/
├── src/main/java/com/textbook/chapter8/
│   ├── MultiAgentSystem.java
│   ├── ManagerAgent.java
│   ├── WorkerAgent.java
│   ├── ObserverAgent.java
│   ├── MessageQueueClient.java
│   ├── Message.java
│   ├── SchedulingStrategy.java
│   ├── RoundRobinStrategy.java
│   ├── RandomStrategy.java
│   ├── PriorityStrategy.java
│   ├── ConfigLoader.java
│   └── Main.java
├── pom.xml
├── .env
└── README.md
```

### 8.4.2 关键代码

**Message.java**：
```java
public class Message {
    private String id;
    private String type;
    private String source;
    private String target;
    private Map<String, Object> payload;
    private long timestamp;
}
```

**RoundRobinStrategy.java**：
```java
public class RoundRobinStrategy implements SchedulingStrategy {
    private final AtomicInteger counter = new AtomicInteger(0);
    
    @Override
    public String selectWorker(List<String> workers, Message message) {
        int index = counter.getAndIncrement() % workers.size();
        return workers.get(index);
    }
}
```

**ManagerAgent.java**：
```java
public class ManagerAgent {
    private final MessageQueueClient messageQueueClient;
    private final SchedulingStrategy schedulingStrategy;
    private final List<String> workers;
    
    public void handleRequest(String request) {
        Message task = new Message(...);
        messageQueueClient.publish("tasks", task.toJson());
    }
}
```

---

## 8.5 常见陷阱与调试技巧

> **学习目标**：掌握多Agent协作系统开发中的典型问题

### 8.5.1 消息队列

| 问题 | 解决方案 |
|------|---------|
| Kafka连接失败 | 检查服务状态、网络连接、配置 |
| 消息丢失 | 检查Consumer订阅、Topic存在性、TTL |

### 8.5.2 Agent协作

| 问题 | 解决方案 |
|------|---------|
| 调度策略不生效 | 检查依赖注入、方法调用 |
| 消息循环依赖 | 消息追踪、转发次数限制 |

---

## 8.6 课后练习

> **学习目标**：通过实践巩固本章知识

### 8.6.1 基础填空（20分）

1. 消息格式包含 **5** 个关键字段（id/type/source/target/payload）  
2. Manager负责 **任务分配与结果整合**  
3. 调度策略有 **3** 种（轮询/随机/优先级）

### 8.6.2 代码改错（30分）

1. 静态变量导致多线程竞争
2. 缺少依赖注入注解

### 8.6.3 小型设计（30分）

设计`RabbitMQClient`类，实现消息发送与接收

### 8.6.4 拓展挑战（20分）

1. 调度策略优化（基于负载）
2. 多Agent系统性能优化

---

## 8.7 本章小结与延伸阅读

> **学习目标**：回顾核心知识，拓展学习方向

### 8.7.1 知识树

```
多Agent协作系统（Chapter 8）
├── 通信协议
├── 角色分工（Manager/Worker/Observer）
├── 调度算法（轮询/随机/优先级）
└── 系统监控（Kafka UI、RabbitMQ Management）
```

### 7.7.2 延伸阅读

| 文档 | 链接 |
|------|------|
| Kafka文档 | [kafka.apache.org](https://kafka.apache.org/documentation/) |
| RabbitMQ文档 | [rabbitmq.com](https://www.rabbitmq.com/documentation.html) |

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17  
> 学时：4学时
