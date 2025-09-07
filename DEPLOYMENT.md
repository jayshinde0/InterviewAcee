# InterviewAce Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
1. GitHub account
2. Vercel account (free tier available)
3. MongoDB Atlas account (free tier available)

### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/interviewace`

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/interviewace.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random 32+ character string
   - `NEXTAUTH_SECRET`: Generate another random string
   - `NEXTAUTH_URL`: Will be auto-set by Vercel
   - `GEMINI_API_KEY`: Your Google AI API key
   - `JUDGE0_API_KEY`: Your RapidAPI Judge0 key
   - `JUDGE0_API_URL`: `https://judge0-ce.p.rapidapi.com`

6. Click "Deploy"

### Step 4: Get API Keys
1. **Gemini API**: Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Judge0 API**: Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)

## 🐳 Alternative: Docker Deployment

### Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy with one click

### Deploy to Render
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add environment variables

## 🔧 Environment Variables Reference

Copy `env.example` to `.env.local` for local development:

```bash
cp env.example .env.local
```

Required variables:
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: For authentication tokens
- `NEXTAUTH_SECRET`: For NextAuth.js
- `GEMINI_API_KEY`: For AI features
- `JUDGE0_API_KEY`: For code execution
- `JUDGE0_API_URL`: Judge0 API endpoint

## 📝 Post-Deployment Checklist

- [ ] Test user registration/login
- [ ] Verify database connections
- [ ] Test AI interview features
- [ ] Check code execution functionality
- [ ] Verify file uploads work
- [ ] Test responsive design on mobile

## 🔍 Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version compatibility
2. **Database connection**: Verify MongoDB URI and network access
3. **API errors**: Check environment variables are set correctly
4. **CORS issues**: Ensure NEXTAUTH_URL matches your domain

### Logs:
- Vercel: Check function logs in dashboard
- Railway: View deployment logs
- Render: Check build and runtime logs

## 🌐 Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable

## 📊 Monitoring

Consider adding:
- Vercel Analytics (built-in)
- Sentry for error tracking
- MongoDB Atlas monitoring
- Uptime monitoring (UptimeRobot, etc.)
