import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  metrics?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Senior Engineering Manager',
    company: 'TechFlow Inc',
    image: '👩‍💻',
    content: 'CloudFlow reduced our deployment time from 45 minutes to under 2 minutes. The developer experience is phenomenal, and the cost savings are substantial.',
    metrics: '95% faster deployments'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    company: 'DataSync Solutions',
    image: '👨‍💼',
    content: 'We migrated from traditional containers to CloudFlow and saw immediate improvements. The auto-scaling is flawless and the cold start times are incredible.',
    metrics: '70% cost reduction'
  },
  {
    name: 'Emily Watson',
    role: 'Lead Developer',
    company: 'CloudFirst Corp',
    image: '👩‍🔬',
    content: 'The built-in observability and monitoring saved us weeks of setup time. CloudFlow just works, allowing us to focus on building features instead of managing infrastructure.',
    metrics: '10x faster to market'
  }
];

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <div className={clsx(styles.testimonialCard, styles[`testimonial${index + 1}`])}>
      <div className={styles.testimonialContent}>
        <div className={styles.quoteIcon}>"</div>
        <p className={styles.testimonialText}>{testimonial.content}</p>
        {testimonial.metrics && (
          <div className={styles.testimonialMetric}>{testimonial.metrics}</div>
        )}
      </div>
      <div className={styles.testimonialAuthor}>
        <div className={styles.authorAvatar}>{testimonial.image}</div>
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>{testimonial.name}</div>
          <div className={styles.authorRole}>{testimonial.role}</div>
          <div className={styles.authorCompany}>{testimonial.company}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection(): ReactNode {
  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2 className={styles.testimonialsTitle}>
            Loved by <span className="text-gradient">developers worldwide</span>
          </h2>
          <p className={styles.testimonialsSubtitle}>
            Join thousands of teams already building with CloudFlow Functions
          </p>
        </div>
        
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.name} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>

        <div className={styles.socialProof}>
          <div className={styles.proofItem}>
            <div className={styles.proofIcon}>⭐</div>
            <div className={styles.proofText}>
              <strong>4.9/5</strong> Developer satisfaction
            </div>
          </div>
          <div className={styles.proofItem}>
            <div className={styles.proofIcon}>🏢</div>
            <div className={styles.proofText}>
              <strong>1000+</strong> Companies using CloudFlow
            </div>
          </div>
          <div className={styles.proofItem}>
            <div className={styles.proofIcon}>🚀</div>
            <div className={styles.proofText}>
              <strong>500K+</strong> Functions deployed
            </div>
          </div>
          <div className={styles.proofItem}>
            <div className={styles.proofIcon}>💡</div>
            <div className={styles.proofText}>
              <strong>99.99%</strong> Uptime SLA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
