import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ChatModal from './components/ChatModal';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Submit from './pages/Submit';
import { TweaksPanel, TweakSection, TweakColor, TweakRadio } from './components/TweaksPanel';
import { extensionsAPI } from './utils/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [extensions, setExtensions] = useState([]);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [tweaks, setTweak] = useState({
    accentColor: '#0066ff',
    spacing: 'generous',
    variant: 'minimal'
  });

  // Fetch extensions and track visitor on mount
  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const response = await extensionsAPI.getAll();
        console.log('Extensions API Response:', response.data);
        if (response.data.success) {
          console.log('Setting extensions:', response.data.data.length, 'extensions');
          setExtensions(response.data.data);
        } else {
          console.error('API returned success: false', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch extensions:', error);
      }
    };

    const trackVisitor = async () => {
      try {
        // Only track once per session to avoid inflating numbers
        if (!sessionStorage.getItem('visitor_tracked')) {
          await extensionsAPI.trackVisitor();
          sessionStorage.setItem('visitor_tracked', 'true');
        }
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    fetchExtensions();
    trackVisitor();
  }, []);

  // Apply tweaks to CSS variables
  useEffect(() => {
    const root = document.documentElement;

    // Accent color
    root.style.setProperty('--accent-primary', tweaks.accentColor);
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    const rgb = hexToRgb(tweaks.accentColor);
    if (rgb) {
      root.style.setProperty('--accent-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    }

    // Spacing
    const spacingMultipliers = {
      compact: 0.75,
      generous: 1,
      spacious: 1.5
    };
    const multiplier = spacingMultipliers[tweaks.spacing] || 1;
    root.style.setProperty('--space-xs', `${0.5 * multiplier}rem`);
    root.style.setProperty('--space-sm', `${1 * multiplier}rem`);
    root.style.setProperty('--space-md', `${1.5 * multiplier}rem`);
    root.style.setProperty('--space-lg', `${2 * multiplier}rem`);
    root.style.setProperty('--space-xl', `${3 * multiplier}rem`);
    root.style.setProperty('--space-2xl', `${4 * multiplier}rem`);
    root.style.setProperty('--space-3xl', `${6 * multiplier}rem`);
  }, [tweaks]);

  const handleSetTweak = (key, value) => {
    setTweak(prev => ({ ...prev, [key]: value }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'marketplace':
        return <Marketplace onNavigate={setCurrentPage} onSelectProduct={(product) => {
          setSelectedProduct(product);
          setCurrentPage('product');
        }} />;
      case 'product':
        return <ProductDetail product={selectedProduct} onNavigate={setCurrentPage} />;
      case 'submit':
        return <Submit onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenChat={() => setChatModalOpen(true)}
      />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
      <ChatModal isOpen={chatModalOpen} onClose={() => setChatModalOpen(false)} />
      <TweaksPanel>
        <TweakSection title="Colors">
          <TweakColor
            label="Accent Color"
            value={tweaks.accentColor}
            onChange={(val) => handleSetTweak('accentColor', val)}
            options={['#0066ff', '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']}
          />
        </TweakSection>

        <TweakSection title="Layout">
          <TweakRadio
            label="Spacing"
            value={tweaks.spacing}
            onChange={(val) => handleSetTweak('spacing', val)}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'generous', label: 'Generous' },
              { value: 'spacious', label: 'Spacious' }
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

export default App;
