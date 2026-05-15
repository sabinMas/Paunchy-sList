import { useEffect, useState } from 'react';
import { extensionsAPI } from '../utils/api';

export default function Home({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await extensionsAPI.getStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">One List.<br />Every Dev Tool.</h1>
          <p className="hero-subtitle">
            Stop hunting across multiple platforms. Access extensions from VS Code, JetBrains, Unreal, browsers, and AI agents—all in one place.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => onNavigate('marketplace')}>
              Explore List
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('submit')}>
              Submit Your Extension
            </button>
          </div>
          {!loading && stats && (
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">{stats.totalExtensions}+</div>
                <div className="stat-label">Extensions</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.environments}</div>
                <div className="stat-label">Platforms</div>
              </div>
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Developers</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Built for Modern Developers</h2>
            <p className="section-subtitle">Everything you need to discover, compare, and install dev tools</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">∞</div>
              <h3 className="feature-title">Universal Compatibility</h3>
              <p className="feature-description">
                Extensions from VS Code Marketplace, JetBrains, Unreal Engine, browser stores, and AI platforms—unified in one searchable catalog.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Smart Filtering</h3>
              <p className="feature-description">
                Find exactly what you need with filters by environment, dev type, category, and popularity. No more endless scrolling.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">→</div>
              <h3 className="feature-title">Direct Installation</h3>
              <p className="feature-description">
                One click takes you straight to the native marketplace for seamless installation. We don't gatekeep—we connect.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
