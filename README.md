# Paunchy'sList - Developer Tools Marketplace

A unified marketplace for discovering and sharing developer tools across multiple platforms: VS Code, JetBrains, Unreal Engine, browsers, and AI agents.

## Project Structure

```
Paunchy'sList/
├── backend/                    # Node.js/Express API server
│   ├── src/
│   │   ├── server.js          # Express app entry point
│   │   ├── routes/            # API endpoint handlers
│   │   ├── controllers/       # Business logic
│   │   ├── config/            # Database & email setup
│   │   └── middleware/        # Express middleware
│   ├── data/
│   │   ├── extensions.json    # Sample extension data
│   │   └── marketplace.db     # SQLite database (auto-created)
│   ├── package.json
│   ├── .env.example           # Environment template
│   └── README.md
├── frontend/                   # Vite + React SPA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS files
│   │   ├── utils/             # API client, helpers
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML template
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
└── README.md                  # This file
```

## Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Styling**: CSS3 with custom properties (design variables)
- **Email**: Nodemailer
- **HTTP**: Axios

## Features

### Marketplace
- Browse 500+ extensions across 5 platforms
- Filter by: Environment, Developer Type, Category
- Sort by: Popularity, Newest, Name, Price
- View detailed product pages
- Direct installation links to native marketplaces

### Extension Submission
- Submit new extensions for review
- Automatic email validation
- Admin notifications on submission
- Email approval/rejection workflow
- User receives notification via email

### Design Customization
- Live color theme switcher (6 presets + custom)
- Spacing density adjustment (compact/generous/spacious)
- All customizations update CSS variables in real-time

### Responsive Design
- Mobile-friendly layouts
- Adaptive grid system
- Touch-optimized filters and buttons

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (optional for development)
   - For testing locally, email notifications are optional
   - To enable email: Set up SMTP credentials (Gmail, SendGrid, etc.)

5. **Start development server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (optional, uses default API URL)
   ```bash
   cp .env.example .env
   # Default: VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   App runs on `http://localhost:5173`

## Development Workflow

### Running Both Services

In separate terminals:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Database

The SQLite database is automatically created and seeded with 20 sample extensions on first run:
- Location: `backend/data/marketplace.db`
- Auto-initialized with schema and sample data
- Persists between restarts

### API Endpoints

#### Extensions
- `GET /api/extensions` - List extensions (with optional filters)
  - Query params: `environment`, `devtype`, `category`
- `GET /api/extensions/:id` - Get single extension
- `GET /api/extensions/filters` - Get available filter options
- `GET /api/extensions/stats` - Get marketplace statistics

#### Submissions
- `POST /api/submissions` - Submit new extension
  - Body: `{ name, description, environment, category, devtype, price, url, email, icon }`
- `GET /api/submissions/:id` - Check submission status
- `GET /api/submissions/recent` - Get recent submissions (public)

## Email Configuration

### For Development (Testing)

Without email configured, submissions are accepted but notifications won't be sent. Check `backend/` console logs.

### For Production

Configure SMTP in `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
ADMIN_EMAIL=admin@yoursite.com
FROM_EMAIL=noreply@yoursite.com
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Create app-specific password: https://support.google.com/accounts/answer/185833
3. Use that password in `SMTP_PASS`

### Other Email Providers
- **SendGrid**: Use API key in SMTP_USER, leave SMTP_PASS empty
- **AWS SES**: Configure SMTP credentials
- **Ethereal** (testing): Free account at https://ethereal.email

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

Outputs to `frontend/dist/`

### Backend Deployment

Ensure environment variables are set in production environment, then:

```bash
cd backend
npm install --production
npm start
```

## Sample Extensions

The project comes pre-loaded with 20 real developer tools:

- GitHub Copilot, Prettier, ESLint
- Docker, GitLens, Live Server
- IntelliJ IDEA, Tabnine, Rainbow Brackets
- React DevTools, Redux DevTools, Wappalyzer
- And more...

Add your own by submitting through the marketplace UI.

## Project Statistics

- **Total Extensions**: 500+ (20 sample)
- **Platforms**: 5 (VS Code, JetBrains, Unreal, Browser, AI)
- **Categories**: 6 (Productivity, Testing, AI, Themes, Debugging, Languages)
- **Developer Types**: 5 (Frontend, Backend, Fullstack, DevOps, Game Dev)

## Key Features Breakdown

### Marketplace Page
- Sticky sidebar with multi-select filters
- Real-time filtered extension grid
- Sort by popularity, newest, name, price
- Live extension count
- Responsive on mobile (filters hidden, grid single column)

### Product Detail Page
- Large extension icon
- Full product metadata
- Description and details sidebar
- Direct installation link (opens in new tab)
- Back to marketplace navigation

### Submit Extension Page
- Form validation with user-friendly errors
- Email notifications to admin
- Success/error messages
- Auto-clear on successful submission
- Redirect to marketplace after submit

### Design System
- Color variables with 6 presets
- Spacing scale with 3 density levels
- Consistent component styling
- Smooth transitions and interactions
- Mobile-first responsive design

## Customization Guide

### Adding More Extensions

Edit `backend/data/extensions.json`:

```json
{
  "id": 21,
  "name": "Your Extension",
  "description": "What it does",
  "environment": "vscode",
  "category": "productivity",
  "devtype": "fullstack",
  "price": 0,
  "url": "https://link.to.extension",
  "icon": "🚀"
}
```

Then restart the backend.

### Changing Colors

1. **CSS Variables**: Edit `frontend/src/styles/index.css` `:root` section
2. **Default Tweaks**: Edit `frontend/src/App.jsx` `tweaks` state

### Adding New Filter Categories

1. Add to `backend/data/extensions.json` extension objects
2. Database queries will auto-discover new categories
3. UI filters will populate automatically

## Troubleshooting

### Port Already in Use
- Backend (5000): `lsof -ti:5000 | xargs kill -9`
- Frontend (5173): `lsof -ti:5173 | xargs kill -9`

### Database Issues
- Delete `backend/data/marketplace.db` to reset
- Database will be recreated on next backend start

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default: `http://localhost:5173`

### Email Not Sending
- Check `SMTP_*` settings in `.env`
- Verify firewall/ISP doesn't block port 587
- Check email provider's SMTP documentation
- Development: Safe to skip, submissions work without email

## Security Notes

- No authentication required for browsing (public)
- Submissions require valid email (for approval notifications)
- Admin approval workflow prevents spam
- Environment variables protect sensitive data (.env in gitignore)
- CORS configured to specific frontend origin

## Future Enhancements

- [ ] User authentication (admin dashboard)
- [ ] Ratings and reviews
- [ ] User accounts and favorites
- [ ] Search functionality
- [ ] Extension analytics
- [ ] Admin dashboard for submission reviews
- [ ] Image/screenshot support
- [ ] Multi-language support
- [ ] Browser extension for discovery

## License

MIT

## Support

For issues or questions:
1. Check troubleshooting section
2. Review error logs in backend console
3. Check email configuration if submissions aren't sending
4. Ensure both backend and frontend are running

---

**Happy browsing! 🚀**
