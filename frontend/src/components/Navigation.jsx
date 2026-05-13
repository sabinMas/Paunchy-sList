export default function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="nav">
      <div className="container nav-content">
        <button className="logo" onClick={() => onNavigate('home')}>
          Paunchy'sList
        </button>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'marketplace' ? 'active' : ''}`}
              onClick={() => onNavigate('marketplace')}
            >
              Marketplace
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'submit' ? 'active' : ''}`}
              onClick={() => onNavigate('submit')}
            >
              Submit Extension
            </button>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="btn btn-ghost">Sign In</button>
          <button className="btn btn-primary" onClick={() => onNavigate('marketplace')}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
