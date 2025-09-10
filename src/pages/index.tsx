import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ArchitectureDiagram from '@site/src/components/ArchitectureDiagram';
import TestimonialsSection from '@site/src/components/TestimonialsSection';
import CTASection from '@site/src/components/CTASection';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button', styles.heroButton, styles.heroButtonPrimary)}
            to="/docs/intro">
            🚀 Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/examples">
            Explore Examples
          </Link>
        </div>
        <div className={styles.button}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Quick Start Guide
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <Heading as="h2" className={styles.quickStartTitle}>
          Deploy your first function in <span className="text-gradient">under 60 seconds</span>
        </Heading>
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.codeExample}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <div className={styles.codeDot}></div>
                  <div className={styles.codeDot}></div>
                  <div className={styles.codeDot}></div>
                </div>
                <span>main.js</span>
              </div>
              <div className={styles.codeContent}>
                <div><span className={styles.codeComment}>// Create your first CloudFlow function</span></div>
                <div><span className={styles.codeKeyword}>export</span> <span className={styles.codeKeyword}>async</span> <span className={styles.codeKeyword}>function</span> handler(event, context) {'{'}</div>
                <div>&nbsp;&nbsp;<span className={styles.codeKeyword}>return</span> {'{'}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;statusCode: <span className={styles.codeString}>200</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;body: JSON.stringify({'{'}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;message: <span className={styles.codeString}>'Hello from CloudFlow!'</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timestamp: <span className={styles.codeKeyword}>new</span> Date().toISOString()</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;{'}'})</div>
                <div>&nbsp;&nbsp;{'}'}</div>
                <div>{'}'}</div>
                <div></div>
                <div><span className={styles.codeComment}>// Deploy with one command</span></div>
                <div><span className={styles.codeComment}>// $ cloudflow deploy</span></div>
              </div>
            </div>
            <div className="text--center margin-top--lg">
              <Link
                className="button button--primary button--lg"
                to="/docs/intro">
                Start Building →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Next-gen Serverless Framework`}
      description="Build and deploy serverless functions with lightning speed. Auto-scaling, cost-effective, and developer-friendly cloud functions platform.">
      <HomepageHeader />
      <main>
        <QuickStartSection />
        <ArchitectureDiagram />
        <HomepageFeatures />
        <TestimonialsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
