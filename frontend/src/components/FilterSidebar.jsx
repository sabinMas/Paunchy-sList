import { useEffect, useState } from 'react';
import { extensionsAPI } from '../utils/api';

export default function FilterSidebar({ filters, onFilterChange, onClearFilters }) {
  const [filterOptions, setFilterOptions] = useState({
    environments: [],
    devtypes: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiltersWithRetry = async (retries = 3) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          console.log(`[FilterSidebar] Fetching filters (attempt ${attempt + 1}/${retries})`);
          const response = await extensionsAPI.getFilters();

          if (response.data.success) {
            console.log('[FilterSidebar] Filters loaded successfully:', response.data.data);
            setFilterOptions(response.data.data);
            setError(null);
            setLoading(false);
            return; // Success - exit retry loop
          } else {
            throw new Error('API returned success: false');
          }
        } catch (error) {
          console.error(`[FilterSidebar] Fetch attempt ${attempt + 1} failed:`, error.message);

          // If this was the last attempt, show error
          if (attempt === retries - 1) {
            setError('Failed to load filters. Please refresh the page.');
            setLoading(false);
          } else {
            // Wait before retrying (exponential backoff: 500ms, 1s, 2s)
            const delay = 500 * Math.pow(2, attempt);
            console.log(`[FilterSidebar] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    };

    fetchFiltersWithRetry();
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

  if (error) {
    return (
      <aside className="filters-sidebar">
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {error}
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
