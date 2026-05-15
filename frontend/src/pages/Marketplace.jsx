import { useState, useEffect } from 'react';
import { extensionsAPI } from '../utils/api';
import ExtensionCard from '../components/ExtensionCard';
import FilterSidebar from '../components/FilterSidebar';

export default function Marketplace({ onNavigate, onSelectProduct }) {
  const [extensions, setExtensions] = useState([]);
  const [filters, setFilters] = useState({
    environment: [],
    devtype: [],
    category: []
  });
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.environment.length > 0) params.environment = filters.environment[0];
        if (filters.devtype.length > 0) params.devtype = filters.devtype[0];
        if (filters.category.length > 0) params.category = filters.category[0];

        const response = await extensionsAPI.getAll(params);
        if (response.data.success) {
          let sorted = [...response.data.data];

          // Apply sorting
          switch (sortBy) {
            case 'newest':
              sorted.reverse();
              break;
            case 'name':
              sorted.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'price-low':
              sorted.sort((a, b) => a.price - b.price);
              break;
            case 'price-high':
              sorted.sort((a, b) => b.price - a.price);
              break;
            default:
              // 'popular' - keep original order
              break;
          }

          setExtensions(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch extensions:', err);
        setError('Failed to load extensions');
      } finally {
        setLoading(false);
      }
    };

    fetchExtensions();
  }, [filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      environment: [],
      devtype: [],
      category: []
    });
  };

  return (
    <>
      <div className="marketplace-header">
        <div className="container">
          <h1 className="marketplace-title">Paunchy's List</h1>
          <p className="marketplace-description">
            One list. Every Useful Dev Tool
          </p>
        </div>
      </div>

      <div className="marketplace-content">
        <div className="container-wide">
          <div className="marketplace-layout">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            <main>
              <div className="extensions-header">
                <div className="extensions-count">
                  Showing <span>{extensions.length}</span> extensions
                </div>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading extensions...</p>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <p>{error}</p>
                </div>
              ) : extensions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <p>No extensions found. Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="extensions-grid">
                  {extensions.map((ext) => (
                    <ExtensionCard
                      key={ext.id}
                      extension={ext}
                      onClick={() => onSelectProduct(ext)}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
