import type {ReactNode} from 'react';
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface ArchitectureStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  connections?: string[];
}

const architectureSteps: ArchitectureStep[] = [
  {
    id: 'code',
    title: 'Your Code',
    description: 'Write functions in your favorite language',
    icon: '💻',
    position: { x: 10, y: 50 },
    connections: ['deploy']
  },
  {
    id: 'deploy',
    title: 'One-Click Deploy',
    description: 'Deploy globally with a single command',
    icon: '🚀',
    position: { x: 30, y: 50 },
    connections: ['edge']
  },
  {
    id: 'edge',
    title: 'Global Edge Network',
    description: 'Functions deployed to 200+ locations worldwide',
    icon: '🌐',
    position: { x: 50, y: 30 },
    connections: ['scale', 'monitor']
  },
  {
    id: 'scale',
    title: 'Auto-Scaling',
    description: 'Automatically handle millions of requests',
    icon: '📈',
    position: { x: 70, y: 20 },
  },
  {
    id: 'monitor',
    title: 'Real-time Monitoring',
    description: 'Built-in observability and alerts',
    icon: '📊',
    position: { x: 70, y: 50 },
  },
  {
    id: 'users',
    title: 'Happy Users',
    description: 'Lightning-fast responses globally',
    icon: '😊',
    position: { x: 90, y: 35 },
  }
];

function ArchitectureNode({ step, isActive, onClick }: {
  step: ArchitectureStep;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={clsx(styles.architectureNode, { [styles.active]: isActive })}
      style={{
        left: `${step.position.x}%`,
        top: `${step.position.y}%`,
      }}
      onClick={onClick}
    >
      <div className={styles.nodeIcon}>{step.icon}</div>
      <div className={styles.nodeContent}>
        <h4 className={styles.nodeTitle}>{step.title}</h4>
        <p className={styles.nodeDescription}>{step.description}</p>
      </div>
    </div>
  );
}

function ConnectionLine({ from, to }: { from: ArchitectureStep; to: ArchitectureStep }) {
  const x1 = from.position.x;
  const y1 = from.position.y;
  const x2 = to.position.x;
  const y2 = to.position.y;

  return (
    <svg className={styles.connectionSvg}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto">
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="var(--cloudflow-blue)"
            opacity="0.6"
          />
        </marker>
      </defs>
      <line
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        className={styles.connectionLine}
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}

export default function ArchitectureDiagram(): ReactNode {
  const [activeStep, setActiveStep] = React.useState<string>('code');

  // Create connections based on the connections array
  const connections = architectureSteps.flatMap(step =>
    (step.connections || []).map(connectionId => {
      const targetStep = architectureSteps.find(s => s.id === connectionId);
      return targetStep ? { from: step, to: targetStep } : null;
    }).filter(Boolean)
  );

  return (
    <section className={styles.architectureSection}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <h2 className={styles.architectureTitle}>
            How <span className="text-gradient">CloudFlow</span> Works
          </h2>
          <p className={styles.architectureSubtitle}>
            From code to global deployment in minutes, not hours
          </p>
        </div>
        
        <div className={styles.architectureDiagram}>
          {/* Render connection lines */}
          {connections.map((connection, index) => (
            <ConnectionLine
              key={index}
              from={connection.from}
              to={connection.to}
            />
          ))}
          
          {/* Render nodes */}
          {architectureSteps.map((step) => (
            <ArchitectureNode
              key={step.id}
              step={step}
              isActive={activeStep === step.id}
              onClick={() => setActiveStep(step.id)}
            />
          ))}
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <h3>Lightning Fast</h3>
            <p>Sub-50ms cold starts with intelligent pre-warming</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💰</div>
            <h3>Cost Effective</h3>
            <p>Pay only for execution time, not idle resources</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔒</div>
            <h3>Enterprise Security</h3>
            <p>Built-in encryption and compliance certifications</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📊</div>
            <h3>Full Observability</h3>
            <p>Real-time metrics, logs, and distributed tracing</p>
          </div>
        </div>
      </div>
    </section>
  );
}
