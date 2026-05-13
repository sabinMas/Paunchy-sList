const environmentLabels = {
  vscode: 'VS Code',
  jetbrains: 'JetBrains',
  unreal: 'Unreal Engine',
  browser: 'Browser',
  ai: 'AI Agent'
};

const categoryLabels = {
  productivity: 'Productivity',
  testing: 'Testing',
  ai: 'AI',
  themes: 'Themes',
  debugging: 'Debugging',
  languages: 'Languages'
};

export default function ExtensionCard({ extension, onClick }) {
  return (
    <button
      className="extension-card"
      onClick={onClick}
      style={{ textAlign: 'left', cursor: 'pointer' }}
    >
      <div className="extension-header">
        <div className="extension-icon">
          {extension.icon || '📦'}
        </div>
        <div className="extension-info">
          <div className="extension-name">{extension.name}</div>
          <div className="extension-environment">
            {environmentLabels[extension.environment] || extension.environment}
          </div>
        </div>
      </div>
      <p className="extension-description">
        {extension.description}
      </p>
      <div className="extension-footer">
        <div className="extension-tags">
          <span className="tag">
            {categoryLabels[extension.category] || extension.category}
          </span>
        </div>
        <div className={`extension-price ${extension.price === 0 ? 'free' : ''}`}>
          {extension.price === 0 ? 'Free' : `$${extension.price.toFixed(2)}`}
        </div>
      </div>
    </button>
  );
}
