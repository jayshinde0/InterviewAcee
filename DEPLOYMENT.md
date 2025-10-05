# 🚀 InterviewAce Deployment Guide

## Option 1: Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/interviewace.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:

```env
MONGODB_URI=mongodb+srv://jayshinde4554_db_user:E7XMTJrQ0Z3T4mfk@cluster0.ud0xhwb.mongodb.net/interviewace_clean?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=4d9f2e3a7c6b1f9a8d2e0f5c3b7a1d4e9f0c2b6d8e7f4a5c1b9d3e8f7a6c2b1
NODE_ENV=production
GEMINI_API_KEY=AIzaSyBo55GjHIWqohapAH7wK2KRc2DsH-rShEI
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=6801e6d8f8msh30f22f8babffea7p1771edjsnb0a05476e6d1
NEXTAUTH_SECRET=4d9f2e3a7c6b1f9a8d2e0f5c3b7a1d4e9f0c2bdasdasdasdasdas
NEXTAUTH_URL=https://your-app-name.vercel.app
```

5. Click "Deploy"

### Step 3: Update NEXTAUTH_URL
After deployment, update `NEXTAUTH_URL` with your actual Vercel URL.

---

## Option 2: Railway Deployment

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy
```bash
railway login
railway init
railway add
railway deploy
```

### Step 3: Add Environment Variables
```bash
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_jwt_secret"
# ... add all other variables
```

---

## Option 3: Netlify + Serverless Functions

### Step 1: Build Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  directory = ".netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Step 2: Deploy
1. Connect GitHub repo to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy

---

## Option 4: Self-Hosted (VPS/Cloud Server)

### Requirements
- Ubuntu/CentOS server
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy

### Step 1: Server Setup
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt update
sudo apt install nginx
```

### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/interviewace.git
cd interviewace

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "interviewace" -- start
pm2 save
pm2 startup
```

### Step 3: Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Production Optimizations

### 1. Environment Variables Security
- Never commit `.env.local` to Git
- Use different secrets for production
- Rotate API keys regularly

### 2. Database Optimization
- Use MongoDB Atlas for production
- Enable connection pooling
- Set up database indexes
- Regular backups

### 3. Performance
- Enable Next.js Image Optimization
- Use CDN for static assets
- Implement caching strategies
- Monitor performance with Vercel Analytics

### 4. Security
- Enable HTTPS
- Set up CORS properly
- Validate all inputs
- Rate limiting for APIs

---

## 🚨 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas connection working
- [ ] Judge0 API keys valid
- [ ] Build process successful (`npm run build`)
- [ ] No console errors in production
- [ ] Authentication working
- [ ] Problem submission working
- [ ] Progress tracking working

---

## 📊 Monitoring & Maintenance

### Vercel Analytics
- Built-in performance monitoring
- Real-time error tracking
- User analytics

### MongoDB Atlas Monitoring
- Connection monitoring
- Query performance
- Storage usage alerts

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for user sessions
- Uptime monitoring

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🆘 Troubleshooting

### Common Issues
1. **Build Failures**: Check TypeScript errors
2. **API Errors**: Verify environment variables
3. **Database Connection**: Check MongoDB Atlas IP whitelist
4. **Authentication Issues**: Verify NEXTAUTH_URL and secrets

### Debug Commands
```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check environment variables
echo $MONGODB_URI
```