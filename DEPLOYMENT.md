# Deployment Guide - Paunchy'sList

Complete guide to deploying Paunchy'sList to production using Vercel and other platforms.

## Architecture Overview

- **Frontend**: React + Vite (static site) → Vercel
- **Backend**: Node.js + Express (API) → Vercel, Railway, Fly.io, or Heroku
- **Database**: SQLite (can migrate to PostgreSQL for production)

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Frontend on Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Paunchy'sList marketplace"
   git push origin main
   ```

2. **Deploy Frontend**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Select your `Paunchy'sList` repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Click Deploy

3. **Set Environment Variables** (in Vercel Project Settings)
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Get Frontend URL**: Vercel provides `https://pauchy-list.vercel.app` (or custom domain)

#### Backend on Vercel

Note: Vercel serverless has limitations for long-running processes. Better alternatives below.

### Option 2: Railway (Recommended for Backend)

Railway is perfect for Node.js backends with databases.

1. **Prepare Backend**
   ```bash
   # In backend directory
   npm install
   ```

2. **Deploy**
   - Go to https://railway.app
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `Paunchy'sList` repo
   - Select `backend` directory
   - Railway auto-detects Node.js

3. **Environment Variables** (in Railway Dashboard)
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=admin@yourdomain.com
   FROM_EMAIL=noreply@yourdomain.com
   ```

4. **Database** (PostgreSQL recommended)
   - Railway provides free PostgreSQL
   - Update `backend/src/config/database.js` to use PostgreSQL (optional)
   - For SQLite: Database persists in Railway volumes

5. **Get Backend URL**: Railway provides `https://your-project.up.railway.app`

### Option 3: Fly.io (Alternative)

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   flyctl launch
   # Answer prompts, creates fly.toml
   flyctl deploy
   ```

3. **Set Secrets**
   ```bash
   flyctl secrets set SMTP_USER=your-email@gmail.com
   flyctl secrets set SMTP_PASS=your-password
   # etc...
   ```

### Option 4: Heroku (Legacy but Simple)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SMTP_USER=your-email@gmail.com
   # etc...
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Complete Setup: Vercel Frontend + Railway Backend

### Step 1: Push to GitHub

```bash
cd /path/to/Paunchy'sList
git add .
git commit -m "feat: Initial Paunchy'sList marketplace with full stack"
git push origin main
```

### Step 2: Deploy Frontend to Vercel

1. Visit https://vercel.com/new
2. Import your GitHub repo
3. Project settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```
5. Deploy!

### Step 3: Deploy Backend to Railway

1. Visit https://railway.app/dashboard
2. New Project → Deploy from GitHub
3. Select repository and `backend` directory
4. Railway auto-configures Node.js
5. Add Variables:
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your-email>
   SMTP_PASS=<your-app-password>
   ADMIN_EMAIL=admin@yourdomain.com
   FROM_EMAIL=noreply@yourdomain.com
   DB_PATH=/data/marketplace.db
   ```
6. Deploy!

### Step 4: Update Frontend with Backend URL

Once backend is deployed:

1. Go to Vercel project settings
2. Update environment variable:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app/api
   ```
3. Redeploy frontend

### Step 5: Update CORS in Backend

Your backend automatically trusts the frontend URL from the environment variable, so no manual changes needed. Just ensure `FRONTEND_URL` is set correctly.

## Database Migration

### SQLite to PostgreSQL

For production, consider PostgreSQL for better scalability:

1. **Create PostgreSQL on Railway**
   - Railway auto-provides PostgreSQL connection string
   - Set `DATABASE_URL` environment variable

2. **Update backend code** (optional)
   ```javascript
   // src/config/database.js - add PostgreSQL support
   // Or use an ORM like Prisma
   ```

3. For now, SQLite works fine - Railway persists volumes automatically

## Custom Domain

### Vercel Frontend

1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.paunchy-list.com`)
3. Update DNS records as instructed

### Railway Backend

1. Go to Project Settings → Environment → Domain
2. Railway provides a domain (e.g., `production-env.up.railway.app`)
3. Or add custom domain via DNS

## Email Configuration

### Gmail (Recommended)

1. Enable 2-factor authentication
2. Create app-specific password: https://support.google.com/accounts/answer/185833
3. Set in environment:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   ```

### SendGrid

1. Create account at https://sendgrid.com
2. Get API key
3. Use with SMTP or SendGrid integration

### Mailgun

1. Create account at https://mailgun.com
2. Get SMTP credentials
3. Set in environment variables

## Monitoring & Logs

### Vercel
- Dashboard shows build/deploy logs
- Analytics show request metrics
- Real-time error tracking

### Railway
- Logs tab shows real-time output
- Metrics tab shows CPU, memory, network
- Database browser for SQLite inspection

### Fly.io
```bash
flyctl logs              # Stream logs
flyctl status            # App status
flyctl monitoring        # Metrics
```

## Health Checks

Test your deployed services:

```bash
# Frontend (Vercel)
curl https://your-frontend.vercel.app

# Backend (Railway)
curl https://your-backend.up.railway.app/health
# Should return: { "status": "ok", "timestamp": "..." }

# API
curl https://your-backend.up.railway.app/api/extensions
# Should return: { "success": true, "data": [...], "count": 20 }
```

## Troubleshooting Deployment

### Frontend won't build
- Check build logs in Vercel dashboard
- Ensure `frontend/package.json` has correct scripts
- Verify `VITE_API_URL` is set

### Backend won't start
- Check logs: Railway dashboard → Logs
- Verify environment variables are set
- Ensure PORT is not hardcoded (use `process.env.PORT`)

### CORS errors
- Update `FRONTEND_URL` in backend environment
- Ensure backend CORS middleware includes frontend domain
- Check browser console for specific error

### Database issues
- SQLite: Check if `.db` file is being created
- Railway persists `/data` automatically
- Check database file permissions

### Email not sending
- Verify SMTP credentials are correct
- Check inbox spam folder
- Review backend logs for errors
- Ensure firewall allows port 587

## Continuous Deployment

Both Vercel and Railway auto-deploy on `git push`:

```bash
# Make changes
git add .
git commit -m "fix: improve extension filtering"
git push origin main

# Automatically deploys to:
# - Frontend: Vercel
# - Backend: Railway
```

## Scaling Considerations

### Current Setup
- Suitable for: Startup, MVP, 1K-10K monthly users
- Free tier covers most costs
- SQLite handles thousands of extensions

### Scaling Up
- Migrate to PostgreSQL (Railway)
- Add caching (Redis)
- Use CDN for frontend assets (Vercel handles this)
- Monitor performance metrics

## Cost Estimate

- **Vercel Frontend**: Free tier ($0/month)
- **Railway Backend**: Free tier + $5/month credits ($5-20/month)
- **Domain**: ~$10-12/year
- **Email**: Free (Gmail) or $20-100/month (SendGrid/Mailgun)

**Total**: ~$10-30/month for production

## Production Checklist

- [ ] Push code to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Set all environment variables
- [ ] Test API endpoints from frontend
- [ ] Configure custom domain (optional)
- [ ] Set up email notifications
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Monitor logs and metrics
- [ ] Set up uptime monitoring (Uptime Robot)

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Fly.io Docs**: https://fly.io/docs
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-performance

---

For detailed local development setup, see [README.md](./README.md)
