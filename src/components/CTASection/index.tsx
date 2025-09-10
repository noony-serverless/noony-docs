import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function CTASection(): ReactNode {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>
              Ready to revolutionize your <span className="text-gradient">serverless development</span>?
            </h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of developers who have already made the switch to CloudFlow Functions. 
              Get started with our free tier and experience the future of cloud computing.
            </p>
            <div className={styles.ctaFeatures}>
              <div className={styles.ctaFeature}>
                <span className={styles.ctaFeatureIcon}>✅</span>
                <span>Free tier with 1M requests/month</span>
              </div>
              <div className={styles.ctaFeature}>
                <span className={styles.ctaFeatureIcon}>✅</span>
                <span>No credit card required</span>
              </div>
              <div className={styles.ctaFeature}>
                <span className={styles.ctaFeatureIcon}>✅</span>
                <span>Deploy in under 2 minutes</span>
              </div>
              <div className={styles.ctaFeature}>
                <span className={styles.ctaFeatureIcon}>✅</span>
                <span>24/7 expert support</span>
              </div>
            </div>
          </div>
          <div className={styles.ctaActions}>
            <Link
              className={clsx('button button--primary button--lg', styles.ctaPrimaryButton)}
              to="/docs/intro">
              🚀 Start Building Now
            </Link>
            <Link
              className={clsx('button button--outline button--lg', styles.ctaSecondaryButton)}
              to="/docs/examples">
              � Explore Examples
            </Link>
            <div className={styles.ctaTrust}>
              <span className={styles.trustBadge}>
                🔒 SOC 2 Certified
              </span>
              <span className={styles.trustBadge}>
                🌍 99.99% Uptime
              </span>
              <span className={styles.trustBadge}>
                ⚡ Sub-50ms Cold Starts
              </span>
            </div>
          </div>
        </div>
        
        <div className={styles.ctaBackground}>
          <div className={styles.ctaShape1}></div>
          <div className={styles.ctaShape2}></div>
          <div className={styles.ctaShape3}></div>
        </div>
      </div>
    </section>
  );
}
