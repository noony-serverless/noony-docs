import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './404.module.css';

export default function NotFound(): ReactNode {
  return (
    <Layout
      title="Page Not Found"
      description="The page you're looking for doesn't exist.">
      <main className={styles.notFoundPage}>
        <div className="container">
          <div className={styles.notFoundContent}>
            <div className={styles.notFoundVisual}>
              <div className={styles.cloudIcon}>☁️</div>
              <div className={styles.errorCode}>404</div>
              <div className={styles.floatingClouds}>
                <div className={clsx(styles.cloud, styles.cloud1)}>☁️</div>
                <div className={clsx(styles.cloud, styles.cloud2)}>☁️</div>
                <div className={clsx(styles.cloud, styles.cloud3)}>☁️</div>
              </div>
            </div>
            
            <div className={styles.notFoundText}>
              <Heading as="h1" className={styles.notFoundTitle}>
                Oops! This function seems to be <span className="text-gradient">offline</span>
              </Heading>
              <p className={styles.notFoundSubtitle}>
                The page you're looking for has drifted away like a cloud. 
                Don't worry though - our serverless functions are still running perfectly!
              </p>
              
              <div className={styles.notFoundActions}>
                <Link
                  className={clsx('button button--primary button--lg', styles.homeButton)}
                  to="/">
                  🏠 Go Home
                </Link>
                <Link
                  className={clsx('button button--outline button--lg', styles.docsButton)}
                  to="/docs/intro">
                  📚 Browse Docs
                </Link>
              </div>
              
              <div className={styles.helpfulLinks}>
                <h3>Looking for something specific?</h3>
                <div className={styles.linkGrid}>
                  <Link to="/docs/intro" className={styles.helpfulLink}>
                    <span className={styles.linkIcon}>🚀</span>
                    <div>
                      <strong>Getting Started</strong>
                      <p>Learn CloudFlow basics</p>
                    </div>
                  </Link>
                  <Link to="/docs/tutorial-basics/tech-radar" className={styles.helpfulLink}>
                    <span className={styles.linkIcon}>📊</span>
                    <div>
                      <strong>Tech Radar</strong>
                      <p>Explore our technology stack</p>
                    </div>
                  </Link>
                  <Link to="/blog" className={styles.helpfulLink}>
                    <span className={styles.linkIcon}>📝</span>
                    <div>
                      <strong>Blog</strong>
                      <p>Latest updates and insights</p>
                    </div>
                  </Link>
                  <a href="https://github.com/cloudflow/cloudflow-functions" className={styles.helpfulLink}>
                    <span className={styles.linkIcon}>💻</span>
                    <div>
                      <strong>GitHub</strong>
                      <p>Source code and examples</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
