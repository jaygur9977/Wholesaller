import { useState } from 'react';

const LoadingSpinner = () => (
  <span className="loading-spinner" role="status" aria-label="Loading">
    <span className="spinner-dot"></span>
    <span className="spinner-dot"></span>
    <span className="spinner-dot"></span>
  </span>
);

const Hero = () => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      window.location.href = '/search';
    }, 500);
  };

  return (
    <section className="hero-section" role="banner">
      <div className="hero-overlay" aria-hidden="true"></div>
      <div className="hero-content">
        <div className="hero-text-container">
          <h1 className="hero-title">Connect Vendors with Local Wholesalers</h1>
          <p className="hero-description">
            Find the best wholesale deals in your area or list your wholesale business to grow your customer base.
          </p>
          <div className="button-container">
            <button 
              className="primary-button"
              onClick={handleSearch}
              disabled={isSearching}
              aria-busy={isSearching}
            >
              <span className="button-text">
                {isSearching ? (
                  <>
                    <LoadingSpinner />
                    Searching...
                  </>
                ) : (
                  'Search wholesaler'
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;