# Render Deployment Guide for DevTalk

This guide will help you deploy the DevTalk application to Render.

## Prerequisites

1. A [Render account](https://render.com/)
2. A PostgreSQL database (you can use Render's managed PostgreSQL or your existing database at 46.59.44.87)
3. GitHub OAuth App credentials
4. Your GitHub repository connected to Render

## Deployment Steps

### Option 1: Deploy using render.yaml (Recommended)

This is the easiest method as Render will automatically configure both services.

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create a New Blueprint Instance on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect the `render.yaml` file automatically

3. **Configure Environment Variables**

   For the **backend service**, set these in Render dashboard:
   - `GITHUB_CLIENT_ID` - Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET` - Your GitHub OAuth App Client Secret
   - `DB_HOST` - Your PostgreSQL host (e.g., 46.59.44.87 or Render's DB hostname)
   - `DB_NAME` - Your database name (e.g., devtalkdb)
   - `DB_USERNAME` - Your database username
   - `DB_PASSWORD` - Your database password
   - `FRONTEND_URL` - Your frontend URL (e.g., https://devtalk-frontend.onrender.com)
   - `BACKEND_URL` - Your backend URL (e.g., https://devtalk-backend.onrender.com) - for Swagger/OpenAPI
   - `SPRING_PROFILES_ACTIVE` - Set to `prod` (already configured in render.yaml)

   For the **frontend service**, set:
   - `VITE_API_URL` - Your backend URL (e.g., https://devtalk-backend.onrender.com)

4. **Deploy**
   - Click "Apply" to create the services
   - Render will build and deploy both services

### Option 2: Manual Deployment

#### Deploy Backend

1. **Create a new Web Service**
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: devtalk-backend
     - **Runtime**: Java
     - **Build Command**: `cd backend && ./mvnw clean package -DskipTests`
     - **Start Command**: `cd backend && java -jar target/backend-0.0.1-SNAPSHOT.jar`
     - **Instance Type**: Free or paid tier

2. **Add Environment Variables** (same as above)

3. **Add Health Check**
   - Path: `/actuator/health`

#### Deploy Frontend

1. **Create a new Web Service**
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: devtalk-frontend
     - **Runtime**: Node
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Start Command**: `cd frontend && npm run start`
     - **Instance Type**: Free or paid tier

2. **Add Environment Variable**
   - `VITE_API_URL`: Your backend URL

## Post-Deployment Configuration

### Update GitHub OAuth App

After deployment, update your GitHub OAuth App settings:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Update your OAuth App:
   - **Homepage URL**: Your frontend URL (e.g., https://devtalk-frontend.onrender.com)
   - **Authorization callback URL**: Your backend URL + `/login/oauth2/code/github`
     (e.g., https://devtalk-backend.onrender.com/login/oauth2/code/github)

### Update CORS Settings

The backend will automatically allow your frontend URL based on the `FRONTEND_URL` environment variable.

## Important Notes

### Database Connection

- Ensure your PostgreSQL database allows connections from Render's IP addresses
- If using Render's managed PostgreSQL, you'll get a connection string automatically
- For external databases (like your current 46.59.44.87), ensure the firewall allows Render's connections

### Free Tier Limitations

If using Render's free tier:
- Services will spin down after 15 minutes of inactivity
- First request after spin-down will take 30-60 seconds
- Database has 90-day expiration on free tier
- Consider upgrading to paid tier for production use

### Environment Variables

- Never commit `.env` files to Git
- Use the `.env.example` files as templates
- Set all environment variables in Render's dashboard

### Build Times

- Backend build: ~2-5 minutes (Maven downloads dependencies)
- Frontend build: ~1-3 minutes (npm install + build)

### Troubleshooting

1. **Backend fails to start**
   - Check environment variables are set correctly
   - Verify database connection details
   - Check logs in Render dashboard

2. **Frontend can't connect to backend**
   - Verify `VITE_API_URL` is set to your backend URL
   - Check CORS settings in backend
   - Ensure backend is running and healthy

3. **OAuth login fails**
   - Verify GitHub OAuth App callback URL is correct
   - Check `FRONTEND_URL` environment variable in backend
   - Ensure GitHub OAuth credentials are correct

4. **WebSocket connection fails**
   - Render supports WebSockets on all plans
   - Check that `VITE_API_URL` is correctly set
   - Verify backend WebSocket endpoint is accessible

## Monitoring

- Access logs in Render dashboard
- Monitor health check endpoint: `https://your-backend-url.onrender.com/actuator/health`
- Set up alerts in Render for service failures

## Updating Your Deployment

Render automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will detect the changes and redeploy automatically.

## Cost Estimate

**Free Tier:**
- 750 hours/month of service time (shared across all services)
- 100 GB bandwidth/month
- PostgreSQL database (90 days, 1GB storage)

**Paid Tier (Starter):**
- ~$7/month per service
- Persistent instances (no spin-down)
- Custom domains
- More resources

## Important Configuration Notes

### Security Improvements

The application now includes production-ready security configurations:

1. **Environment-based CORS**: In production (`SPRING_PROFILES_ACTIVE=prod`), CORS is restricted to only the configured `FRONTEND_URL`. Localhost URLs are automatically excluded in production.

2. **WebSocket Security**: WebSocket connections now respect the same CORS configuration as HTTP endpoints, preventing unauthorized connections.

3. **Database Connection Pool**: Configured with proper timeouts and health checks:
   - Idle timeout: 10 minutes
   - Max lifetime: 30 minutes
   - Connection validation: 5 seconds
   - Leak detection: 60 seconds

4. **Session Management**: Reduced from 1 hour to 30 minutes for better security.

### Monitoring and Health Checks

The backend now exposes the following actuator endpoints:
- `/actuator/health` - Health status (used by Render)
- `/actuator/info` - Application information
- `/actuator/metrics` - Application metrics

### Frontend Build Optimization

The frontend build is optimized with:
- Minification enabled (terser)
- Source maps disabled for production
- Code splitting with vendor chunks
- Port configuration for both dev and preview modes

### Important Warnings

⚠️ **Vite Preview Mode**: The frontend uses `vite preview` which is intended for local preview, not production. For a production deployment, consider:
- Using a static file server like `serve` or `nginx`
- Deploying to a static hosting service (Render Static Sites, Netlify, Vercel)
- Using a CDN for better performance

⚠️ **Database Migrations**: The app uses `spring.jpa.hibernate.ddl-auto=update` which is not recommended for production. Consider:
- Using Flyway or Liquibase for database migrations
- Setting `ddl-auto` to `validate` in production
- Managing schema changes through migration scripts

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Spring Boot on Render](https://render.com/docs/deploy-spring-boot)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
