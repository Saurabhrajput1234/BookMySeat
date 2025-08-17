# Render Deployment Guide

This guide will help you deploy your Event Booking API to Render.com.

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 3. Deploy Database (PostgreSQL)

1. In Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `eventbooking-postgres`
   - **Database:** `eventbooking`
   - **User:** `postgres`
   - **Region:** Choose closest to your users
   - **Plan:** Free (or paid for production)
4. Click **"Create Database"**
5. **Save the connection details** (you'll need them)

### 4. Deploy Redis

1. Click **"New +"**
2. Select **"Redis"**
3. Configure:
   - **Name:** `eventbooking-redis`
   - **Plan:** Free (or paid for production)
4. Click **"Create Redis"**

### 5. Deploy Web Service (API)

1. Click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `eventbooking-api`
   - **Branch:** `main`
   - **Root Directory:** `EventBookingAPI` (if your API is in a subfolder)
   - **Environment:** `Docker`
   - **Dockerfile Path:** `./Dockerfile.render`
   - **Plan:** Free (or paid for production)

### 6. Configure Environment Variables

In the **Environment** section, add these variables:

#### Required Variables:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:10000
```

#### Database Connection:
```
ConnectionStrings__DefaultConnection=postgresql://username:password@hostname:port/database
```
*Use the connection string from your PostgreSQL service*

#### JWT Configuration:
```
JWT_KEY=your-super-secret-jwt-key-minimum-32-characters
JWT_ISSUER=EventBookingAPI
JWT_AUDIENCE=EventBookingAPIUsers
JWT_EXPIRES_IN_MINUTES=60
```

#### Stripe Configuration:
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

#### SendGrid Configuration:
```
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

#### Redis Configuration:
```
Redis__ConnectionString=redis://username:password@hostname:port
```
*Use the connection string from your Redis service*

### 7. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your application
3. Wait for the build to complete (5-10 minutes)

## 🔧 Configuration Files

### Dockerfile.render
Optimized for Render's environment with:
- Port 10000 (Render's default)
- Health checks
- Production optimizations

### render.yaml (Alternative)
Infrastructure as Code approach:
- Defines all services in one file
- Automatic service linking
- Environment variable management

## 📊 Monitoring & Management

### Health Checks
Your API includes a health endpoint at `/health` that Render will use to monitor your service.

### Logs
View logs in the Render dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. Monitor real-time application logs

### Scaling
Render automatically handles:
- Load balancing
- SSL certificates
- CDN
- Auto-scaling (paid plans)

## 🌐 Custom Domain (Optional)

1. In your service settings, go to **"Settings"**
2. Scroll to **"Custom Domains"**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update your DNS records as instructed
5. Render will automatically provision SSL certificates

## 💰 Pricing

### Free Tier Limitations:
- **Web Services:** Sleep after 15 minutes of inactivity
- **Databases:** 1GB storage, shared CPU
- **Redis:** 25MB memory
- **Bandwidth:** 100GB/month

### Paid Plans:
- **Starter:** $7/month - Always on, more resources
- **Standard:** $25/month - Autoscaling, priority support
- **Pro:** $85/month - Advanced features, dedicated resources

## 🔒 Security Best Practices

### Environment Variables
- Never commit real credentials to git
- Use Render's environment variable management
- Rotate keys regularly

### Database Security
- Use strong passwords
- Enable connection pooling
- Regular backups (automatic on paid plans)

### API Security
- Enable HTTPS only (automatic on Render)
- Use proper CORS settings
- Implement rate limiting

## 🚨 Troubleshooting

### Common Issues:

#### Build Failures
```bash
# Check Dockerfile.render syntax
docker build -f Dockerfile.render -t test .
```

#### Database Connection Issues
- Verify connection string format
- Check database service status
- Ensure database is in same region

#### Environment Variable Issues
- Check variable names (case-sensitive)
- Verify all required variables are set
- Use Render's variable validation

#### Port Issues
- Ensure ASPNETCORE_URLS uses port 10000
- Don't hardcode ports in your application

### Getting Help
1. Check Render's status page
2. Review build and runtime logs
3. Contact Render support (paid plans)
4. Community forums and documentation

## 📈 Performance Optimization

### Database
- Use connection pooling
- Implement proper indexing
- Consider read replicas (paid plans)

### Caching
- Utilize Redis for session storage
- Implement response caching
- Use CDN for static assets

### Monitoring
- Set up health checks
- Monitor response times
- Track error rates

## 🔄 CI/CD Integration

### Automatic Deployments
Render automatically deploys when you push to your connected branch:

```bash
# Deploy new version
git add .
git commit -m "Update API features"
git push origin main
# Render will automatically build and deploy
```

### Manual Deployments
You can also trigger manual deployments from the Render dashboard.

## 📱 API Endpoints

After deployment, your API will be available at:
- **Base URL:** `https://your-service-name.onrender.com`
- **Swagger:** `https://your-service-name.onrender.com/swagger`
- **Health Check:** `https://your-service-name.onrender.com/health`

## 🎉 Success!

Your Event Booking API is now deployed on Render with:
- ✅ Automatic HTTPS
- ✅ Load balancing
- ✅ Health monitoring
- ✅ Automatic deployments
- ✅ Managed database and Redis
- ✅ Professional infrastructure

Your API is ready for production use!