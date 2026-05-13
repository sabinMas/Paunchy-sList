import { useEffect, useState } from 'react';
import { extensionsAPI } from '../utils/api';

export default function FilterSidebar({ filters, onFilterChange, onClearFilters }) {
  const [filterOptions, setFilterOptions] = useState({
    environments: [],
    devtypes: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await extensionsAPI.getFilters();
        if (response.data.success) {
          setFilterOptions(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  if (loading) {
    return (
      <aside className="filters-sidebar">
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading filters...
        </div>
      </aside>
    );
  }

  const hasActiveFilters = filters.environment.length > 0 || filters.devtype.length > 0 || filters.category.length > 0;

  return (
    <aside className="filters-sidebar">
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            marginBottom: 'var(--space-md)',
            fontSize: '0.875rem',
            fontWeight: '500',
            padding: 0
          }}
        >
          Clear Filters
        </button>
      )}

      <div className="filter-section">
        <div className="filter-title">Environment</div>
        <div className="filter-options">
          {filterOptions.environments.map((env) => (
            <div key={env} className="filter-option">
              <input
                type="checkbox"
                id={`env-${env}`}
                checked={filters.environment.includes(env)}
                onChange={() => onFilterChange('environment', env)}
              />
              <label htmlFor={`env-${env}`}>{env}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">Dev Type</div>
        <div className="filter-options">
          {filterOptions.devtypes.map((type) => (
            <div key={type} className="filter-option">
              <input
                type="checkbox"
                id={`type-${type}`}
                checked={filters.devtype.includes(type)}
                onChange={() => onFilterChange('devtype', type)}
              />
              <label htmlFor={`type-${type}`}>{type}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-title">Category</div>
        <div className="filter-options">
          {filterOptions.categories.map((cat) => (
            <div key={cat} className="filter-option">
              <input
                type="checkbox"
                id={`cat-${cat}`}
                checked={filters.category.includes(cat)}
                onChange={() => onFilterChange('category', cat)}
              />
              <label htmlFor={`cat-${cat}`}>{cat}</label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
