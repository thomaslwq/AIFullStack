// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI FullStack 工程师教程',
  tagline: '前端 React · 后端 Java · AI 集成 · 实战落地，一套从入门到全栈交付的体系化课程',
  favicon: 'img/favicon.svg',
  url: 'https://thomaslwq.github.io',
  baseUrl: '/AIFullStack/',
  organizationName: 'thomaslwq',
  projectName: 'AIFullStack',
  onBrokenLinks: 'warn',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/thomaslwq/AIFullStack/edit/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'AI FullStack',
        logo: {
          alt: 'AI FullStack Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'bootstrapSidebar',
            position: 'left',
            label: '零基础起步',
          },
          {
            type: 'docSidebar',
            sidebarId: 'aiToolsSidebar',
            position: 'left',
            label: 'AI 辅助开发',
          },
          {
            type: 'docSidebar',
            sidebarId: 'frontendSidebar',
            position: 'left',
            label: '前端 React',
          },
          {
            type: 'docSidebar',
            sidebarId: 'backendSidebar',
            position: 'left',
            label: '后端 Java',
          },
          {
            type: 'docSidebar',
            sidebarId: 'mybatisSidebar',
            position: 'left',
            label: 'MyBatis',
          },
          {
            type: 'docSidebar',
            sidebarId: 'aiSidebar',
            position: 'left',
            label: 'AI 集成',
          },
          {
            type: 'docSidebar',
            sidebarId: 'projectSidebar',
            position: 'left',
            label: '实战项目',
          },
          {
            href: 'https://github.com/thomaslwq/AIFullStack',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '课程',
            items: [
              { label: '导论与路线', to: '/docs/intro' },
              { label: '前端 React', to: '/docs/frontend/overview' },
              { label: '后端 Java', to: '/docs/backend/overview' },
              { label: 'AI 集成', to: '/docs/ai/overview' },
            ],
          },
          {
            title: '资源',
            items: [
              { label: '源码示例', href: 'https://github.com/thomaslwq/AIFullStack/tree/main/examples' },
              { label: '学习路线', to: '/docs/roadmap' },
              { label: '命令速查', to: '/docs/appendix/commands' },
            ],
          },
          {
            title: '更多',
            items: [
              { label: 'GitHub 仓库', href: 'https://github.com/thomaslwq/AIFullStack' },
              { label: '提交 Issue', href: 'https://github.com/thomaslwq/AIFullStack/issues' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Thomas.Lin · Built with Docusaurus · MIT License`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'bash', 'sql', 'yaml', 'typescript', 'jsx', 'tsx', 'diff'],
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
    }),
};

export default config;
