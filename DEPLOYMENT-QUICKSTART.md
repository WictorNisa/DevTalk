# DevTalk Render Deployment - Quick Start Guide

## 🚀 Fast Track Deployment (5 minutes)

### Step 1: Prerequisites (2 minutes)
1. Create GitHub OAuth App: https://github.com/settings/developers
   - Homepage URL: `https://your-app.onrender.com` (update later)
   - Callback URL: `https://your-backend.onrender.com/login/oauth2/code/github` (update later)
   - **Save Client ID and Client Secret**

### Step 2: Deploy Using Blueprint (1 minute)
1. Push your code to GitHub (if not already done)
2. Go to: https://dashboard.render.com/blueprints
3. Click "New Blueprint Instance"
4. Select your DevTalk repository
5. Click "Apply"

### Step 3: Configure Environment Variables (2 minutes)

**Backend Service (`devtalk-backend`):**
1. Go to service → Environment
2. Add these three variables:
   ```
   GITHUB_CLIENT_ID=<your-github-client-id>
   GITHUB_CLIENT_SECRET=<your-github-client-secret>
   FRONTEND_URL=<will-fill-after-frontend-deploys>
   ```

**Frontend Service (`devtalk-frontend`):**
1. Go to service → Environment
2. Add:
   ```
   VITE_API_URL=<your-backend-url-from-render>
   ```

### Step 4: Update Cross-References (1 minute)
1. Get your backend URL (e.g., `https://devtalk-backend.onrender.com`)
2. Update frontend's `VITE_API_URL` with backend URL
3. Get your frontend URL (e.g., `https://devtalk-frontend.onrender.com`)
4. Update backend's `FRONTEND_URL` with frontend URL
5. Update GitHub OAuth App callback URL with backend URL

### Step 5: Redeploy (30 seconds)
1. Trigger manual redeploy for both backend and frontend services
2. Wait for deployment to complete (~3-5 minutes)

### Step 6: Test (1 minute)
1. Visit your frontend URL
2. Click login
3. Authorize with GitHub
4. You should land on the dashboard!

---

## 📋 Deployment Checklist

- [ ] GitHub OAuth App created
- [ ] Code pushed to GitHub
- [ ] Blueprint deployed on Render
- [ ] Backend environment variables set
- [ ] Frontend environment variables set
- [ ] GitHub OAuth callback URL updated
- [ ] Both services redeployed
- [ ] Authentication tested
- [ ] WebSocket/chat tested

---

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **GitHub OAuth Apps**: https://github.com/settings/developers
- **Full Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## ⚡ Common First-Time Issues

### "CORS Error"
- ✅ Make sure `FRONTEND_URL` is set in backend
- ✅ Redeploy backend after setting variables

### "OAuth Redirect Loop"
- ✅ Update GitHub OAuth callback URL to match backend URL
- ✅ Make sure it ends with `/login/oauth2/code/github`

### "Service Unavailable"
- ✅ Free tier services sleep after 15 min - first request takes 30-50 seconds
- ✅ Check service logs in Render dashboard

---

## 💰 Pricing

**Free Tier** (Good for testing):
- 3 services (database + backend + frontend)
- Database expires after 90 days
- Services sleep after 15 minutes of inactivity
- **Cost: $0/month**

**Production Tier** (Recommended):
- PostgreSQL: $7/month
- Backend: $7/month
- Frontend: Free
- **Total: $14/month**

---

## 🆘 Need Help?

See the full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
