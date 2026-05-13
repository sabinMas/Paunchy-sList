# Paunchy'sList Backend API

Node.js + Express backend for the Paunchy'sList marketplace.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
# Edit .env with your settings (optional for development)
```

### 3. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Extensions

#### Get All Extensions
```
GET /api/extensions
```

Query parameters (optional):
- `environment`: Filter by environment (vscode, jetbrains, unreal, browser, ai)
- `devtype`: Filter by developer type (frontend, backend, fullstack, devops, gamedev)
- `category`: Filter by category (productivity, testing, ai, themes, debugging, languages)

Example:
```
GET /api/extensions?environment=vscode&devtype=frontend
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "GitHub Copilot",
      "description": "AI-powered code completion...",
      "environment": "vscode",
      "category": "ai",
      "devtype": "fullstack",
      "price": 10.00,
      "url": "https://...",
      "icon": "🤖",
      "created_at": "2024-05-13T22:41:00"
    }
  ],
  "count": 1
}
```

#### Get Single Extension
```
GET /api/extensions/:id
```

#### Get Available Filters
```
GET /api/extensions/filters
```

Response:
```json
{
  "success": true,
  "data": {
    "environments": ["vscode", "jetbrains", "unreal", "browser"],
    "devtypes": ["frontend", "backend", "fullstack", "devops", "gamedev"],
    "categories": ["productivity", "testing", "ai", "themes", "debugging", "languages"]
  }
}
```

#### Get Marketplace Stats
```
GET /api/extensions/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalExtensions": 20,
    "environments": 4,
    "devTypes": 5,
    "categories": 6
  }
}
```

### Submissions

#### Submit New Extension
```
POST /api/submissions
Content-Type: application/json

{
  "name": "My Extension",
  "description": "What it does...",
  "environment": "vscode",
  "category": "productivity",
  "devtype": "fullstack",
  "price": 0,
  "url": "https://marketplace.visualstudio.com/...",
  "email": "author@example.com",
  "icon": "📦"  // optional
}
```

Response (201 Created):
```json
{
  "success": true,
  "message": "Extension submitted successfully!...",
  "data": {
    "id": "uuid-here",
    "status": "pending"
  }
}
```

#### Check Submission Status
```
GET /api/submissions/:submissionId
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "My Extension",
    "status": "pending",
    "email": "author@example.com",
    "created_at": "2024-05-13T22:45:00",
    "reviewed_at": null
  }
}
```

Possible statuses: `pending`, `approved`, `rejected`

#### Get Recent Submissions
```
GET /api/submissions/recent
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Extension Name",
      "status": "pending",
      "created_at": "2024-05-13T22:45:00"
    }
  ]
}
```

## Environment Variables

See `.env.example` for all available options.

### Essential Variables

```
# Server
PORT=5000
NODE_ENV=development

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173

# Database
DB_PATH=./data/marketplace.db

# Email (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
ADMIN_EMAIL=admin@yoursite.com
FROM_EMAIL=noreply@yoursite.com
```

## Database

### Auto-Initialization
- SQLite database created automatically on first run
- Schema created: `extensions` and `submissions` tables
- Seeded with 20 sample extensions from `data/extensions.json`

### Database Location
```
backend/data/marketplace.db
```

### Reset Database
```bash
rm backend/data/marketplace.db
npm run dev  # will recreate and seed
```

## Sample Extensions

20 pre-loaded extensions are automatically added on first run:
- **VS Code**: GitHub Copilot, Prettier, ESLint, Docker, GitLens, Live Server, Thunder Client, Code Runner
- **JetBrains**: IntelliJ IDEA Ultimate, Tabnine AI, Rainbow Brackets, Material Theme UI, Database Tools
- **Unreal**: Unreal Insights, Blutility
- **Browser**: React DevTools, Redux DevTools, Wappalyzer, ColorZilla, JSON Viewer

Add more by editing `data/extensions.json` before first run, or use the submission API.

## Email Configuration

### Gmail (Recommended for Development)
1. Enable 2-factor authentication on your Google account
2. Create an app-specific password: https://support.google.com/accounts/answer/185833
3. Use that password in `SMTP_PASS`

### Other Providers
- **SendGrid**: Use API key, configure for SMTP
- **AWS SES**: Configure regional SMTP endpoint
- **Ethereal** (testing): Free at https://ethereal.email
- **Mailgun**: Use SMTP credentials

### Testing Without Email
Development environment works fine without email configured. Submissions are accepted but notifications don't send.

Check backend console for submission confirmation.

## Error Handling

All errors return JSON with `success: false` and error message:

```json
{
  "success": false,
  "error": "Extension not found"
}
```

### Common Errors
- `400 Bad Request` - Validation failed (missing fields, invalid format)
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server issue (check logs)

## Development

### File Structure
```
src/
├── server.js              # Express app setup
├── routes/                # API route definitions
│   ├── extensions.js
│   └── submissions.js
├── controllers/           # Business logic
│   ├── extensionsController.js
│   └── submissionsController.js
├── config/               # Configuration
│   ├── database.js      # SQLite setup
│   └── email.js         # Nodemailer setup
└── middleware/           # Express middleware (future)

data/
├── extensions.json       # Sample extension data
└── marketplace.db        # SQLite database (auto-created)
```

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create route in `src/routes/`
3. Import and use in `src/server.js`

Example:
```javascript
// src/routes/reviews.js
import express from 'express';
import { getReviews, addReview } from '../controllers/reviewsController.js';

const router = express.Router();
router.get('/', getReviews);
router.post('/', addReview);
export default router;

// src/server.js
import reviewsRoutes from './routes/reviews.js';
app.use('/api/reviews', reviewsRoutes);
```

## Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-05-13T22:41:00.000Z"
}
```

## Troubleshooting

### Port 5000 Already in Use
```bash
# Find process
lsof -ti:5000

# Kill it
lsof -ti:5000 | xargs kill -9
```

### Database Locked Error
- Ensure only one backend instance is running
- Delete `marketplace.db` and restart if corrupted

### CORS Errors
- Check `FRONTEND_URL` in `.env` matches your frontend origin
- Default: `http://localhost:5173`

### Email Not Sending
- Verify SMTP credentials are correct
- Check email provider's SMTP requirements
- Review server logs for specific error
- Gmail: Verify app-specific password is set correctly

## Performance Tips

- Database queries use async/await for non-blocking
- Connection pooling configured for SQLite
- CORS and body-parser configured efficiently
- Error handling prevents uncaught exceptions

## Security Considerations

- Input validation on all endpoints
- CORS limited to configured frontend URL
- No sensitive data in error messages
- Environment variables protect credentials
- Email addresses validated before processing

---

For full project documentation, see [main README.md](../README.md)
