/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // 导论与路线
  guideSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '课程导论',
    },
    {
      type: 'doc',
      id: 'roadmap',
      label: '学习路线图',
    },
  ],

  // 零基础起步：0 到 1 搭建项目
  bootstrapSidebar: [
    {
      type: 'category',
      label: '零基础起步',
      collapsed: false,
      items: [
        'bootstrap/env-prepare',
        'bootstrap/frontend-init-vite-react',
        'bootstrap/backend-init-springboot',
        'bootstrap/fullstack-run-first',
      ],
    },
  ],

  // AI 辅助开发工具
  aiToolsSidebar: [
    {
      type: 'category',
      label: 'AI 辅助开发',
      collapsed: false,
      items: [
        'ai-tools/cloudcode-guide',
        'ai-tools/cursor-practice',
        'ai-tools/copilot-best-practice',
        'ai-tools/prompt-for-fullstack',
      ],
    },
  ],

  // 前端 React
  frontendSidebar: [
    {
      type: 'category',
      label: '前端 React',
      collapsed: false,
      items: [
        'frontend/overview',
        'frontend/react-quickstart',
        'frontend/hooks',
        'frontend/routing',
        'frontend/state-management',
        'frontend/data-fetching',
        'frontend/ts-react',
      ],
    },
  ],

  // 后端 Java
  backendSidebar: [
    {
      type: 'category',
      label: '后端 Java',
      collapsed: false,
      items: [
        'backend/overview',
        'backend/java-core',
        'backend/spring-boot-quickstart',
        'backend/persistence',
        'backend/security-jwt',
        'backend/api-doc',
      ],
    },
  ],

  // MyBatis 持久层（含 MyBatis-Plus 扩展）
  mybatisSidebar: [
    {
      type: 'category',
      label: 'MyBatis 持久层',
      collapsed: false,
      items: [
        'mybatis/overview',
        'mybatis/datasource-config',
        'mybatis/crud-xml',
        'mybatis/annotation',
        'mybatis/pagination',
        'mybatis/plus-extension',
        'mybatis/react-integration',
      ],
    },
  ],

  // 前后端集成与工程化
  integrationSidebar: [
    {
      type: 'category',
      label: '集成与工程化',
      collapsed: false,
      items: ['integration/rest-contract', 'integration/devops'],
    },
  ],

  // AI 集成
  aiSidebar: [
    {
      type: 'category',
      label: 'AI 集成',
      collapsed: false,
      items: [
        'ai/overview',
        'ai/llm-api',
        'ai/rag',
        'ai/streaming',
        'ai/agent',
      ],
    },
  ],

  // 实战项目
  projectSidebar: [
    {
      type: 'category',
      label: '实战项目：AI 对话应用',
      collapsed: false,
      items: ['project/overview', 'project/step1-backend', 'project/step2-frontend'],
    },
  ],

  // 附录
  appendixSidebar: [
    {
      type: 'category',
      label: '附录',
      collapsed: false,
      items: ['appendix/commands', 'appendix/faq'],
    },
  ],
};

export default sidebars;
