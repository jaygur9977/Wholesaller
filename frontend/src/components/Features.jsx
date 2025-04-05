import { memo } from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: '📍',
    title: 'Local Search',
    description: 'Find nearby wholesalers to reduce shipping costs'
  },
  {
    icon: '💰',
    title: 'Best Prices',
    description: 'Compare prices from multiple suppliers'
  },
  {
    icon: '📦',
    title: 'Bulk Orders',
    description: 'Place and manage large orders efficiently'
  },
  {
    icon: '📊',
    title: 'Market Analysis',
    description: 'Track market trends and insights'
  },
  {
    icon: '📱',
    title: 'Mobile Ready',
    description: 'Manage your business on the go'
  },
  {
    icon: '🤝',
    title: 'Direct Connect',
    description: 'Connect directly with suppliers'
  }
];

const Features = () => {
  return (
    <section className="features-section" aria-labelledby="features-heading">
      <div className="features-container">
        <div className="features-header">
          <h2 id="features-heading" className="features-subtitle">Features</h2>
          <p className="features-title">A better way to connect vendors and wholesalers</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard 
              key={`feature-${index}-${feature.title}`}
              {...feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Features);