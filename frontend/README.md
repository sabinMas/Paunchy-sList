# Paunchy'sList Frontend

React + Vite web application for browsing and submitting developer tool extensions.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
# VITE_API_URL defaults to http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

App opens at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

## File Structure

```
src/
├── components/              # Reusable UI components
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   ├── TweaksPanel.jsx      # Design customization
│   ├── ExtensionCard.jsx
│   └── FilterSidebar.jsx
├── pages/                   # Page components
│   ├── Home.jsx
│   ├── Marketplace.jsx
│   ├── ProductDetail.jsx
│   └── Submit.jsx
├── hooks/                   # React hooks (future use)
├── styles/
│   ├── index.css           # Main design system
│   └── tweaks.css          # Tweaks panel styles
├── utils/
│   └── api.js              # API client (Axios)
├── App.jsx                 # Main component with routing
└── main.jsx                # React entry point

index.html                  # HTML entry point
```

## Pages

### Home (`/`)
Landing page with:
- Hero section with value proposition
- Feature cards (3 columns)
- Marketplace statistics

### Marketplace (`/marketplace`)
Main browsing page with:
- Sticky filter sidebar (environment, dev type, category)
- Extension grid (auto-fill layout)
- Sort options (popular, newest, name, price)
- Live filtering without page reload

### Product Detail (`/product/:id`)
Product page with:
- Large extension icon
- Full metadata display
- Installation link (opens in new tab)
- Back button to marketplace

### Submit (`/submit`)
Extension submission form with:
- Form validation with error messages
- Fields: name, description, environment, category, dev type, price, URL, email, icon
- Success/error feedback
- Auto-redirect to marketplace on success

## Components

### Navigation
- Logo/brand (clickable, navigates home)
- Nav links (Home, Marketplace, Submit)
- Action buttons (Sign In, Get Started)
- Auto-highlights active page

### Footer
- Company info
- Product links
- Resources
- Company links
- Copyright year

### TweaksPanel
Floating customization panel (bottom-right):
- Accent color picker (6 presets)
- Spacing density (compact/generous/spacious)
- Toggles open/close
- Settings persist during session

### ExtensionCard
Clickable card displaying:
- Icon (emoji or symbol)
- Name and environment
- 2-line description (truncated)
- Tags (category)
- Price badge

### FilterSidebar
Multi-select filters for:
- Environment (VS Code, JetBrains, Unreal, Browser, AI)
- Developer Type (Frontend, Backend, Fullstack, DevOps, GameDev)
- Category (Productivity, Testing, AI, Themes, Debugging, Languages)
- Clear filters button
- Auto-populated from backend

## API Integration

### API Client (`src/utils/api.js`)

```javascript
import { extensionsAPI, submissionsAPI } from './utils/api';

// Extensions
await extensionsAPI.getAll(params)        // List with filters
await extensionsAPI.getById(id)           // Get single
await extensionsAPI.getFilters()          // Get filter options
await extensionsAPI.getStats()            // Get stats

// Submissions
await submissionsAPI.submit(data)         // Submit form
await submissionsAPI.getStatus(id)        // Check submission
await submissionsAPI.getRecent()          // Get recent
```

### Environment Variable

```
VITE_API_URL=http://localhost:5000/api
```

Default: `http://localhost:5000/api`

## Design System

### CSS Variables

Located in `src/styles/index.css`:

```css
/* Colors */
--bg-primary: #fafbfc
--bg-secondary: #f4f6f8
--bg-elevated: #ffffff
--text-primary: #0a0d12
--text-secondary: #4a5568
--text-tertiary: #718096
--border-subtle: #e2e8f0
--border-medium: #cbd5e0

/* Accent */
--accent-primary: #0066ff (customizable)
--accent-hover: #0052cc
--accent-light: #e6f0ff (generated)

/* Typography */
--font-sans: -apple-system, BlinkMacSystemFont, ...
--font-mono: 'SF Mono', 'Consolas', ...

/* Spacing */
--space-xs: 0.5rem (customizable)
--space-sm: 1rem
--space-md: 1.5rem
--space-lg: 2rem
--space-xl: 3rem
--space-2xl: 4rem
--space-3xl: 6rem

/* Layout */
--container-max: 1200px
--card-radius: 12px
--transition-fast: 150ms
```

### Customization via TweaksPanel

1. **Accent Color**: Choose from 6 presets or custom
   - Updates `--accent-primary` and `--accent-light`
   
2. **Spacing**: Adjust all spacing by multiplier
   - Compact: 0.75x
   - Generous: 1x (default)
   - Spacious: 1.5x

3. **Variant**: (Future) Switch between design variants

## Responsive Design

Breakpoints (mobile-first):

- **Mobile**: < 768px
  - Single column layouts
  - Filters sidebar hidden
  - Stacked form fields
  - Touch-optimized buttons

- **Tablet**: 768px - 1024px
  - 2-3 column grids
  - Adjusted spacing

- **Desktop**: > 1024px
  - Full multi-column layouts
  - Sidebar filters visible
  - All features active

## Form Validation

Submit form validates:
- **Name**: Min 3 characters
- **Description**: Min 10 characters
- **Environment**: Required
- **Category**: Required
- **Dev Type**: Required
- **Price**: Valid number >= 0
- **URL**: Valid URL format
- **Email**: Valid email format
- **Icon**: Max 3 characters (optional)

Errors displayed above form with user-friendly messages.

## State Management

Uses React hooks:
- `useState` for component state
- `useEffect` for API calls and side effects
- Props for parent-to-child communication

Future: Consider Zustand or Redux for complex state.

## Error Handling

- Network errors: User-friendly messages
- Validation errors: Listed above form
- API errors: Displayed in form message area
- Loading states: Spinner while fetching

## Development Workflow

### Adding a New Page

1. Create component in `src/pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add to `renderPage()` switch statement
4. Add navigation button in Navigation component

Example:
```jsx
// src/pages/Blog.jsx
export default function Blog({ onNavigate }) {
  return (
    <>
      <h1>Blog</h1>
      {/* content */}
    </>
  );
}

// App.jsx - add to switch:
case 'blog':
  return <Blog onNavigate={setCurrentPage} />;
```

### Adding a New Component

1. Create in `src/components/MyComponent.jsx`
2. Export function component
3. Import where needed

### Styling New Components

Add CSS rules to `src/styles/index.css` using:
- CSS classes (BEM naming convention)
- CSS variables for consistency
- Responsive media queries

### API Integration

1. Add endpoint to `src/utils/api.js`
2. Call in component's `useEffect`
3. Handle loading/error states
4. Display results

Example:
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetch = async () => {
    try {
      const res = await extensionsAPI.getAll();
      setData(res.data.data);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

## Performance Optimizations

- Vite for fast dev/build
- React 18 concurrent features
- CSS variables instead of theme providers
- Lazy component loads via routing
- Minimal dependencies

## Troubleshooting

### Blank Page
- Check browser console for errors
- Verify backend is running on correct port
- Check VITE_API_URL in `.env`

### API Connection Errors
- Ensure backend is running (`npm run dev` in backend/)
- Check backend port (default 5000)
- Verify VITE_API_URL matches backend URL
- Check browser console for specific errors

### Styles Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check for CSS import errors in console

### Form Submission Not Working
- Ensure backend is running
- Check email configuration in backend `.env`
- Review browser console for request errors
- Check network tab in DevTools

### Mobile Layout Issues
- Check responsive breakpoints in index.css
- Verify viewport meta tag in index.html
- Test with browser DevTools responsive mode

## Deployment

### Build
```bash
npm run build
```

Creates `dist/` with optimized files.

### Serve Preview
```bash
npm run preview
```

Local preview of built app.

### Deploy to Hosting

1. Build the app
2. Deploy `dist/` folder to hosting service
3. Configure backend URL in environment
4. Ensure CORS is enabled on backend

Options: Vercel, Netlify, AWS S3, GitHub Pages (static), etc.

## Environment Setup for Production

Create `.env.production.local`:
```
VITE_API_URL=https://api.yourdomain.com/api
```

Build will use this for production API calls.

## Browser Support

- Chrome 90+
- Firefox 87+
- Safari 14+
- Edge 90+

Requires ES6+ support.

---

For full project documentation, see [main README.md](../README.md)
