import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const features = [
  {
    title: '前端 React',
    emoji: '⚛️',
    description:
      '从 JSX、组件、State 到 Hooks、路由、状态管理与数据请求，配合 TypeScript，掌握现代化单页应用开发。',
    link: '/docs/frontend/overview',
  },
  {
    title: '后端 Java',
    emoji: '☕',
    description:
      'Java 核心速通起步，深入 Spring Boot REST API、持久层、JWT 鉴权与接口文档，构建可落地的服务端。',
    link: '/docs/backend/overview',
  },
  {
    title: 'AI 集成',
    emoji: '🤖',
    description:
      '调用大模型 API、Prompt 工程、RAG 检索增强、SSE 流式输出与 Agent 工具调用，把 AI 能力接入真实业务。',
    link: '/docs/ai/overview',
  },
  {
    title: '实战项目',
    emoji: '🚀',
    description:
      '以一个前后端分离的 AI 对话应用贯穿全流程：Java 后端提供模型网关，React 前端完成对话界面，含可运行源码。',
    link: '/docs/project/overview',
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            开始学习 →
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            href="https://github.com/thomaslwq/AIFullStack"
          >
            GitHub 仓库
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <section className="container">
          <div className="feature-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <span style={{ fontSize: '2rem' }}>{f.emoji}</span>
                <Heading as="h3">{f.title}</Heading>
                <p>{f.description}</p>
                <Link to={f.link}>查看模块 →</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
