# DevTalk Deployment Guide for Render

This guide will walk you through deploying the DevTalk application on Render.

## Overview

DevTalk consists of three main components:
1. **PostgreSQL Database** - Stores all application data
2. **Backend Service** - Java Spring Boot REST API
3. **Frontend Static Site** - React + TypeScript + Vite application

## Prerequisites

Before you begin, you need:
- [ ] A [Render](https://render.com) account (free tier works)
- [ ] A GitHub account
- [ ] A GitHub OAuth App (create one at https://github.com/settings/developers)
- [ ] Git repository connected to Render

## Deployment Methods

You have two options to deploy on Render:

### Option 1: Using render.yaml (Recommended - Infrastructure as Code)

This is the easiest method as it automatically creates all services.

1. **Push the code to GitHub** (if not already done)

2. **Connect to Render**:
   - Go to https://dashboard.render.com/blueprints
   - Click "New Blueprint Instance"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**:
   After the blueprint creates your services, you need to manually set these environment variables:

   **For `devtalk-backend` service:**
   - `GITHUB_CLIENT_ID` - Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET` - Your GitHub OAuth App Client Secret
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://devtalk-frontend.onrender.com`)

   **For `devtalk-frontend` service:**
   - `VITE_API_URL` - Your backend URL (e.g., `https://devtalk-backend.onrender.com`)

4. **Update GitHub OAuth App**:
   - Go to your GitHub OAuth App settings
   - Update the **Authorization callback URL** to:
     ```
     https://your-backend-url.onrender.com/login/oauth2/code/github
     ```

5. **Trigger Redeploy**:
   - After setting environment variables, manually trigger a redeploy for both services

### Option 2: Manual Setup

If you prefer to create services manually:

#### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com/new/database
2. Configure:
   - **Name**: `devtalk-db`
   - **Database**: `devtalk`
   - **User**: `devtalk_user`
   - **Region**: Choose your preferred region
   - **Plan**: Free (or higher for production)
3. Click "Create Database"
4. **Save the connection details** - you'll need them for the backend

#### Step 2: Deploy Backend Service

1. Go to https://dashboard.render.com/create?type=web
2. Configure:
   - **Name**: `devtalk-backend`
   - **Runtime**: Java
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**:
     ```bash
     ./mvnw clean package -DskipTests
     ```
   - **Start Command**:
     ```bash
     java -jar target/backend-0.0.1-SNAPSHOT.jar
     ```
   - **Plan**: Free (or higher for production)

3. **Add Environment Variables**:
   Click "Advanced" and add:
   ```
   SPRING_PROFILES_ACTIVE=production
   SERVER_PORT=8080
   DB_HOST=[from database connection info]
   DB_PORT=5432
   DB_NAME=devtalk
   DB_USERNAME=[from database connection info]
   DB_PASSWORD=[from database connection info]
   GITHUB_CLIENT_ID=[your GitHub OAuth client ID]
   GITHUB_CLIENT_SECRET=[your GitHub OAuth client secret]
   FRONTEND_URL=https://[your-frontend-url].onrender.com
   ```

4. **Set Health Check Path**:
   - Under "Advanced", set Health Check Path to: `/actuator/health`

5. Click "Create Web Service"

6. **Note the backend URL** - you'll need it for the frontend (e.g., `https://devtalk-backend.onrender.com`)

#### Step 3: Update GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Select your OAuth App (or create a new one)
3. Update settings:
   - **Homepage URL**: `https://[your-frontend-url].onrender.com`
   - **Authorization callback URL**: `https://[your-backend-url].onrender.com/login/oauth2/code/github`
4. Save changes

#### Step 4: Deploy Frontend Static Site

1. Go to https://dashboard.render.com/create?type=static
2. Configure:
   - **Name**: `devtalk-frontend`
   - **Region**: Same as backend (recommended)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`
   - **Plan**: Free (or higher for production)

3. **Add Environment Variables**:
   ```
   VITE_API_URL=https://[your-backend-url].onrender.com
   ```

4. **Configure Redirects/Rewrites** (for React Router):
   - Under "Advanced", add Rewrite Rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

5. Click "Create Static Site"

#### Step 5: Update Backend with Frontend URL

1. Go back to your backend service settings
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Trigger a manual redeploy

## Post-Deployment Verification

After deployment, verify everything works:

### 1. Check Backend Health
Visit: `https://your-backend.onrender.com/actuator/health`

Expected response:
```json
{"status":"UP"}
```

### 2. Test Authentication Flow
1. Visit your frontend URL
2. Click "Login with GitHub"
3. You should be redirected to GitHub OAuth
4. After authorization, you should be redirected back to `/dashboard`

### 3. Test WebSocket Connection
1. Log into the application
2. Navigate to a chat channel
3. Send a message
4. Verify real-time message delivery works

## Common Issues & Troubleshooting

### Issue: CORS Errors

**Symptoms**: Browser console shows CORS errors when making API requests

**Solution**:
1. Verify `FRONTEND_URL` is set correctly in backend environment variables
2. Ensure the URL matches exactly (including https://)
3. Redeploy the backend service after changing environment variables

### Issue: OAuth Redirect Loop

**Symptoms**: After GitHub login, continuously redirected or error page

**Solution**:
1. Check GitHub OAuth App callback URL matches your backend URL exactly
2. Verify `FRONTEND_URL` environment variable is set in backend
3. Check backend logs for authentication errors

### Issue: WebSocket Connection Fails

**Symptoms**: Messages don't send in real-time, console shows WebSocket errors

**Solution**:
1. Verify `VITE_API_URL` points to correct backend URL
2. Check that backend service is running (not in sleep mode on free tier)
3. Render supports WebSockets by default, but ensure your plan allows it

### Issue: Database Connection Failed

**Symptoms**: Backend health check fails, errors about database connection

**Solution**:
1. Verify all database environment variables are set correctly
2. Check database is in the same region or connection is allowed
3. Review backend logs for specific connection errors

### Issue: Build Fails

**Backend Build Fails**:
- Check Java version (requires Java 21)
- Verify Maven wrapper has execute permissions
- Review build logs for specific errors

**Frontend Build Fails**:
- Check Node.js version compatibility
- Clear build cache and retry
- Verify all dependencies are in package.json

### Issue: Free Tier Services Sleeping

**Symptoms**: First request takes 30+ seconds

**Solution**:
- Free tier services sleep after 15 minutes of inactivity
- Consider upgrading to paid plan for production
- Use an uptime monitoring service to ping your app periodically

## Environment Variables Reference

### Backend (`devtalk-backend`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | No | Spring profile | `production` |
| `SERVER_PORT` | No | Server port (defaults to 8080) | `8080` |
| `DB_HOST` | Yes | PostgreSQL hostname | `dpg-xxxxx-a.oregon-postgres.render.com` |
| `DB_PORT` | Yes | PostgreSQL port | `5432` |
| `DB_NAME` | Yes | Database name | `devtalk` |
| `DB_USERNAME` | Yes | Database username | `devtalk_user` |
| `DB_PASSWORD` | Yes | Database password | (from Render database) |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth Client ID | `Iv1.xxxxxxxxxxxxx` |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth Secret | `xxxxxxxxxxxxx` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS and OAuth | `https://devtalk-frontend.onrender.com` |

### Frontend (`devtalk-frontend`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `https://devtalk-backend.onrender.com` |

## Production Recommendations

Before going to production, consider:

1. **Upgrade from Free Tier**:
   - Free services sleep after 15 minutes of inactivity
   - Free databases have storage limits
   - Starter tier provides always-on services

2. **Database Migrations**:
   - Current setup uses Hibernate auto-DDL (`update` mode)
   - Consider implementing Flyway or Liquibase for production
   - This provides better control over schema changes

3. **Environment Separation**:
   - Create separate Render projects for staging and production
   - Use different GitHub OAuth Apps for each environment

4. **Monitoring**:
   - Enable health checks in Render
   - Set up log aggregation
   - Consider using application monitoring tools

5. **Security**:
   - Review CORS settings
   - Enable HTTPS only (Render provides this by default)
   - Regularly update dependencies
   - Keep secrets secure (never commit `.env` files)

6. **Performance**:
   - Consider enabling connection pooling optimizations
   - Optimize database queries
   - Add caching where appropriate
   - Use CDN for static assets

## Updating Your Deployment

### Deploy New Code Changes

**Backend**:
1. Push changes to GitHub
2. Render auto-deploys from your main branch
3. Or manually trigger deploy from Render dashboard

**Frontend**:
1. Push changes to GitHub
2. Render auto-deploys from your main branch
3. Or manually trigger deploy from Render dashboard

### Update Environment Variables

1. Go to service settings in Render dashboard
2. Update the environment variable
3. Click "Save Changes"
4. Manually trigger a redeploy

## Cost Estimates

### Free Tier (Development/Testing)
- Database: Free (expires after 90 days, 1GB storage)
- Backend Web Service: Free (750 hours/month)
- Frontend Static Site: Free
- **Total: $0/month** (with limitations)

### Production Tier (Recommended)
- Database: Starter ($7/month, 256MB RAM, 1GB storage)
- Backend Web Service: Starter ($7/month, 512MB RAM)
- Frontend Static Site: Free
- **Total: $14/month**

## Support & Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Spring Boot on Render**: https://render.com/docs/deploy-spring-boot
- **Static Sites on Render**: https://render.com/docs/static-sites

## Checklist: Ready for Production?

- [ ] All environment variables configured
- [ ] GitHub OAuth app updated with production URLs
- [ ] Database backups enabled
- [ ] Health checks configured and passing
- [ ] CORS settings verified
- [ ] WebSocket connections tested
- [ ] Authentication flow working
- [ ] Real-time chat functionality tested
- [ ] SSL/HTTPS enabled (automatic on Render)
- [ ] Logs reviewed for errors
- [ ] Performance tested under load
- [ ] Monitoring set up

---

## Need Help?

If you encounter issues not covered in this guide:
1. Check the Render dashboard logs for both services
2. Review the [Render documentation](https://render.com/docs)
3. Check Spring Boot and React + Vite deployment guides
4. Verify all environment variables are set correctly
