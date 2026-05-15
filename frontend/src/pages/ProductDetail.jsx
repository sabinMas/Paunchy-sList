import { useEffect } from 'react';

const environmentLabels = {
  vscode: 'VS Code',
  jetbrains: 'JetBrains',
  unreal: 'Unreal Engine',
  browser: 'Browser',
  ai: 'AI Agent',
  sublime: 'Sublime Text',
  zed: 'Zed',
  cursor: 'Cursor',
  godot: 'Godot',
  neovim: 'Neovim',
  docker: 'Docker',
  postman: 'Postman'
};

const categoryLabels = {
  productivity: 'Productivity',
  testing: 'Testing',
  ai: 'AI',
  'agentic dev tools': 'Agentic Dev Tools',
  themes: 'Themes',
  debugging: 'Debugging',
  languages: 'Languages',
  api: 'API',
  devops: 'DevOps',
  security: 'Security',
  performance: 'Performance'
};

export default function ProductDetail({ product, onNavigate }) {
  // Handle browser back button and ESC key
  useEffect(() => {
    const handleBackButton = (event) => {
      onNavigate('marketplace');
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        onNavigate('marketplace');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onNavigate]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Product not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="product-hero">
        <div className="container">
          <div className="product-hero-content">
            <div className="product-icon-large">
              {product.icon || '📦'}
            </div>
            <div className="product-details">
              <h1>{product.name}</h1>
              <div className="product-meta">
                <div className="product-meta-item">
                  {environmentLabels[product.environment] || product.environment}
                </div>
                <div className="product-meta-item">
                  {categoryLabels[product.category] || product.category}
                </div>
              </div>
              <p className="product-description">
                {product.description}
              </p>
              <div className="product-actions">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Install Extension
                </a>
                <button
                  className="btn btn-secondary"
                  onClick={() => onNavigate('marketplace')}
                >
                  ← Back to List
                </button>
              </div>
              <div className="product-price-tag">
                {product.price === 0 ? 'Free' : `$${product.price.toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-content">
        <div className="container">
          <div className="product-info-grid">
            <div>
              <div className="info-section">
                <h3>About This Extension</h3>
                <p>{product.description}</p>
              </div>
            </div>

            <aside>
              <div className="info-section">
                <h3>Details</h3>
                <ul className="info-list">
                  <li>
                    <span className="info-label">Environment</span>
                    <span className="info-value">
                      {environmentLabels[product.environment] || product.environment}
                    </span>
                  </li>
                  <li>
                    <span className="info-label">Category</span>
                    <span className="info-value">
                      {categoryLabels[product.category] || product.category}
                    </span>
                  </li>
                  <li>
                    <span className="info-label">Price</span>
                    <span className="info-value">
                      {product.price === 0 ? 'Free' : `$${product.price.toFixed(2)}`}
                    </span>
                  </li>
                  <li>
                    <span className="info-label">Type</span>
                    <span className="info-value" style={{ textTransform: 'capitalize' }}>
                      {product.devtype}
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
