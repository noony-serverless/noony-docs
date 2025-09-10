import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  metrics?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Lightning Fast Performance',
    icon: '⚡',
    description: (
      <>
        Deploy functions in milliseconds with our optimized runtime. 
        Cold starts under 50ms and automatic scaling ensure your applications 
        respond instantly to user demands, no matter the load.
      </>
    ),
    metrics: '10x faster cold starts',
  },
  {
    title: 'Auto-Scaling Excellence',
    icon: '🚀',
    description: (
      <>
        Scale from zero to millions of requests seamlessly. Our intelligent 
        auto-scaling monitors your application patterns and adjusts resources 
        automatically, ensuring optimal performance and cost efficiency.
      </>
    ),
    metrics: '0 to 1M requests/sec',
  },
  {
    title: 'Developer-First Experience',
    icon: '👨‍💻',
    description: (
      <>
        Focus on code, not infrastructure. With hot reloading, built-in debugging, 
        integrated monitoring, and one-command deployments, you'll ship features 
        faster than ever before.
      </>
    ),
    metrics: '5-minute deployments',
  },
  {
    title: 'Enterprise Security',
    icon: '🔒',
    description: (
      <>
        Bank-grade security with automatic encryption, built-in authentication,
        and compliance with SOC 2, GDPR, and HIPAA standards. Your data and 
        your users are always protected.
      </>
    ),
    metrics: 'SOC 2 Type II certified',
  },
  {
    title: 'Cost-Effective Scaling',
    icon: '💰',
    description: (
      <>
        Pay only for what you use with sub-second billing. Our efficient 
        runtime reduces costs by up to 70% compared to traditional cloud 
        solutions while delivering superior performance.
      </>
    ),
    metrics: 'Up to 70% cost savings',
  },
  {
    title: 'Multi-Cloud Native',
    icon: '☁️',
    description: (
      <>
        Deploy anywhere without vendor lock-in. Our framework runs on AWS, 
        Google Cloud, Azure, and edge networks, giving you flexibility and 
        redundancy for mission-critical applications.
      </>
    ),
    metrics: '99.99% uptime SLA',
  },
];

function Feature({title, icon, description, metrics}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('feature', styles.feature)}>
        <div className={clsx('feature__icon', styles.featureIcon)}>
          <span className={styles.iconEmoji}>{icon}</span>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          {metrics && (
            <div className={styles.featureMetric}>{metrics}</div>
          )}
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" className={styles.featuresTitle}>
            Why Choose <span className="text-gradient">CloudFlow Functions</span>?
          </Heading>
          <p className={styles.featuresSubtitle}>
            Built from the ground up for modern cloud-native applications, 
            CloudFlow delivers unmatched performance, scalability, and developer experience.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className={styles.trustSection}>
          <div className="text--center margin-bottom--lg">
            <h3 className={styles.trustTitle}>Trusted by thousands of developers worldwide</h3>
          </div>
          <div className={styles.trustMetrics}>
            <div className={styles.trustMetric}>
              <div className={styles.trustNumber}>500K+</div>
              <div className={styles.trustLabel}>Functions Deployed</div>
            </div>
            <div className={styles.trustMetric}>
              <div className={styles.trustNumber}>10B+</div>
              <div className={styles.trustLabel}>Monthly Invocations</div>
            </div>
            <div className={styles.trustMetric}>
              <div className={styles.trustNumber}>99.99%</div>
              <div className={styles.trustLabel}>Uptime SLA</div>
            </div>
            <div className={styles.trustMetric}>
              <div className={styles.trustNumber}>50ms</div>
              <div className={styles.trustLabel}>Avg Cold Start</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
