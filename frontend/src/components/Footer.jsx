export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Paunchy'sList</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 'var(--space-sm)' }}>
              One List. Every Dev Tool. Discover extensions across all platforms in one place.
            </p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul className="footer-links">
              <li>
                <button
                  className="footer-link"
                  onClick={() => onNavigate('marketplace')}
                >
                  Explore List
                </button>
              </li>
              <li>
                <button
                  className="footer-link"
                  onClick={() => onNavigate('submit')}
                >
                  Submit Extension
                </button>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {year} Paunchy'sList. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
