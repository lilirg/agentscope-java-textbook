import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AgentScope-Java 实战',
  description: '从零到企业级 AI 应用开发',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  base: '/agentscope-java-textbook/',
  head: [
    ['link', { rel: 'icon', href: '/agentscope-java-textbook/icons/pwa-192.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/agentscope-java-textbook/icons/pwa-192.png' }],
    ['link', { rel: 'manifest', href: '/agentscope-java-textbook/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#4A90E2' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '课程',
        items: [
          { text: '第1章：认识AI Agent', link: '/chapters/01-introduction/1.1-why-need.md' },
          { text: '第2章：提示词工程与LLM API接入', link: '/chapters/02-prompt-engineering/2.1-why-need.md' },
          { text: '第3章：本地与云端API接入实践', link: '/chapters/03-api-integration/3.1-why-need.md' },
          { text: '第4章：Agent架构设计', link: '/chapters/04-agent-architecture/4.1-why-need.md' },
          { text: '第5章：记忆与RAG', link: '/chapters/05-memory-rag/05.1-why-need.md' },
          { text: '第6章：多模态', link: '/chapters/06-multimodal/06.1-why-need.md' },
          { text: '第7章：AgentScope-Java核心模块', link: '/chapters/07-agentscope-core/07.1-why-need.md' },
          { text: '第8章：多Agent协作', link: '/chapters/08-multi-agent/08.1-why-need.md' },
          { text: '第9章：安全与防护', link: '/chapters/09-security/09.1-why-need.md' },
          { text: '第10章：性能优化', link: '/chapters/10-performance/10.1-why-need.md' },
          { text: '第11章：部署与监控', link: '/chapters/11-deployment/11.1-why-need.md' },
          { text: '第12章：文档与规范', link: '/chapters/12-documentation/12.1-why-need.md' },
          { text: '第13章：Capstone项目', link: '/chapters/13-capstone/13.1-why-need.md' }
        ]
      },
      { text: '附录', link: '/Appendix_A-core-concepts.md' },
      { text: 'GitHub', link: 'https://github.com/lilirg/agentscope-java-textbook', target: '_blank' },
      { text: 'AgentScope-Java 官方', link: 'https://doc.agentscope.io/zh_CN/index.html', target: '_blank' }
    ],

    sidebar: {
      '/chapters/01-introduction/': [
        {
          text: '第1章：认识AI Agent',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/01-introduction/1.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/01-introduction/1.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/01-introduction/1.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/01-introduction/1.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/01-introduction/1.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/01-introduction/1.6-exercises.md' },
            { text: '本章小结', link: '/chapters/01-introduction/1.7-summary.md' }
          ]
        }
      ],
      '/chapters/02-prompt-engineering/': [
        {
          text: '第2章：提示词工程与LLM API接入',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/02-prompt-engineering/2.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/02-prompt-engineering/2.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/02-prompt-engineering/2.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/02-prompt-engineering/2.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/02-prompt-engineering/2.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/02-prompt-engineering/2.6-exercises.md' },
            { text: '本章小结', link: '/chapters/02-prompt-engineering/2.7-summary.md' }
          ]
        }
      ],
      '/chapters/03-api-integration/': [
        {
          text: '第3章：本地与云端API接入实践',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/03-api-integration/3.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/03-api-integration/3.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/03-api-integration/3.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/03-api-integration/3.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/03-api-integration/3.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/03-api-integration/3.6-exercises.md' },
            { text: '本章小结', link: '/chapters/03-api-integration/3.7-summary.md' }
          ]
        }
      ],
      '/chapters/04-agent-architecture/': [
        {
          text: '第4章：Agent架构设计',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/04-agent-architecture/4.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/04-agent-architecture/4.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/04-agent-architecture/4.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/04-agent-architecture/4.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/04-agent-architecture/4.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/04-agent-architecture/4.6-exercises.md' },
            { text: '本章小结', link: '/chapters/04-agent-architecture/4.7-summary.md' }
          ]
        }
      ],
      '/chapters/05-memory-rag/': [
        {
          text: '第5章：记忆与RAG',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/05-memory-rag/05.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/05-memory-rag/05.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/05-memory-rag/05.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/05-memory-rag/05.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/05-memory-rag/05.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/05-memory-rag/05.6-exercises.md' },
            { text: '本章小结', link: '/chapters/05-memory-rag/05.7-summary.md' }
          ]
        }
      ],
      '/chapters/06-multimodal/': [
        {
          text: '第6章：多模态',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/06-multimodal/06.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/06-multimodal/06.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/06-multimodal/06.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/06-multimodal/06.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/06-multimodal/06.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/06-multimodal/06.6-exercises.md' },
            { text: '本章小结', link: '/chapters/06-multimodal/06.7-summary.md' }
          ]
        }
      ],
      '/chapters/07-agentscope-core/': [
        {
          text: '第7章：AgentScope-Java核心模块',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/07-agentscope-core/07.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/07-agentscope-core/07.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/07-agentscope-core/07.3-core-concepts.md' },
            { text: '核心模块', link: '/chapters/07-agentscope-core/07.3-core-modules.md' },
            { text: '配置机制', link: '/chapters/07-agentscope-core/07.4-configuration.md' },
            { text: '最小可运行示例', link: '/chapters/07-agentscope-core/07.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/07-agentscope-core/07.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/07-agentscope-core/07.6-exercises.md' },
            { text: '本章小结', link: '/chapters/07-agentscope-core/07.7-summary.md' }
          ]
        }
      ],
      '/chapters/08-multi-agent/': [
        {
          text: '第8章：多Agent协作',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/08-multi-agent/08.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/08-multi-agent/08.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/08-multi-agent/08.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/08-multi-agent/08.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/08-multi-agent/08.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/08-multi-agent/08.6-exercises.md' },
            { text: '本章小结', link: '/chapters/08-multi-agent/08.7-summary.md' }
          ]
        }
      ],
      '/chapters/09-security/': [
        {
          text: '第9章：安全与防护',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/09-security/09.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/09-security/09.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/09-security/09.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/09-security/09.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/09-security/09.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/09-security/09.6-exercises.md' },
            { text: '本章小结', link: '/chapters/09-security/09.7-summary.md' }
          ]
        }
      ],
      '/chapters/10-performance/': [
        {
          text: '第10章：性能优化',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/10-performance/10.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/10-performance/10.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/10-performance/10.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/10-performance/10.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/10-performance/10.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/10-performance/10.6-exercises.md' },
            { text: '本章小结', link: '/chapters/10-performance/10.7-summary.md' }
          ]
        }
      ],
      '/chapters/11-deployment/': [
        {
          text: '第11章：部署与监控',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/11-deployment/11.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/11-deployment/11.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/11-deployment/11.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/11-deployment/11.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/11-deployment/11.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/11-deployment/11.6-exercises.md' },
            { text: '本章小结', link: '/chapters/11-deployment/11.7-summary.md' }
          ]
        }
      ],
      '/chapters/12-documentation/': [
        {
          text: '第12章：文档与规范',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/12-documentation/12.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/12-documentation/12.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/12-documentation/12.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/12-documentation/12.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/12-documentation/12.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/12-documentation/12.6-exercises.md' },
            { text: '本章小结', link: '/chapters/12-documentation/12.7-summary.md' }
          ]
        }
      ],
      '/chapters/13-capstone/': [
        {
          text: '第13章：Capstone项目',
          items: [
            { text: '为什么需要本节技术？', link: '/chapters/13-capstone/13.1-why-need.md' },
            { text: '工具链与资源准备', link: '/chapters/13-capstone/13.2-toolchain.md' },
            { text: '核心概念', link: '/chapters/13-capstone/13.3-core-concepts.md' },
            { text: '最小可运行示例', link: '/chapters/13-capstone/13.4-minimal-example.md' },
            { text: '常见陷阱与调试技巧', link: '/chapters/13-capstone/13.5-common-traps.md' },
            { text: '课后练习', link: '/chapters/13-capstone/13.6-exercises.md' },
            { text: '本章小结', link: '/chapters/13-capstone/13.7-summary.md' }
          ]
        }
      ],
      '/Appendix_': [
        {
          text: '附录',
          items: [
            { text: '附录A：核心概念', link: '/Appendix_A-core-concepts.md' },
            { text: '附录B：工具链', link: '/Appendix_B-toolchain.md' },
            { text: '附录C：常见问题', link: '/Appendix_C-faq.md' },
            { text: 'AgentScope-Java 版本说明', link: '/Appendix_AgentScope_Java_Version.md' }
          ]
        }
      ],
      '/': [
        {
          text: '简介',
          items: [
            { text: '课程介绍', link: '/index.md' },
            { text: '教材目录', link: '/README.md' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lilirg/agentscope-java-textbook' }
    ],

    footer: {
      message: '版本：v0.1.0-alpha | 更新日期：2026-04-17',
      copyright: 'CC BY-NC-SA 4.0'
    }
  }
})