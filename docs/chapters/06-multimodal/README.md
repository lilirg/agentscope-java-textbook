# 第6章：多模态输入处理

> 教材完整内容（草稿 v0.1.0）

---

## 章节目录

| 节号 | 标题 | 学时 | 内容要点 |
|------|------|------|---------|
| 6.1 | 为什么需要本节技术？（现实场景引入） | 0.5 | 图片/语音/图文混合的3个典型场景 |
| 6.2 | 工具链与资源准备 | 0.5 | JDK、IDE、Maven、Python、Whisper API等 |
| 6.3 | 核心概念 | 1.0 | CLIP（图文）、Whisper（语音）、多模态Agent |
| 6.4 | 最小可运行示例 | 1.5 | 完整代码（OpenCV、pydub、MultimodalInput） |
| 6.5 | 常见陷阱与调试技巧 | 1.0 | OpenCV加载失败、pydub转换失败等6类陷阱 |
| 6.6 | 课后练习 | 1.0 | 填空、改错、设计、挑战 |
| 6.7 | 本章小结与延伸阅读 | 0.5 | 知识树、延伸阅读推荐 |

**总学时**：4学时（对应课程总学时48学时）

---

## 为什么需要本节技术？（现实场景引入）

> **学习目标**：理解多模态输入设计的必要性

### 场景1：用户上传图片要求识别

| 问题 | 解决方案 |
|------|---------|
| 图片无法解析 → 无法识别药品成分 | CLIP模型：图片→向量 |

### 场景2：用户语音输入需求

| 问题 | 解决方案 |
|------|---------|
| 需要手动打字 → 效率低下 | Whisper API：语音→文字 |

### 场景3：图文混合输入

| 问题 | 解决方案 |
|------|---------|
| 图片中的结构信息无法利用 | CLIP：图文联合嵌入 |

### 小结与思考题

- 问题1：为什么说"CLIP模型让图片有了语义"？
- 问题2：如果用户上传10MB高清图片，如何优化？
- 问题3：Whisper API与本地Whisper模型的优劣？

---

## 工具链与资源准备

> **学习目标**：掌握多模态开发所需的完整工具链配置

### 开发环境（JDK、IDE、Maven、Python）

| 工具 | 版本 | 获取路径 |
|------|------|---------|
| JDK | ≥17 | Adoptium |
| IDE | IntelliJ/Eclipse | JetBrains |
| Maven | ≥3.8 | Maven官网 |
| Python | ≥3.8 | python.org |

### 密钥与配额（OpenAI Whisper API）

| 工具 | 获取路径 | 教育优惠 |
|------|---------|---------|
| Whisper API | platform.openai.com | ¥0.6/分钟 |
| Whisper.cpp | github.com/ggerganov/whisper.cpp | 免费（本地） |

### 依赖清单（Maven）

| 库名 | Maven坐标 | 版本 |
|------|----------|------|
| agentscope-java-spring | `com.alibaba.agentscope:agentscope-spring` | `0.2.0` |
| OpenCV | `org.openpnp:opencv` | `4.9.0` |

---

## 核心概念

> **学习目标**：掌握多模态输入的核心原理

### 图片输入处理（CLIP模型）

| 特性 | 说明 |
|------|------|
| 预处理 | OpenCV解码 + resize 224×224 + 归一化 |
| 颜色通道 | BGR（OpenCV） → RGB（CLIP） |
| 输出维度 | 512维/1024维向量 |

### 语音输入处理（Whisper模型）

| 特性 | 说明 |
|------|------|
| 预处理 | pydub格式转换 + 音频分段（30秒窗口） |
| 音频要求 | 16kHz单声道WAV格式 |
| 输出 | 文字序列（中文/英文等） |

### 多模态Agent设计

| 特性 | 说明 |
|------|------|
| 输入封装 | MultimodalInput（文本/图片/语音） |
| 特征融合 | 投影到统一空间（全连接层） |
| 线程安全 | ThreadLocal + 深拷贝 |

---

## 最小可运行示例

> **学习目标**：实现包含图片/语音/文本输入的完整Agent系统

### 项目结构

```
multimodal-agent/
├── src/main/java/com/textbook/chapter6/
│   ├── MultimodalAgent.java
│   ├── ImagePreprocessor.java
│   ├── SpeechPreprocessor.java
│   ├── MultimodalInput.java
│   ├── ConfigLoader.java
│   └── Main.java
├── pom.xml
├── .env
├── setup.py
└── README.md
```

### 关键代码

**ImagePreprocessor.java**：
```java
public class ImagePreprocessor {
    static {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
    }

    public static Mat decodeImage(byte[] imageData) {
        return Imgcodecs.imdecode(new MatOfByte(imageData), Imgcodecs.IMREAD_COLOR);
    }

    public static float[] preprocess(byte[] imageData) {
        Mat mat = null;
        try {
            mat = decodeImage(imageData);
            Mat resized = resizeImage(mat, 224, 224);
            return normalizeImage(resized);
        } finally {
            if (mat != null) mat.release();
        }
    }
}
```

**SpeechPreprocessor.java**：
```java
public class SpeechPreprocessor {
    public static String[] preprocess(byte[] audioData) {
        String wavPath = convertToWav(audioData);
        return segmentAudio(wavPath);
    }
}
```

**MultimodalInput.java**：
```java
public class MultimodalInput {
    private final String text;
    private final byte[] image;
    private final byte[] audio;

    public static MultimodalInput ofImage(byte[] image) {
        return new MultimodalInput(null, Arrays.copyOf(image, image.length), null);
    }
}
```

---

## 常见陷阱与调试技巧

> **学习目标**：掌握多模态开发中的典型问题与解决方案

### 图片输入

| 问题 | 解决方案 |
|------|---------|
| OpenCV库加载失败 | System.load() + 检查java.library.path |
| 图片格式不支持 | 检查Magic Number（JPEG/PNG/GIF） |
| 内存溢出 | Mat.release() + ThreadLocal |

### 语音输入

| 问题 | 解决方案 |
|------|---------|
| pydub转换失败 | 安装ffmpeg |
| Whisper API超时 | 音频分段 + 指数退避重试 |
| 音频格式不支持 | 限制为mp3/wav格式 |

### 多模态系统

| 问题 | 解决方案 |
|------|---------|
| 线程安全 | ThreadLocal + 深拷贝 |
| 性能优化 | 降采样 + 缓存预处理结果 |

---

## 课后练习

> **学习目标**：通过实践巩固本章知识

### 基础填空（20分）

1. OpenCV默认颜色通道顺序是 **BGR**，CLIP模型需要的顺序是 **RGB**。
2. Whisper单次处理上限为 **30** 秒。
3. 图片预处理必须调用 **Mat.release()** 释放资源。

### 代码改错（30分）

1. 全局共享Mat导致线程不安全
2. 未处理音频分段边界条件

### 小型设计（30分）

设计`MultimodalInputValidator`类，验证输入有效性

### 拓展挑战（20分）

1. 图片降采样优化
2. Whisper API重试机制

---

## 本章小结与延伸阅读

> **学习目标**：回顾核心知识，拓展学习方向

### 知识树

```
多模态输入处理（Chapter 6）
├── 图片输入（Image Input）
│   ├── 预处理：OpenCV解码 + resize + 归一化
│   └── 模型：CLIP（Contrastive Language–Image Pretraining）
├── 语音输入（Speech Input）
│   ├── 预处理：pydub格式转换 + 音频分段
│   └── 模型：Whisper（端到端ASR）
└── 多模态Agent设计
    ├── 输入封装：MultimodalInput
    ├── 特征融合：投影到统一空间
    ├── 线程安全：ThreadLocal + 深拷贝
    └── 资源管理：OpenCV Mat.release() + 临时文件清理
```

### 延伸阅读

| 文档 | 链接 |
|------|------|
| OpenCV文档 | [docs.opencv.org](https://docs.opencv.org) |
| CLIP论文 | [arXiv:2103.00020](https://arxiv.org/abs/2103.00020) |
| Whisper论文 | [arXiv:2212.04356](https://arxiv.org/abs/2212.04356) |

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17  
> 学时：4学时
