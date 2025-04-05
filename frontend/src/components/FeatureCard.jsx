import PropTypes from 'prop-types';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const FeatureCard = ({ icon, title, description, index }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div 
      ref={ref}
      className={`feature-card ${isVisible ? 'animate-in' : ''}`} 
      role="article"
      style={{ '--index': index }}
    >
      <div className="feature-icon-wrapper">
        <span className="feature-icon" aria-hidden="true">{icon}</span>
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default FeatureCard;