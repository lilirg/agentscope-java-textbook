# 第11章：部署与监控

> 教材完整内容（草稿 v1.7.0）

---

## 章节目录

| 节号 | 标题 | 学时 | 内容要点 |
|------|------|------|---------|
| 11.1 | 为什么需要本节技术？（现实场景引入） | 0.5 | 部署失败、故障未及时发现、问题无法定位 |
| 11.2 | 工具链与资源准备 | 0.5 | Docker、K8s、Prometheus、Grafana、ELK、Loki |
| 11.3 | 核心概念 | 1.0 | Docker容器化、K8s集群、Prometheus监控、告警系统、日志分析 |
| 11.4 | 最小可运行示例 | 1.5 | 项目结构、AgentService、AlertService、PerformanceMonitor、LoggingService |
| 11.5 | 常见陷阱与调试技巧 | 1.0 | Docker镜像过大、容器无法启动、Prometheus采集失败、告警未触发、日志索引失败 |
| 11.6 | 课后练习 | 1.0 | 填空、改错、设计、挑战 |
| 11.7 | 本章小结与延伸阅读 | 0.5 | 知识树、延伸阅读推荐 |

**总学时**：4学时（对应课程总学时48学时）

---

## 11.1 为什么需要本节技术？（现实场景引入）

> **学习目标**：理解生产环境部署与监控的必要性

### 11.1.1 场景1：生产环境部署失败

| 问题 | 解决方案 |
|------|---------|
| 部署失败 | 多阶段构建、环境一致性验证、健康检查 |

### 11.1.2 场景2：系统故障无法及时发现

| 问题 | 解决方案 |
|------|---------|
| 故障未及时发现 | Prometheus + Grafana监控 + 告警系统 |

### 11.1.3 场景3：系统问题无法快速定位

| 问题 | 解决方案 |
|------|---------|
| 问题无法定位 | ELK/Loki日志聚合 + 索引 + 分析 |

### 11.1.4 小结与思考题

- 问题1：为什么需要多阶段构建？  
- 问题2：如何设计监控告警系统？  
- 问题3：ELK与Loki的区别是什么？

---

## 11.2 工具链与资源准备

> **学习目标**：掌握部署与监控开发所需的完整工具链配置

### 11.2.1 开发环境

| 工具 | 版本 | 获取路径 |
|------|------|---------|
| JDK | ≥17 | Adoptium |
| Maven | ≥3.8 | Maven官网 |
| IDE | IntelliJ IDEA | JetBrains |

### 11.2.2 容器化与部署工具

| 工具 | 版本 | 获取路径 |
|------|------|---------|
| Docker | ≥24 | Docker官网 |
| Kubernetes | ≥1.28 | K8s官网 |

### 11.2.3 监控系统工具

| 工具 | 版本 | 获取路径 |
|------|------|---------|
| Prometheus | ≥2.47 | Prometheus官网 |
| Grafana | ≥11 | Grafana官网 |
| Micrometer | 1.12.5 | Maven Central |

---

## 11.3 核心概念

> **学习目标**：掌握部署与监控的核心原理

### 11.3.1 Docker容器化部署

| 特性 | 实现要点 |
|------|---------|
| 多阶段构建 | 减小镜像体积 |
| 健康检查 | livenessProbe、readinessProbe |
| 资源限制 | requests、limits |

### 11.3.2 Kubernetes集群部署

| 特性 | 实现要点 |
|------|---------|
| Deployment | 管理无状态应用 |
| Service | 负载均衡 |
| HPA | 自动扩缩容 |

### 11.3.3 Prometheus监控系统

| 特性 | 实现要点 |
|------|---------|
| 指标收集 | Actuator暴露指标 |
| 指标存储 | Prometheus时序数据库 |
| 可视化 | Grafana仪表盘 |

### 11.3.4 告警系统配置

| 特性 | 实现要点 |
|------|---------|
| 告警规则 | Prometheus AlertManager |
| 钉钉告警 | Webhook通知 |
| 邮件告警 | SMTP通知 |

### 11.3.5 日志分析

| 特性 | 实现要点 |
|------|---------|
| ELK | Elasticsearch + Logstash + Kibana |
| Loki | Promtail + Loki + Grafana |

---

## 11.4 最小可运行示例

> **学习目标**：实现完整的部署与监控系统

### 11.4.1 项目结构

```
deployment-monitoring-system/
├── src/main/java/com/textbook/chapter11/
│   ├── DeploymentSystem.java
│   ├── AgentService.java
│   ├── AlertService.java
│   ├── PerformanceMonitor.java
│   ├── LoggingService.java
│   └── Main.java
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── prometheus/
│   ├── prometheus.yml
│   └── alerts.yml
├── grafana/
│   └── dashboards/
├── elasticsearch/
│   └── logstash.conf
├── loki/
│   └── promtail-config.yml
├── pom.xml
└── README.md
```

### 11.4.2 关键代码

**AgentService.java**：Agent服务与指标收集  
**AlertService.java**：告警服务（钉钉、邮件）  
**PerformanceMonitor.java**：性能监控与指标注册  
**LoggingService.java**：日志服务

---

## 11.5 常见陷阱与调试技巧

> **学习目标**：掌握典型问题与解决方案

### 11.5.1 Docker容器化部署

| 问题 | 解决方案 |
|------|---------|
| Docker镜像过大 | 多阶段构建、精简基础镜像、排除调试文件 |
| 容器无法启动 | 检查JVM参数、端口、环境变量 |

### 11.5.2 Prometheus监控系统

| 问题 | 解决方案 |
|------|---------|
| Prometheus数据采集失败 | 暴露Actuator端点、检查Prometheus配置、检查网络 |

### 11.5.3 告警系统配置

| 问题 | 解决方案 |
|------|---------|
| 告警未触发 | 检查告警规则、AlertManager配置、通知配置 |

---

## 11.6 课后练习

> **学习目标**：通过实践巩固本章知识

### 11.6.1 基础填空（20分）

1. Docker优化方式（多阶段构建/精简基础镜像/排除调试文件）  
2. Prometheus监控指标（CPU/内存/响应时间/API错误率）  
3. 告警通知方式（钉钉/邮件）  
4. ELK组件（Elasticsearch/Logstash/Kibana）

### 11.6.2 代码改错（30分）

1. Docker镜像优化错误  
2. Prometheus配置错误

### 11.6.3 小型设计（30分）

设计告警服务类

### 11.6.4 拓展挑战（20分）

1. Kubernetes部署优化  
2. 日志分析系统搭建

---

## 11.7 本章小结与延伸阅读

> **学习目标**：回顾核心知识，拓展学习方向

### 11.7.1 知识树

```
部署与监控（Chapter 11）
├── Docker容器化部署
├── Kubernetes集群部署
├── Prometheus监控系统
├── 告警系统配置
└── 日志分析
```

### 11.7.2 延伸阅读

| 文档 | 链接 |
|------|------|
| Docker | [docs.docker.com](https://docs.docker.com/) |
| Kubernetes | [kubernetes.io/docs](https://kubernetes.io/docs/) |
| Prometheus | [prometheus.io/docs](https://prometheus.io/docs/) |
| Grafana | [grafana.com/docs](https://grafana.com/docs/) |

---

> 版本：v1.7.0-alpha  
> 更新日期：2026-04-17  
> 学时：4学时
