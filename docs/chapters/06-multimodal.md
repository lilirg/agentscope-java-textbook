# 第6章 多模态输入处理

> **学习目标**  
> - 应用：实现图文/语音输入Agent  
> - 创造：设计多模态工具调用流程  

---

## 6.1 图片处理

### 6.1.1 图像OCR工具集成

#### Tesseract OCR（Java示例）

```java
// 1. 安装Tesseract（Windows）
// 下载：https://github.com/UB-Mannheim/tesseract/wiki
// 添加到PATH：C:\Program Files\Tesseract-OCR

// 2. 添加Maven依赖
// <dependency>
//     <groupId>net.sourceforge.tess4j</groupId>
//     <artifactId>tess4j</artifactId>
//     <version>5.11.0</version>
// </dependency>

@Service
public class OCRService {
    
    private final ITesseract tesseract = new Tesseract();
    
    @PostConstruct
    public void init() {
        // 设置Tesseract数据路径
        tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
        // 设置语言（中文）
        tesseract.setLanguage("chi_sim+eng");
    }
    
    /**
     * 图片转文字
     */
    public String extractText(String imagePath) {
        try {
            BufferedImage image = ImageIO.read(new File(imagePath));
            return tesseract.doOCR(image);
        } catch (TesseractException | IOException e) {
            log.error("OCR处理失败", e);
            throw new RuntimeException("图片文字提取失败", e);
        }
    }
}
```

### 6.1.2 图片理解（LLM多模态）

#### OpenAI GPT-4 Vision（Java示例）

```java
@Service
public class VisionService {
    
    private final OpenAI api;
    
    public VisionService() {
        String apiKey = System.getenv("OPENAI_API_KEY");
        api = new OpenAI(apiKey);
    }
    
    /**
     * 图片理解
     */
    public String understandImage(String imageUrl, String prompt) {
        ImageUrl image = new ImageUrl(imageUrl);
        
        ChatMessage message = new ChatMessage("user", List.of(
            new ContentPiece.Text(prompt),
            new ContentPiece.Image(image)
        ));
        
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("gpt-4o")
            .messages(List.of(message))
            .build();
        
        return api.createChatCompletion(request).choices().get(0).message().content();
    }
}
```

---

## 6.2 语音处理

### 6.2.1 语音转文本（Whisper）

#### Whisper API（Java示例）

```java
// 1. 安装Whisper Server（Docker）
// docker run -p 9000:9000 ghcr.io/ufal/whisper_asr:main

@Service
public class SpeechToTextService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * 语音转文字
     */
    public String transcribe(String audioFilePath) {
        File audioFile = new File(audioFilePath);
        
        MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("file", new FileSystemResource(audioFile));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        HttpEntity<MultiValueMap<String, Object>> request = 
            new HttpEntity<>(requestBody, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(
            "http://localhost:9000/transcribe",
            request,
            Map.class
        );
        
        return (String) response.getBody().get("text");
    }
}
```

### 6.2.2 语音合成（Text-to-Speech）

#### OpenAI TTS（Java示例）

```java
@Service
public class TextToSpeechService {
    
    private final OpenAI api;
    
    public TextToSpeechService() {
        api = new OpenAI(System.getenv("OPENAI_API_KEY"));
    }
    
    /**
     * 文字转语音
     */
    public byte[] synthesize(String text) {
        CreateSpeechRequest request = CreateSpeechRequest.builder()
            .model("tts-1")
            .input(text)
            .voice("alloy")
            .responseFormat("mp3")
            .build();
        
        return api.createSpeech(request).audio();
    }
    
    /**
     * 保存语音文件
     */
    public void saveAudio(byte[] audio, String outputPath) {
        try (FileOutputStream fos = new FileOutputStream(outputPath)) {
            fos.write(audio);
        } catch (IOException e) {
            log.error("保存音频失败", e);
        }
    }
}
```

---

## 6.3 实战：构建图文识别Agent

### 任务

构建一个图文识别Agent，支持：
1. 用户拍照/上传图片  
2. 识别图片中的文字（OCR）  
3. 理解图片内容（LLM多模态）  
4. 语音回答（TTS）

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Web/APP)                  │
│  [拍照按钮] [上传图片] [语音输入]                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Agent Core                                │
│  1. Image Upload → OCR Service (提取文字)                   │
│  2. Image Upload → Vision Service (理解内容)                │
│  3. Speech Input → STT Service (语音转文字)                 │
│  4. Result → TTS Service (语音回答)                         │
└─────────────────────────────────────────────────────────────┘
```

### 核心代码

```java
@RestController
public class MultimodalController {
    
    @Autowired
    private OCRService ocrService;
    
    @Autowired
    private VisionService visionService;
    
    @Autowired
    private SpeechToTextService sttService;
    
    @Autowired
    private TextToSpeechService ttsService;
    
    /**
     * 图片OCR
     */
    @PostMapping("/ocr")
    public String extractText(@RequestParam("file") MultipartFile file) {
        String tempPath = saveToFile(file);
        return ocrService.extractText(tempPath);
    }
    
    /**
     * 图片理解
     */
    @PostMapping("/vision")
    public String understand(@RequestParam("file") MultipartFile file, 
                             @RequestParam("prompt") String prompt) {
        String tempPath = saveToFile(file);
        // 上传到CDN获取URL（简化版）
        String imageUrl = uploadToCDN(tempPath);
        return visionService.understandImage(imageUrl, prompt);
    }
    
    /**
     * 语音转文字
     */
    @PostMapping("/stt")
    public String transcribe(@RequestParam("file") MultipartFile file) {
        String tempPath = saveToFile(file);
        return sttService.transcribe(tempPath);
    }
    
    /**
     * 文字转语音
     */
    @PostMapping("/tts")
    public ResponseEntity<byte[]> synthesize(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        byte[] audio = ttsService.synthesize(text);
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("audio/mpeg"))
            .body(audio);
    }
    
    // 辅助方法
    private String saveToFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "." + 
                FilenameUtils.getExtension(file.getOriginalFilename());
            Path tempPath = Paths.get("temp/" + fileName);
            Files.createDirectories(tempPath.getParent());
            file.transferTo(tempPath.toFile());
            return tempPath.toString();
        } catch (IOException e) {
            throw new RuntimeException("文件保存失败", e);
        }
    }
    
    private String uploadToCDN(String localPath) {
        // 简化版：返回本地路径
        // 实际需上传到OSS/S3等
        return "http://localhost:8080/temp/" + localPath;
    }
}
```

---

## 6.4 本章小结

| 要点 | 内容 |
|------|------|
| **OCR** | Tesseract Java封装 + 多语言支持 |
| **多模态** | OpenAI GPT-4 Vision API |
| **语音** | Whisper STT + OpenAI TTS |

---

## 6.5 参考资源

- **Tesseract文档**：https://tesseract-ocr.github.io  
- **Whisper文档**：https://github.com/ufal/whisper_asr  
- **OpenAI多模态API**：https://platform.openai.com/docs/guides/vision

---

## 6.6 本章考核

### 编程题

**实现图文识别Agent的前端接口**

要求：
1. 支持图片上传（multipart/form-data）  
2. 返回OCR识别结果  
3. 支持语音输入（转文字）  

```java
// 空白
@PostMapping("/multimodal")
public ResponseEntity<Map<String, String>> processMultimodal(
    @RequestParam(value = "file", required = false) MultipartFile file,
    @RequestParam(value = "audio", required = false) MultipartFile audio
) {
    // 待实现
}
```

---

> 版本：v0.1.0-alpha  
> 更新日期：2026-04-17
