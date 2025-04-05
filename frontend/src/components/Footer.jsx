const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="footer" role="contentinfo">
        <div className="footer-container">
          <nav className="footer-nav" aria-label="Footer Navigation">
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </nav>
          <p className="footer-text">
            &copy; {currentYear} WholeVend. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;